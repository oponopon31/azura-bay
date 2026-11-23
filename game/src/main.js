// main.js — AZURA BAY bootstrap (round 12).
// Loads the full Solmaris data model, builds the 3D city (three.js), wires the
// dispatch/objective/dialogue HUD, and runs the game loop. index.html loads
// this as a module.
// Round 12: gradient sky dome with sun disc + clouds (no more flat-colour
// sky), golden-hour light, brighter asphalt, district palettes, streetlights,
// market-plaza staging for the shootout, and a busier beachfront cover.
// The city is a real 3D scene: colour-varied facades with lit windows, roads
// with lane markings, sidewalks, palms, beach + water, golden-hour light,
// traffic, pedestrians, and a police pursuit with dispatch, roadblock and
// air unit. Shot poses (?shot=cover|shootout|dusk|heist|night) stage real
// gameplay scenes for screenshots; the title screen hides itself in shot mode.
import * as THREE from '../vendor/three.module.min.js';
import { GAME, WALLET_MAX } from './config.js';
import { MISSIONS, missionsInChapter } from './missions.js';
import { CHAPTERS, decideEnding, profileFromChaos } from './story.js';
import { SIDEARMS, startingSidearm } from './weapons.js';
import { LONGARMS } from './weapons-longarms.js';
import { MELEE } from './weapons-melee.js';
import { EXPLOSIVES } from './weapons-explosives.js';
import { SPECIALS } from './weapons-special.js';
import { CHEATS } from './cheats.js';
import { CHARACTERS } from './characters.js';
import { STRANGERS } from './strangers.js';
import { STATIONS } from './radio.js';
import { MAP_POINTS, gamePos, REGIONS } from './solmarismap.js';
import { COLLECTIBLE_GROUPS, totalCollectibles } from './collectibles.js';
import { STUNT_KINDS, ROBBERY_KINDS, totalStunts, totalRobberies } from './stunts.js';
import { MYSTERIES } from './mysteries.js';
import { SAFEHOUSES, GARAGES } from './properties.js';
import { ATTRIBUTES } from './attributes.js';
import { STAR_STATES, freshMemory, heatPerStar } from './police.js';
import { APPS } from './phone.js';
import { enforceWalletCap, totalWealth, FENCES } from './economy.js';
import { VEHICLES } from './vehicles-data.js';
import { FISH } from './fishing.js';
import { VARIANTS } from './variants.js';
import { ACHIEVEMENTS, MINI_GAMES } from './activities.js';
import { EVENT_TYPES, EVENT_LOCATIONS, totalEventCombinations } from './events.js';
import { freshPlayer, updatePlayer, clampToBounds } from './player.js';
import { freshWorld, trafficDensity } from './world.js';
import { isNightAt, isDuskAt } from './city.js';
import { buildHud, updateHudCorners, drawMinimap, setBuildTag } from './hud.js';
import { saveGame, loadGame } from './save.js';
import { SHOPS } from './gunshops.js';
import { runSelfTest } from './selftest.js';
import { FEATURED_MISSIONS, DISPATCH_UNITS } from './featured.js';

// ---- game state ------------------------------------------------------------
const state = {
  player: freshPlayer('cole'),
  world: freshWorld(1337),
  economy: { cash: 500, buckme: 0, marked: 0 },
  police: { stars: 0, starState: 'Clear', memory: freshMemory(), seenNow: false },
  missionsDone: new Set(),
  weapon: { name: 'Ferrante ES9', mag: 15, reserve: 45 },
  vehicle: null,
  profileName: 'Professional',
  breakingPoint: false,
  cheatsActive: [],
  time: 0,
  gpsRoute: [],
  mapBlocks: [],
  dispatch: [],
  featured: null,
  mission: null,
  dialogue: null,
  radio: 'Pulse FM',
  rank: { letter: 'B', title: 'FIXER', rp: 3900, rpMax: 5200 },
  location: { area: 'Azura Bay', street: 'Coral Drive', zone: 'NEUTRAL', value: 58 },
  airUnit: false,
  clockHour: 18.5,
  playerMm: { x: 90, y: 90 },
  missionMarker: { x: 140, y: 40 },
};

// ---- content totals (for the pause menu / dossier) --------------------------
export function contentTotals() {
  return {
    missions: MISSIONS.length,
    weapons: SIDEARMS.length + LONGARMS.length + MELEE.length + EXPLOSIVES.length + SPECIALS.length,
    vehicles: VEHICLES.length,
    cheats: CHEATS.length,
    strangers: STRANGERS.length,
    radioStations: STATIONS.length,
    characters: CHARACTERS.length,
    fish: FISH.length,
    variants: VARIANTS.length,
    achievements: ACHIEVEMENTS.length,
    collectibles: totalCollectibles(),
    stunts: totalStunts(),
    robberies: totalRobberies(),
    events: totalEventCombinations(),
    safehouses: SAFEHOUSES.length,
    garages: GARAGES.length,
    mapPoints: MAP_POINTS.length,
    regions: REGIONS.length,
    apps: APPS.length,
    shops: SHOPS.length,
  };
}

// ---- shot poses -------------------------------------------------------------
// Each pose is a real gameplay state: hour, wanted level, featured mission,
// in-car vs on-foot, and camera. Screenshots are taken from the live game.
const SHOT_POSES = {
  // Round 12 re-stage: cover moves to 16:30 golden hour (blue upper sky,
  // low warm sun, ocean + palms in frame); shootout moves to the market
  // plaza (cam 'plaza'); dusk steal moves to 17:30 golden hour so the gold
  // Zephyr sits in warm light, not a flat orange wash; heist stays night.
  cover:    { hour: 16.5, stars: 3, mission: 'f8', stage: 1, dialogue: 0, inCar: true,  cam: 'chase', drive: true },
  shootout: { hour: 14,   stars: 3, mission: 'f5', stage: 2, dialogue: 2, inCar: false, cam: 'plaza', drive: false },
  dusk:     { hour: 17.5, stars: 0, mission: 'f4', stage: 1, dialogue: 0, inCar: false, cam: 'steal', drive: false },
  heist:    { hour: 21.5, stars: 4, mission: 'f5', stage: 1, dialogue: 1, inCar: false, cam: 'heist', drive: false },
  night:    { hour: 21.5, stars: 1, mission: 'f2', stage: 0, dialogue: 0, inCar: false, cam: 'street', drive: false },
};
const params = new URLSearchParams(window.location.search);
const shotId = SHOT_POSES[params.get('shot')] ? params.get('shot') : null;
const pose = shotId ? SHOT_POSES[shotId] : { hour: 18.5, stars: 0, mission: 'f1', stage: 0, dialogue: 0, inCar: false, cam: 'street', drive: false };

// ---- 3D scene ---------------------------------------------------------------
let renderer, scene, camera, playerMesh, playerCar, clock;
let traffic = [], walkers = [], policeCars = [], heli = null, heliLight = null, rotor = null;
let missionBeacon = null, barrierMesh = null, coverChase = [], stealCar = null;
// Road grid: avenues run north-south, streets east-west. Coral Drive is x=90,
// the beachfront avenue with the sea to its east.
const WORLD = { avenues: [-90, -60, -30, 0, 30, 60, 90], streets: [-120, -90, -60, -30, 0, 30, 60, 90, 120] };

// Paint a building facade on a canvas: base colour, shading bands, and a
// grid of windows, some lit warm, some dark glass. Returns a three texture.
function facadeTexture(base, litRatio) {
  const c = document.createElement('canvas');
  c.width = 128; c.height = 256;
  const g = c.getContext('2d');
  g.fillStyle = base;
  g.fillRect(0, 0, 128, 256);
  // Ground floor in shadow, roofline catching the sun.
  g.fillStyle = 'rgba(0,0,0,0.22)';
  g.fillRect(0, 224, 128, 32);
  g.fillStyle = 'rgba(255,255,255,0.12)';
  g.fillRect(0, 0, 128, 8);
  // Window grid, deterministic per texture so screenshots are stable.
  let seed = 1234567;
  const rnd = () => { seed = (seed * 48271) % 2147483647; return seed / 2147483647; };
  for (let row = 0; row < 12; row++) {
    for (let col = 0; col < 6; col++) {
      const lit = rnd() < litRatio;
      g.fillStyle = lit ? '#ffcf7d' : '#263646';
      g.fillRect(8 + col * 20, 14 + row * 19, 13, 11);
    }
  }
  const tex = new THREE.CanvasTexture(c);
  if (THREE.SRGBColorSpace) tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

// A low-poly car: body, cabin, wheels, headlights and taillights. Police
// cars get a red/blue light bar whose halves flash in the loop.
function makeCar(color, police) {
  const group = new THREE.Group();
  const body = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.7, 4.6),
    new THREE.MeshLambertMaterial({ color }));
  body.position.y = 0.55;
  group.add(body);
  const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.6, 2.2),
    new THREE.MeshLambertMaterial({ color: police ? 0x111111 : 0x22303e }));
  cabin.position.set(0, 1.15, -0.3);
  group.add(cabin);
  const wheelMat = new THREE.MeshLambertMaterial({ color: 0x111111 });
  for (const [x, z] of [[-1.05, 1.5], [1.05, 1.5], [-1.05, -1.5], [1.05, -1.5]]) {
    const w = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.3, 10), wheelMat);
    w.rotation.z = Math.PI / 2;
    w.position.set(x, 0.42, z);
    group.add(w);
  }
  const hl = new THREE.MeshBasicMaterial({ color: 0xfff2b0 });
  for (const x of [-0.8, 0.8]) {
    const h = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.2, 0.1), hl);
    h.position.set(x, 0.6, 2.32);
    group.add(h);
  }
  const tl = new THREE.MeshBasicMaterial({ color: 0xff2a2a });
  for (const x of [-0.8, 0.8]) {
    const t = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.2, 0.1), tl);
    t.position.set(x, 0.6, -2.32);
    group.add(t);
  }
  if (police) {
    const barR = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.25, 0.5), new THREE.MeshBasicMaterial({ color: 0xff2222 }));
    barR.position.set(-0.45, 1.55, -0.3);
    const barB = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.25, 0.5), new THREE.MeshBasicMaterial({ color: 0x2244ff }));
    barB.position.set(0.45, 1.55, -0.3);
    group.add(barR); group.add(barB);
    group.userData.barR = barR; group.userData.barB = barB;
  }
  return group;
}

// A palm: leaning trunk with a crown of drooping fronds.
function makePalm() {
  const group = new THREE.Group();
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.42, 7, 6),
    new THREE.MeshLambertMaterial({ color: 0x7a5a38 }));
  trunk.position.y = 3.5;
  trunk.rotation.z = 0.08;
  group.add(trunk);
  const leafMat = new THREE.MeshLambertMaterial({ color: 0x2f8f4e });
  for (let i = 0; i < 6; i++) {
    const leaf = new THREE.Mesh(new THREE.ConeGeometry(0.7, 3.4, 4), leafMat);
    const a = (i / 6) * Math.PI * 2;
    leaf.position.set(Math.cos(a) * 1.1, 7.1, Math.sin(a) * 1.1);
    leaf.rotation.z = Math.cos(a) * 1.1;
    leaf.rotation.x = -Math.sin(a) * 1.1;
    group.add(leaf);
  }
  return group;
}

// A pedestrian: shirt, head, legs. Shirt colour varies per walker.
function makeWalker(shirt) {
  const group = new THREE.Group();
  const body = new THREE.Mesh(new THREE.BoxGeometry(0.9, 1.5, 0.5),
    new THREE.MeshLambertMaterial({ color: shirt }));
  body.position.y = 1.35;
  group.add(body);
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.32, 8, 8),
    new THREE.MeshLambertMaterial({ color: 0xd9a986 }));
  head.position.y = 2.45;
  group.add(head);
  const legs = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.9, 0.45),
    new THREE.MeshLambertMaterial({ color: 0x2c3e50 }));
  legs.position.y = 0.45;
  group.add(legs);
  return group;
}

// A beach umbrella: striped cone canopy on a pole.
function makeUmbrella(color) {
  const group = new THREE.Group();
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 2.6, 6),
    new THREE.MeshLambertMaterial({ color: 0x8a7a5a }));
  pole.position.y = 1.3;
  group.add(pole);
  const canopy = new THREE.Mesh(new THREE.ConeGeometry(2.2, 1.0, 8),
    new THREE.MeshLambertMaterial({ color }));
  canopy.position.y = 2.9;
  group.add(canopy);
  return group;
}

// A scooter with a helmeted rider.
function makeScooter(color) {
  const group = new THREE.Group();
  const wheelMat = new THREE.MeshLambertMaterial({ color: 0x111111 });
  for (const z of [0.75, -0.75]) {
    const w = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 0.2, 10), wheelMat);
    w.rotation.z = Math.PI / 2;
    w.position.set(0, 0.32, z);
    group.add(w);
  }
  const body = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.4, 1.5),
    new THREE.MeshLambertMaterial({ color }));
  body.position.y = 0.55;
  group.add(body);
  const seat = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.15, 0.6),
    new THREE.MeshLambertMaterial({ color: 0x1a1a1a }));
  seat.position.set(0, 0.85, -0.35);
  group.add(seat);
  const torso = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.7, 0.35),
    new THREE.MeshLambertMaterial({ color: 0xe67e22 }));
  torso.position.y = 1.25;
  group.add(torso);
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.24, 8, 8),
    new THREE.MeshLambertMaterial({ color: 0xd9a986 }));
  head.position.y = 1.8;
  group.add(head);
  const helm = new THREE.Mesh(new THREE.SphereGeometry(0.28, 8, 8),
    new THREE.MeshLambertMaterial({ color: 0xffd34d }));
  helm.position.y = 1.86;
  group.add(helm);
  return group;
}

// Round 12 sky: a vertical-gradient canvas texture for the sky dome —
// blue on top, warm gold at the horizon for golden hour, never one flat
// colour — with a soft sun glow, drifting cloud puffs, and stars at night.
function skyTexture(mode) {
  const c = document.createElement('canvas');
  c.width = 1024; c.height = 512;
  const g = c.getContext('2d');
  const grad = g.createLinearGradient(0, 0, 0, 512);
  if (mode === 'golden') {
    grad.addColorStop(0, '#2f6fd0'); grad.addColorStop(0.45, '#6fa8e0');
    grad.addColorStop(0.72, '#f2c184'); grad.addColorStop(1, '#ff9e57');
  } else if (mode === 'dusk') {
    grad.addColorStop(0, '#2c4a8a'); grad.addColorStop(0.5, '#7a7ec0');
    grad.addColorStop(0.75, '#e88a4d'); grad.addColorStop(1, '#ff8a4d');
  } else if (mode === 'night') {
    grad.addColorStop(0, '#050a18'); grad.addColorStop(0.6, '#101d38');
    grad.addColorStop(1, '#2a3a5c');
  } else {
    grad.addColorStop(0, '#2f7fd0'); grad.addColorStop(0.55, '#7db8e8');
    grad.addColorStop(0.8, '#cfe8f8'); grad.addColorStop(1, '#e8f4fc');
  }
  g.fillStyle = grad;
  g.fillRect(0, 0, 1024, 512);
  // Sun glow low on the horizon for golden hour / dusk.
  if (mode === 'golden' || mode === 'dusk') {
    const glow = g.createRadialGradient(300, 400, 10, 300, 400, 220);
    glow.addColorStop(0, 'rgba(255,214,140,0.95)');
    glow.addColorStop(0.4, 'rgba(255,170,90,0.55)');
    glow.addColorStop(1, 'rgba(255,150,70,0)');
    g.fillStyle = glow;
    g.fillRect(0, 0, 1024, 512);
  }
  // Soft cloud puffs across the upper sky (day + golden hour).
  if (mode !== 'night') {
    let seed = 987654321;
    const rnd = () => { seed = (seed * 48271) % 2147483647; return seed / 2147483647; };
    for (let i = 0; i < 26; i++) {
      const x = rnd() * 1024, y = 40 + rnd() * 190, r = 26 + rnd() * 55;
      const puff = g.createRadialGradient(x, y, 4, x, y, r);
      puff.addColorStop(0, 'rgba(255,255,255,0.85)');
      puff.addColorStop(1, 'rgba(255,255,255,0)');
      g.fillStyle = puff;
      g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.fill();
    }
  } else {
    // Stars at night.
    let seed = 13579;
    const rnd = () => { seed = (seed * 48271) % 2147483647; return seed / 2147483647; };
    for (let i = 0; i < 180; i++) {
      g.fillStyle = `rgba(255,255,255,${0.35 + rnd() * 0.6})`;
      g.fillRect(rnd() * 1024, rnd() * 260, 2, 2);
    }
  }
  const tex = new THREE.CanvasTexture(c);
  if (THREE.SRGBColorSpace) tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

// A flat white cloud drifting high above the city.
function makeCloud() {
  const group = new THREE.Group();
  const mat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.92, fog: false });
  for (const [x, y, s] of [[0, 0, 14], [10, 1, 10], [-9, 0.5, 9], [4, 3, 8]]) {
    const puff = new THREE.Mesh(new THREE.SphereGeometry(s, 8, 6), mat);
    puff.scale.y = 0.32;
    puff.position.set(x, y, 0);
    group.add(puff);
  }
  return group;
}

// A streetlight: dark pole + warm glowing lamp head, so night streets read.
function makeStreetlight() {
  const group = new THREE.Group();
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.18, 7, 6),
    new THREE.MeshLambertMaterial({ color: 0x2a2f36 }));
  pole.position.y = 3.5;
  group.add(pole);
  const arm = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.14, 0.14),
    new THREE.MeshLambertMaterial({ color: 0x2a2f36 }));
  arm.position.set(0.8, 6.9, 0);
  group.add(arm);
  const lamp = new THREE.Mesh(new THREE.SphereGeometry(0.42, 8, 8),
    new THREE.MeshBasicMaterial({ color: 0xffe9a8 }));
  lamp.position.set(1.6, 6.8, 0);
  group.add(lamp);
  const glow = new THREE.Mesh(new THREE.SphereGeometry(1.1, 8, 8),
    new THREE.MeshBasicMaterial({ color: 0xffe9a8, transparent: true, opacity: 0.22 }));
  glow.position.set(1.6, 6.8, 0);
  group.add(glow);
  return group;
}

// A market stall: striped canopy over a goods table, for the shootout plaza.
function makeMarketStall(canopyColor) {
  const group = new THREE.Group();
  const table = new THREE.Mesh(new THREE.BoxGeometry(4.4, 1.1, 2.6),
    new THREE.MeshLambertMaterial({ color: 0x7a5a38 }));
  table.position.y = 0.55;
  group.add(table);
  const goodsMat = new THREE.MeshLambertMaterial({ color: 0xe67e22 });
  const goodsMat2 = new THREE.MeshLambertMaterial({ color: 0x2f8f4e });
  for (let i = 0; i < 5; i++) {
    const crate = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.5, 0.7), i % 2 ? goodsMat : goodsMat2);
    crate.position.set(-1.7 + i * 0.85, 1.35, 0);
    group.add(crate);
  }
  const canopy = new THREE.Mesh(new THREE.BoxGeometry(5, 0.25, 3.4),
    new THREE.MeshLambertMaterial({ color: canopyColor }));
  canopy.position.y = 3.1;
  canopy.rotation.z = 0.06;
  group.add(canopy);
  for (const [x, z] of [[-2.2, -1.5], [2.2, -1.5], [-2.2, 1.5], [2.2, 1.5]]) {
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 2.1, 6),
      new THREE.MeshLambertMaterial({ color: 0x5a4a2a }));
    post.position.set(x, 2.05, z);
    group.add(post);
  }
  return group;
}

function buildScene() {
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.getElementById('game').appendChild(renderer.domElement);
  scene = new THREE.Scene();
  const dusk = isDuskAt(pose.hour);
  const night = isNightAt(pose.hour);
  // Round 12: golden hour is 16:00-18:00 — blue upper sky, warm low sun.
  const golden = pose.hour >= 16 && pose.hour < 18;
  const skyMode = night ? 'night' : golden ? 'golden' : dusk ? 'dusk' : 'day';
  const horizonColor = night ? 0x2a3a5c : dusk ? 0xe88a4d : golden ? 0xf2c184 : 0xbfe0f5;
  // Gradient sky dome with sun glow + clouds instead of a flat colour.
  const skyDome = new THREE.Mesh(
    new THREE.SphereGeometry(1200, 32, 15),
    new THREE.MeshBasicMaterial({ map: skyTexture(skyMode), side: THREE.BackSide, fog: false })
  );
  scene.add(skyDome);
  scene.fog = new THREE.Fog(horizonColor, 200, 900);
  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 2500);
  camera.position.set(0, 40, 90);
  camera.lookAt(0, 0, 0);
  // Sun disc in the sky: low warm disc at golden hour, high disc by day,
  // pale moon at night — always a visible light source, never an empty sky.
  const sunDisc = new THREE.Mesh(new THREE.SphereGeometry(night ? 22 : 30, 16, 12),
    new THREE.MeshBasicMaterial({ color: night ? 0xe8ecf5 : golden || dusk ? 0xffd27d : 0xfff6c8, fog: false }));
  if (night) sunDisc.position.set(320, 420, -750);
  else if (golden || dusk) sunDisc.position.set(-380, 120, -820);
  else sunDisc.position.set(240, 520, -420);
  scene.add(sunDisc);
  // Drifting clouds high above the city (day + golden hour).
  if (!night) {
    const cloudSpots = [[-260, 150, -500], [80, 180, -650], [330, 140, -420], [-80, 200, -800], [420, 170, -700], [-420, 160, -350]];
    for (const [x, y, z] of cloudSpots) {
      const cl = makeCloud();
      cl.position.set(x, y, z);
      scene.add(cl);
    }
  }
  // Light: warm low sun at golden hour, bright sky light by day, lamps +
  // hemisphere fill at night so the city still reads after dark.
  scene.add(new THREE.AmbientLight(0xffffff, night ? 0.5 : golden ? 0.75 : dusk ? 0.6 : 0.85));
  scene.add(new THREE.HemisphereLight(night ? 0x2a3a5c : 0x9fc8ee, night ? 0x1a2028 : 0x8a7a5a, night ? 0.55 : 0.45));
  const sun = new THREE.DirectionalLight(golden ? 0xffc07a : dusk ? 0xffb36b : 0xfff2cc, golden ? 1.9 : dusk ? 1.6 : 1.25);
  sun.position.set(golden ? -220 : dusk ? -150 : 100, golden ? 70 : dusk ? 60 : 200, 50);
  scene.add(sun);

  // Ground: grass inland, sand along the beachfront (east of Coral Drive).
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(2000, 2000),
    new THREE.MeshLambertMaterial({ color: 0x5d8a4a })
  );
  ground.rotation.x = -Math.PI / 2;
  scene.add(ground);
  const sand = new THREE.Mesh(
    new THREE.PlaneGeometry(65, 500),
    new THREE.MeshLambertMaterial({ color: 0xe8d29a })
  );
  sand.rotation.x = -Math.PI / 2;
  sand.position.set(137, 0.1, 0);
  scene.add(sand);
  // The bay itself, east of the sand.
  const water = new THREE.Mesh(
    new THREE.PlaneGeometry(300, 900),
    new THREE.MeshLambertMaterial({ color: dusk ? 0x4a7db0 : 0x2a7db0 })
  );
  water.rotation.x = -Math.PI / 2;
  water.position.set(320, 0.05, 0);
  scene.add(water);
  // Lake Solmaris, centre-north.
  const lake = new THREE.Mesh(
    new THREE.CircleGeometry(90, 32),
    new THREE.MeshLambertMaterial({ color: 0x2a6db0 })
  );
  lake.rotation.x = -Math.PI / 2;
  lake.position.set(-243.5, 0.5, -599.25);
  scene.add(lake);

  // Roads: sun-bleached grey asphalt (round 12: no more near-black roads)
  // with dashed centre lines and pale sidewalk plates on both sides.
  const roadMat = new THREE.MeshLambertMaterial({ color: 0x565b66 });
  const walkMat = new THREE.MeshLambertMaterial({ color: 0xb8bcc0 });
  const dashMat = new THREE.MeshBasicMaterial({ color: 0xf5e9c8 });
  for (const x of WORLD.avenues) {
    const road = new THREE.Mesh(new THREE.PlaneGeometry(10, 340), roadMat);
    road.rotation.x = -Math.PI / 2;
    road.position.set(x, 0.15, 0);
    scene.add(road);
    for (const side of [-6.5, 6.5]) {
      const walk = new THREE.Mesh(new THREE.PlaneGeometry(3, 340), walkMat);
      walk.rotation.x = -Math.PI / 2;
      walk.position.set(x + side, 0.12, 0);
      scene.add(walk);
    }
    for (let z = -160; z <= 160; z += 16) {
      const dash = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 5), dashMat);
      dash.rotation.x = -Math.PI / 2;
      dash.position.set(x, 0.2, z);
      scene.add(dash);
    }
  }
  for (const z of WORLD.streets) {
    const road = new THREE.Mesh(new THREE.PlaneGeometry(260, 10), roadMat);
    road.rotation.x = -Math.PI / 2;
    road.position.set(0, 0.15, z);
    scene.add(road);
    for (let x = -120; x <= 120; x += 16) {
      const dash = new THREE.Mesh(new THREE.PlaneGeometry(5, 0.5), dashMat);
      dash.rotation.x = -Math.PI / 2;
      dash.position.set(x, 0.2, z);
      scene.add(dash);
    }
  }

  // Buildings: colour-varied facades with lit windows, on sidewalk plates.
  // Blocks fill the grid between avenues; the beachfront row is taller and
  // pastel, the inland blocks mixed heights and colours.
  // Round 12 district palettes: pastel beachfront, cool glass downtown,
  // warm brick around the market plaza, mixed pastels elsewhere — streets
  // stop reading as one flat purple/yellow box canyon.
  const facades = ['#e8b4b8', '#f2d492', '#a8c8e8', '#c9a0dc', '#f5f5f0', '#e89b6d', '#9fd6c0', '#d98a8a'];
  const beachPal = ['#f2c9c0', '#f7dd9e', '#bcd8f0', '#e8b4d8', '#f5f0e6', '#ffd9a0', '#a8e0d0', '#f0a8a0'];
  const downtownPal = ['#8fb8d8', '#a8c8e8', '#7aa8c8', '#b8d0e0', '#9fc0d8', '#6a9ac0'];
  const marketPal = ['#d98a6a', '#c97a5a', '#e8a87c', '#b85c4a', '#e8c88a', '#d9a05a'];
  const awningCols = [0xe74c3c, 0x2f8f4e, 0x2e86c1, 0xf1c40f, 0x9b59b6, 0xe67e22];
  let bi = 0;
  for (let gx = 0; gx < 6; gx++) {
    for (let gz = 0; gz < 8; gz++) {
      const bx = -75 + gx * 30;
      const bz = -105 + gz * 30;
      if (bx > 80) continue; // beachfront stays open east of Coral Drive
      const w = 10 + (bi % 3) * 2;
      const d = 10 + (bi % 2) * 3;
      const h = 9 + (bi % 6) * 7;
      const plate = new THREE.Mesh(new THREE.BoxGeometry(w + 2, 0.4, d + 2), walkMat);
      plate.position.set(bx, 0.2, bz);
      scene.add(plate);
      const pal = bx >= 60 ? beachPal : bx <= -45 ? downtownPal : (Math.abs(bx) <= 15 && Math.abs(bz) <= 30) ? marketPal : facades;
      const tex = facadeTexture(pal[bi % pal.length], night ? 0.8 : (dusk || golden) ? 0.6 : 0.3);
      const b = new THREE.Mesh(new THREE.BoxGeometry(w, h, d),
        new THREE.MeshLambertMaterial({ map: tex }));
      b.position.set(bx, h / 2 + 0.4, bz);
      scene.add(b);
      // Street-level awning on every third building: a stripe of colour
      // at shopfront height so the ground floor is never bare concrete.
      if (bi % 3 === 0) {
        const awn = new THREE.Mesh(new THREE.BoxGeometry(w + 1, 0.7, 1.4),
          new THREE.MeshLambertMaterial({ color: awningCols[bi % awningCols.length] }));
        awn.position.set(bx, 3.4, bz + d / 2 + 0.6);
        scene.add(awn);
      }
      state.mapBlocks.push({ x: 90 + bx * 0.55, y: 90 + bz * 0.55, w: 8, h: 8 });
      bi++;
    }
  }
  // Beachfront towers along Coral Drive, taller and pastel, with neon signs
  // on their east faces that light up at dusk.
  const neonColors = [0xff4d9d, 0x4dd8ff, 0xffd34d, 0x7dff6a];
  for (let i = 0; i < 6; i++) {
    const z = -100 + i * 40;
    const h = 34 + (i % 3) * 12;
    const tex = facadeTexture(facades[(i + 2) % facades.length], night ? 0.8 : (dusk || golden) ? 0.6 : 0.35);
    const t = new THREE.Mesh(new THREE.BoxGeometry(14, h, 14),
      new THREE.MeshLambertMaterial({ map: tex }));
    t.position.set(72, h / 2, z);
    scene.add(t);
    const sign = new THREE.Mesh(new THREE.BoxGeometry(0.5, 2.2, 8),
      new THREE.MeshBasicMaterial({ color: neonColors[i % neonColors.length] }));
    sign.position.set(79.4, h * 0.7, z);
    scene.add(sign);
  }
  // Palms line the beach edge and the Coral Drive sidewalk.
  for (let z = -140; z <= 140; z += 24) {
    const palm = makePalm();
    palm.position.set(112, 0, z);
    scene.add(palm);
    if ((z / 24) % 2 === 0) {
      const palm2 = makePalm();
      palm2.position.set(80, 0, z + 8);
      scene.add(palm2);
    }
  }

  // Streetlights line Coral Drive and the plaza avenue: poles by day,
  // warm glowing lamps after dark so night streets read.
  for (let z = -140; z <= 140; z += 28) {
    for (const x of [84, 96]) {
      const lamp = makeStreetlight();
      lamp.position.set(x, 0, z);
      lamp.rotation.y = x === 84 ? 0 : Math.PI;
      scene.add(lamp);
    }
  }
  for (let z = -60; z <= 60; z += 30) {
    const lamp = makeStreetlight();
    lamp.position.set(-6, 0, z);
    scene.add(lamp);
  }

  // Traffic: coloured cars circulating on the avenues, plus parked cars.
  // Round 12: 24 circulating cars (was 14) so every shot has traffic.
  const trafficColors = [0xc0392b, 0x2e86c1, 0xf1c40f, 0xecf0f1, 0x1a1a1a, 0x7d3c98, 0x16a085, 0xe67e22, 0x2ecc71, 0xfd79a8];
  for (let i = 0; i < 24; i++) {
    const car = makeCar(trafficColors[i % trafficColors.length], false);
    const avenue = WORLD.avenues[i % WORLD.avenues.length];
    car.position.set(avenue + (i % 2 === 0 ? -2.5 : 2.5), 0, -140 + i * 12);
    car.rotation.y = i % 2 === 0 ? 0 : Math.PI;
    car.userData.dir = i % 2 === 0 ? 1 : -1;
    car.userData.speed = 9 + (i % 4) * 2;
    scene.add(car);
    traffic.push(car);
  }
  for (let i = 0; i < 8; i++) {
    const car = makeCar(trafficColors[(i + 3) % trafficColors.length], false);
    car.position.set(90 + (i % 2 === 0 ? -7.5 : 7.5), 0, -90 + i * 24);
    car.rotation.y = (i % 2 === 0 ? 0 : Math.PI) + (i % 3 === 0 ? 0.1 : 0);
    scene.add(car);
  }
  // Two parked cars on the avenue where on-foot poses start, so the street
  // shots always have traffic in frame.
  for (const [x, z, ry] of [[-7.5, -18, 0], [-7.5, 8, 0]]) {
    const car = makeCar(0x2e86c1, false);
    car.position.set(x, 0, z);
    car.rotation.y = ry;
    scene.add(car);
  }
  // Pedestrians stroll the sidewalks, clustered near the player's start so
  // the on-foot shots have people in frame. Round 12: 30 walkers (was 16).
  const shirtColors = [0xe74c3c, 0x3498db, 0xf1c40f, 0xecf0f1, 0x9b59b6, 0x1abc9c, 0xe67e22, 0xfd79a8, 0x2ecc71];
  for (let i = 0; i < 30; i++) {
    const w = makeWalker(shirtColors[i % shirtColors.length]);
    const lane = WORLD.avenues[i % WORLD.avenues.length] + (i % 2 === 0 ? -6.5 : 6.5);
    w.position.set(lane, 0, -44 + (i % 15) * 6);
    w.userData.dir = i % 2 === 0 ? 1 : -1;
    w.userData.speed = 1.2 + (i % 3) * 0.4;
    w.userData.lane = lane;
    scene.add(w);
    walkers.push(w);
  }
  // Beach strollers on the sand near the dusk pose.
  for (let i = 0; i < 10; i++) {
    const w = makeWalker(shirtColors[(i + 2) % shirtColors.length]);
    w.position.set(122 + (i % 3) * 5, 0, -20 + i * 8);
    w.userData.dir = i % 2 === 0 ? 1 : -1;
    w.userData.speed = 0.8;
    w.userData.lane = 122 + (i % 3) * 5;
    scene.add(w);
    walkers.push(w);
  }
  // Round 12 market plaza (shootout): six stalls with striped canopies
  // plus a browsing crowd, so the shootout is a busy plaza, not the same
  // street canyon as the other shots.
  if (shotId === 'shootout') {
    const stallCols = [0xe74c3c, 0xf1c40f, 0x2f8f4e, 0x2e86c1, 0xfd79a8, 0xe67e22];
    const stallSpots = [[-13, -16, 0.3], [11, -20, -0.2], [-15, 4, -0.4], [13, 0, 0.5], [-9, -30, 0.1], [9, -32, -0.3]];
    stallSpots.forEach(([x, z, ry], i) => {
      const stall = makeMarketStall(stallCols[i % stallCols.length]);
      stall.position.set(x, 0, z);
      stall.rotation.y = ry;
      scene.add(stall);
    });
    for (let i = 0; i < 12; i++) {
      const w = makeWalker(shirtColors[(i + 4) % shirtColors.length]);
      const cx = -12 + (i % 4) * 8, cz = -28 + Math.floor(i / 4) * 12;
      w.position.set(cx, 0, cz);
      w.userData.dir = i % 2 === 0 ? 1 : -1;
      // Browsers stand at the stalls (speed 0) so nobody wanders in
      // front of the plaza camera mid-shot.
      w.userData.speed = 0;
      w.userData.lane = cx;
      scene.add(w);
      walkers.push(w);
    }
  }
  // Round 12 steal pose: street life around the gold Zephyr — onlookers
  // on the WEST sidewalk, across the street from the camera, and two
  // parked cars up the road, so the frame is inhabited but nobody stands
  // between the camera and the car.
  if (shotId === 'dusk') {
    for (let i = 0; i < 6; i++) {
      const w = makeWalker(shirtColors[(i + 1) % shirtColors.length]);
      const lx = -8.5 - (i % 2) * 1.5;
      w.position.set(lx, 0, -12 + i * 5);
      w.userData.dir = i % 2 === 0 ? 1 : -1;
      w.userData.speed = 0.9;
      w.userData.lane = lx;
      scene.add(w);
      walkers.push(w);
    }
    for (const [x, z, col] of [[-7.5, -26, 0x16a085], [7.5, -34, 0xecf0f1]]) {
      const parked = makeCar(col, false);
      parked.position.set(x, 0, z);
      scene.add(parked);
    }
  }
  // Round 12 heist pose: vertical neon bars on the buildings flanking the
  // avenue, so the night bank job reads in colour, not darkness.
  if (shotId === 'heist') {
    const neonBars = [0xff4d9d, 0x4dd8ff, 0xffd34d, 0x7dff6a];
    for (let i = 0; i < 4; i++) {
      const bar = new THREE.Mesh(new THREE.BoxGeometry(0.6, 7, 1.2),
        new THREE.MeshBasicMaterial({ color: neonBars[i % neonBars.length] }));
      bar.position.set(i % 2 === 0 ? -8.5 : 8.5, 5, -18 + i * 12);
      scene.add(bar);
    }
  }

  // Player: on-foot figure + player car (one is shown per pose).
  playerMesh = new THREE.Group();
  const torso = new THREE.Mesh(new THREE.BoxGeometry(0.9, 1.5, 0.5),
    new THREE.MeshLambertMaterial({ color: 0x2a6db0 }));
  torso.position.y = 1.35;
  playerMesh.add(torso);
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.32, 8, 8),
    new THREE.MeshLambertMaterial({ color: 0xd9a986 }));
  head.position.y = 2.45;
  playerMesh.add(head);
  const legs = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.9, 0.45),
    new THREE.MeshLambertMaterial({ color: 0x2c3e50 }));
  legs.position.y = 0.45;
  playerMesh.add(legs);
  // Arms, so the figure reads as a person (not a torso block) at close
  // camera range, plus a held longarm so the weapon is visible in the
  // on-foot shot poses (shootout / dusk / heist).
  const armMat = new THREE.MeshLambertMaterial({ color: 0x2a6db0 });
  for (const x of [-0.6, 0.6]) {
    const arm = new THREE.Mesh(new THREE.BoxGeometry(0.25, 1.1, 0.3), armMat);
    arm.position.set(x, 1.35, 0);
    playerMesh.add(arm);
  }
  const gun = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.28, 1.5),
    new THREE.MeshLambertMaterial({ color: 0x9aa0a3 }));
  gun.position.set(0.72, 1.3, -0.15);
  // Round 12: the longarm points along the figure's facing (local +x after
  // the 3/4 turn), not across the chest — no more grey bar across the torso.
  gun.rotation.y = Math.PI / 2;
  playerMesh.add(gun);
  // Cheap character detail (round 7 polish): a cap and a backpack, so the
  // figure reads as a person from behind at close range. No face work —
  // the figure is always seen from behind.
  const capMat = new THREE.MeshLambertMaterial({ color: 0x1a1a1a });
  const cap = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.18, 0.6), capMat);
  cap.position.y = 2.74;
  playerMesh.add(cap);
  const brim = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.08, 0.3), capMat);
  brim.position.set(0, 2.7, -0.32);
  playerMesh.add(brim);
  const pack = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.9, 0.32),
    new THREE.MeshLambertMaterial({ color: 0x5a4a2a }));
  pack.position.set(0, 1.35, 0.42);
  playerMesh.add(pack);
  // Round 10: on-foot figures are near-natural size (1.15x) and turned
  // 3/4, so the environment and the car dominate the frame and the face
  // edge reads instead of a straight-from-behind block. The steal pose
  // turns further, toward the target car parked beside the player.
  if (shotId && !pose.drive) {
    playerMesh.scale.setScalar(1.15);
    playerMesh.rotation.y = shotId === 'dusk' ? -1.35 : -1.5;
  }
  playerMesh.position.set(0, 0, 0);
  scene.add(playerMesh);
  playerCar = makeCar(0xd4242c, false);
  // Driver visible above the cabin: head + shoulders in the driver's seat,
  // so the chase shots show a person driving, not an empty car.
  const driver = new THREE.Group();
  const dTorso = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.7, 0.45),
    new THREE.MeshLambertMaterial({ color: 0x2a6db0 }));
  dTorso.position.y = 1.5;
  driver.add(dTorso);
  const dHead = new THREE.Mesh(new THREE.SphereGeometry(0.3, 8, 8),
    new THREE.MeshLambertMaterial({ color: 0xd9a986 }));
  dHead.position.y = 2.05;
  driver.add(dHead);
  // Cap + seat back, so the driver reads as a seated person, not a
  // floating head + shoulders.
  const dCap = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.15, 0.55), capMat);
  dCap.position.y = 2.32;
  driver.add(dCap);
  const dSeat = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.8, 0.22),
    new THREE.MeshLambertMaterial({ color: 0x1a1a1a }));
  dSeat.position.set(0, 1.35, 0.32);
  driver.add(dSeat);
  driver.position.set(-0.55, 0, -0.3);
  playerCar.add(driver);
  playerCar.position.set(90, 0, 20);
  scene.add(playerCar);
  // Steal pose: the target car — a bright gold Aurelion Zephyr (mission 49's
  // car, the First Impressions target) — parked on the east side of the
  // avenue beside the player, so the car is the star of the frame. Its
  // position tracks the player in the loop.
  if (shotId === 'dusk') {
    stealCar = makeCar(0xffb300, false);
    stealCar.position.set(6, 0, -2);
    scene.add(stealCar);
  }
  // Heist pose: bags of marked bills at the character's feet, so the shot
  // reads as the bank job (vault context) rather than a plain street.
  if (shotId === 'heist') {
    const bagMat = new THREE.MeshLambertMaterial({ color: 0x2f7a3d });
    const bandMat = new THREE.MeshLambertMaterial({ color: 0xffd34d });
    for (const [x, z, ry] of [[1.6, -2.5, 0.4], [-1.4, -3.2, -0.3], [0.4, -4.2, 0.9]]) {
      const bag = new THREE.Group();
      const sack = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.65, 0.65), bagMat);
      sack.position.y = 0.33;
      bag.add(sack);
      const band = new THREE.Mesh(new THREE.BoxGeometry(0.97, 0.18, 0.67), bandMat);
      band.position.y = 0.4;
      bag.add(band);
      bag.position.set(x, 0, z);
      bag.rotation.y = ry;
      scene.add(bag);
    }
  }

  // Police: 6 pursuit cars spawn around the player's start (so they are in
  // frame from the first second) + roadblock + helicopter with spotlight.
  const startX = pose.drive ? 90 : 0;
  const startZ = pose.drive ? 20 : 0;
  const spawnOffsets = [[-2.5, -16], [2.5, -22], [-2.5, 18], [2.5, 28], [-3, -45], [3, -48]];
  for (let i = 0; i < 6; i++) {
    const pc = makeCar(0x111111, true);
    // White doors read as a police livery against the black body.
    const door = new THREE.Mesh(new THREE.BoxGeometry(2.25, 0.4, 1.6),
      new THREE.MeshLambertMaterial({ color: 0xecf0f1 }));
    door.position.set(0, 0.75, 0.4);
    pc.add(door);
    pc.position.set(startX + spawnOffsets[i][0], 0, startZ + spawnOffsets[i][1]);
    if (i >= 4) pc.scale.setScalar(1.2); // Roadblock cars read larger.
    scene.add(pc);
    policeCars.push(pc);
  }
  // Roadblock barrier: striped barricade held ahead of the player on the
  // road. Round 7 polish: taller + wider (13 wide, 2.4 tall with a top
  // rail) and held closer (30 units ahead), so it reads clearly in the
  // cover shot instead of a small distant stripe.
  barrierMesh = new THREE.Group();
  const barMat = new THREE.MeshLambertMaterial({ color: 0xff7a1a });
  const barMat2 = new THREE.MeshLambertMaterial({ color: 0xecf0f1 });
  for (let i = 0; i < 5; i++) {
    const seg = new THREE.Mesh(new THREE.BoxGeometry(2.6, 1.7, 0.5), i % 2 === 0 ? barMat : barMat2);
    seg.position.set(-5.2 + i * 2.6, 1.15, 0);
    barrierMesh.add(seg);
  }
  const rail = new THREE.Mesh(new THREE.BoxGeometry(13.4, 0.4, 0.45), barMat);
  rail.position.set(0, 2.2, 0);
  barrierMesh.add(rail);
  // Striped top rail: alternating orange/white segments, matching the body.
  for (let i = 0; i < 5; i++) {
    const rseg = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.42, 0.47), i % 2 === 0 ? barMat2 : barMat);
    rseg.position.set(-5.2 + i * 2.6, 2.2, 0);
    barrierMesh.add(rseg);
  }
  // Flashing beacons on the rail ends, so the barricade reads as a live
  // police roadblock, not a flat orange wall.
  const beaconMatL = new THREE.MeshBasicMaterial({ color: 0xff2222 });
  const beaconMatR = new THREE.MeshBasicMaterial({ color: 0xffb020 });
  for (const [x, mat] of [[-6, beaconMatL], [6, beaconMatR]]) {
    const b = new THREE.Mesh(new THREE.SphereGeometry(0.35, 8, 8), mat);
    b.position.set(x, 2.75, 0);
    barrierMesh.add(b);
  }
  barrierMesh.userData.beaconL = beaconMatL;
  barrierMesh.userData.beaconR = beaconMatR;
  for (const x of [-6.5, 6.5]) {
    const leg = new THREE.Mesh(new THREE.BoxGeometry(0.5, 1.3, 0.5), barMat);
    leg.position.set(x, 0.65, 0);
    barrierMesh.add(leg);
  }
  barrierMesh.position.set(90, 0, -2);
  scene.add(barrierMesh);

  // Round 9 cover dressing: extra traffic, a scooter, sidewalk pedestrians
  // and beach umbrellas that track the player car at fixed offsets (like
  // the roadblock), so the cover street is busy whenever the shot is taken.
  if (shotId === 'cover') {
    const coverOffsets = [
      { dx: -2.5, dz: -10, kind: 'car', color: 0x2e86c1 },
      { dx: 2.5, dz: -16, kind: 'car', color: 0xf1c40f },
      { dx: -2.5, dz: -26, kind: 'car', color: 0xecf0f1 },
      { dx: 2.5, dz: -34, kind: 'car', color: 0x16a085 },
      { dx: 4.6, dz: -13, kind: 'scooter', color: 0xc0392b },
      { dx: -6.5, dz: -8, kind: 'walker', color: 0xe74c3c },
      { dx: 6.5, dz: -18, kind: 'walker', color: 0x3498db },
      { dx: -6.5, dz: -28, kind: 'walker', color: 0xf1c40f },
      { dx: 6.5, dz: -6, kind: 'walker', color: 0x9b59b6 },
      { dx: 24, dz: -12, kind: 'umbrella', color: 0xff4d6d },
      { dx: 30, dz: -2, kind: 'umbrella', color: 0x4dd8ff },
      { dx: 22, dz: -24, kind: 'umbrella', color: 0xffd34d },
    ];
    for (const o of coverOffsets) {
      let mesh;
      if (o.kind === 'car') { mesh = makeCar(o.color, false); mesh.rotation.y = Math.PI; }
      else if (o.kind === 'scooter') { mesh = makeScooter(o.color); mesh.rotation.y = Math.PI; }
      else if (o.kind === 'walker') { mesh = makeWalker(o.color); mesh.rotation.y = Math.PI / 2; }
      else { mesh = makeUmbrella(o.color); }
      mesh.position.set(90 + o.dx, 0, 20 + o.dz);
      scene.add(mesh);
      coverChase.push({ mesh, dx: o.dx, dz: o.dz });
    }
  }

  // Helicopter: body, tail, beacon, spinning rotor, and a spotlight cone
  // tracking the player.
  heli = new THREE.Group();
  heli.scale.setScalar(1.5);
  const heliBody = new THREE.Mesh(new THREE.BoxGeometry(3.4, 1.4, 6),
    new THREE.MeshLambertMaterial({ color: 0x1a2a3a }));
  heli.add(heliBody);
  const tail = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.7, 4.5),
    new THREE.MeshLambertMaterial({ color: 0x1a2a3a }));
  tail.position.set(0, 0.3, -5);
  heli.add(tail);
  const beacon = new THREE.Mesh(new THREE.SphereGeometry(0.3, 8, 8),
    new THREE.MeshBasicMaterial({ color: 0xff2222 }));
  beacon.position.set(0, 0.9, 0);
  heli.add(beacon);
  heli.userData.beacon = beacon;
  rotor = new THREE.Group();
  const bladeMat = new THREE.MeshLambertMaterial({ color: 0x111111 });
  for (const a of [0, Math.PI / 2]) {
    const blade = new THREE.Mesh(new THREE.BoxGeometry(9, 0.12, 0.5), bladeMat);
    blade.rotation.y = a;
    rotor.add(blade);
  }
  rotor.position.y = 1;
  heli.add(rotor);
  const cone = new THREE.Mesh(new THREE.ConeGeometry(4.5, 22, 16, 1, true),
    new THREE.MeshBasicMaterial({ color: 0xfff2b0, transparent: true, opacity: night ? 0.3 : 0.16, side: THREE.DoubleSide }));
  cone.position.y = -11;
  cone.rotation.x = Math.PI;
  heli.add(cone);
  heliLight = new THREE.SpotLight(0xfff2b0, 60, 90, 0.35, 0.5);
  heliLight.position.set(0, 0, 0);
  heli.add(heliLight);
  heliLight.target.position.set(0, -45, 0);
  heli.add(heliLight.target);
  heli.position.set(102, 20, -14);
  scene.add(heli);

  // Mission beacon: gold pillar marking the next objective.
  missionBeacon = new THREE.Group();
  const beam = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 30, 12, 1, true),
    new THREE.MeshBasicMaterial({ color: 0xffd34d, transparent: true, opacity: 0.35, side: THREE.DoubleSide }));
  beam.position.y = 15;
  missionBeacon.add(beam);
  const orb = new THREE.Mesh(new THREE.SphereGeometry(1.4, 10, 10),
    new THREE.MeshBasicMaterial({ color: 0xffd34d }));
  orb.position.y = 8;
  missionBeacon.add(orb);
  missionBeacon.children[0].position.y = 8;
  missionBeacon.position.set(30, 0, -30);
  scene.add(missionBeacon);

  // Mission markers (gold) at map points.
  const markerMat = new THREE.MeshBasicMaterial({ color: 0xffd34d });
  for (const p of MAP_POINTS.slice(0, 12)) {
    const pos = gamePos(p);
    const m = new THREE.Mesh(new THREE.SphereGeometry(2, 8, 8), markerMat);
    m.position.set(pos.x, 6, pos.z);
    scene.add(m);
  }
  clock = new THREE.Clock();
}

// ---- input ------------------------------------------------------------------
const keys = {};
window.addEventListener('keydown', (e) => { keys[e.key.toLowerCase()] = true; });
window.addEventListener('keyup', (e) => { keys[e.key.toLowerCase()] = false; });

// ---- game loop --------------------------------------------------------------
let frames = 0;
function loop() {
  requestAnimationFrame(loop);
  const dt = Math.min(0.05, clock.getDelta());
  state.time += dt;
  frames++;

  // Player: drive the beachfront avenue (chase poses) or walk (on-foot poses).
  const speedKmh = pose.drive ? 96 : 0;
  if (pose.drive) {
    // Chase runs north up Coral Drive (x = 90): open beach and sky to the
    // east, so the helicopter and roadblock stay in the open, in frame.
    playerCar.position.x = 90;
    playerCar.position.z -= 14 * dt;
    if (playerCar.position.z < -110) playerCar.position.z = 110;
    playerCar.visible = true;
    playerMesh.visible = false;
    if (state.vehicle) state.vehicle.speedKmh = speedKmh;
  } else if (shotId) {
    playerMesh.position.z += 1.2 * dt;
    if (playerMesh.position.z > 40) playerMesh.position.z = -40;
    playerMesh.visible = true;
    playerCar.visible = false;
    if (pose.cam === 'beach') {
      playerMesh.position.x = 118;
      playerMesh.position.z = Math.sin(state.time * 0.1) * 10;
    }
    // The steal car tracks the player along the avenue, parked on the
    // east side of the road, nose pointing down the street.
    if (stealCar) {
      stealCar.position.set(playerMesh.position.x + 6, 0, playerMesh.position.z - 2);
      stealCar.rotation.y = 0;
    }
  } else {
    // Free roam: WASD moves the player on foot.
    const speed = 24 * dt;
    let dx = 0, dz = 0;
    if (keys['w'] || keys['arrowup']) dz -= speed;
    if (keys['s'] || keys['arrowdown']) dz += speed;
    if (keys['a'] || keys['arrowleft']) dx -= speed;
    if (keys['d'] || keys['arrowright']) dx += speed;
    if (dx || dz) {
      const pos = clampToBounds(playerMesh.position.x + dx, playerMesh.position.z + dz);
      playerMesh.position.x = pos.x;
      playerMesh.position.z = pos.z;
      updatePlayer(state.player, dt, { time: state.time, aiming: !!keys['shift'], sprinting: !!keys['shift'], inCrowd: false });
    }
    playerMesh.visible = true;
    playerCar.visible = false;
  }

  // Traffic circulates; pedestrians stroll the sidewalks.
  for (const car of traffic) {
    car.position.z += car.userData.dir * car.userData.speed * dt;
    if (car.position.z > 150) car.position.z = -150;
    if (car.position.z < -150) car.position.z = 150;
  }
  for (const w of walkers) {
    w.position.z += w.userData.dir * w.userData.speed * dt;
    if (w.position.z > 140) { w.position.z = -140; }
    if (w.position.z < -140) { w.position.z = 140; }
    w.position.x = w.userData.lane + Math.sin(state.time * 0.7 + w.position.z) * 0.4;
  }

  // Police: chase cars close on the player, staying ON the road (never
  // inside buildings); roadblock cars hold ahead.
  const px = pose.drive ? playerCar.position.x : playerMesh.position.x;
  const pz = pose.drive ? playerCar.position.z : playerMesh.position.z;
  const pursuit = state.police.stars > 0;
  // The road the pursuit runs on: Coral Drive (x = 90) while driving, the
  // nearest avenue while on foot.
  const roadX = pose.drive ? 90 : WORLD.avenues.reduce((a, b) => (Math.abs(b - px) < Math.abs(a - px) ? b : a));
  policeCars.forEach((pc, i) => {
    if (i < 4 && pursuit) {
      // Two units ahead of the player (visible in frame), two trailing,
      // all in the lanes of the same road.
      const tx = roadX + [-2.5, 2.5, -2.5, 2.5][i];
      const tz = pz + [-16, -22, 18, 28][i];
      pc.position.x += (tx - pc.position.x) * Math.min(1, dt * 4);
      pc.position.z += (tz - pc.position.z) * Math.min(1, dt * 4);
      pc.rotation.y = Math.atan2(px - pc.position.x, pz - pc.position.z);
      // Flash the light bar.
      const on = Math.floor(state.time * 6) % 2 === 0;
      pc.userData.barR.material.color.setHex(on ? 0xff2222 : 0x551111);
      pc.userData.barB.material.color.setHex(on ? 0x111155 : 0x2244ff);
    }
    if (i >= 4 && pose.drive) {
      // Roadblock stays ahead of the player car, on the road — close
      // enough (22–30 units) that the barrier + cars read clearly in the
      // cover shot, with light bars flashing. The barrier sits BETWEEN
      // the player and the two cars, so it is the nearest, most
      // prominent element instead of hiding behind them.
      pc.position.z = pz - 27 - (i - 4) * 3;
      pc.position.x = roadX + (i === 4 ? -3 : 3);
      if (barrierMesh) { barrierMesh.position.z = pz - 22; barrierMesh.position.x = roadX; }
      const on = Math.floor(state.time * 6) % 2 === 0;
      pc.userData.barR.material.color.setHex(on ? 0xff2222 : 0x551111);
      pc.userData.barB.material.color.setHex(on ? 0x111155 : 0x2244ff);
      // Roadblock beacons flash in step with the police light bars.
      if (barrierMesh.userData.beaconL) {
        barrierMesh.userData.beaconL.color.setHex(on ? 0xff2222 : 0x551111);
        barrierMesh.userData.beaconR.color.setHex(on ? 0x552200 : 0xffb020);
      }
    }
  });
  // Cover dressing tracks the player car at fixed offsets (like the
  // roadblock), so the busy street stays in frame for the whole chase.
  if (shotId === 'cover') {
    for (const p of coverChase) p.mesh.position.set(90 + p.dx, 0, pz + p.dz);
  }
  // Helicopter circles just ahead of the player, low, east of the road over
  // the open beach — clearly inside the chase camera's frame — spotlight tracking.
  if (heli) {
    const a = state.time * 0.35;
    // Shot poses: the helicopter hovers over the road ahead of the player
    // (low, y=12) so it stays in the close camera's frame; the old
    // px+12 offset put it inside the east-side building row for the
    // on-foot poses at x=0, where the towers hid it. Free roam keeps the
    // higher beach-side hover.
    const overRoad = shotId && !pose.drive;
    heli.position.set(
      px + (overRoad ? 2 : 12) + Math.cos(a) * 4,
      shotId ? 12 : 20,
      pz - (overRoad ? 22 : 28) + Math.sin(a) * 5);
    heli.lookAt(px, 0, pz);
    rotor.rotation.y = state.time * 22;
    heli.visible = pursuit || shotId === 'cover' || shotId === 'heist';
    state.airUnit = heli.visible;
    if (heli.userData.beacon) heli.userData.beacon.material.color.setHex(Math.floor(state.time * 4) % 2 === 0 ? 0xff2222 : 0x771111);
    heliLight.target.position.set(px - heli.position.x, -20, pz - heli.position.z);
  }
  // Mission beacon bobs.
  if (missionBeacon) missionBeacon.children[0].position.y = 8 + Math.sin(state.time * 2) * 0.8;

  // Camera per pose (round 7 camera fix, round 10 reframe): the cover
  // stays a low close chase cam, car fills the lower frame with the driver
  // visible above the cabin; lookAt is up and right so the helicopter and
  // the roadblock ahead stay in frame. On-foot (street / heist): pulled
  // back and 3/4 from the right, character smaller so the street, police
  // and towers dominate. Steal: low 3/4 from the south-east, the Zephyr
  // fills the frame with the character standing beside it, facing the car.
  // Beach (dusk): close 3/4 from the south-east, character large, neon
  // towers + strollers in frame.
  if (pose.cam === 'chase') {
    // Round 12: look up and EAST toward the beach and ocean, so the cover
    // shows palms, sand and water beside the chase, not just the road.
    camera.position.set(px - 3.5, 2.9, pz + 8.5);
    camera.lookAt(px + 11, 3.5, pz - 25);
  } else if (pose.cam === 'plaza') {
    // Market-plaza shootout: higher, wider 3/4 so stalls, crowd, police
    // and the warm-brick plaza buildings all read in one frame, and a
    // passing pedestrian stays below the frame instead of filling it.
    camera.position.set(px + 10, 8, pz + 16);
    camera.lookAt(px - 3, 1.5, pz - 16);
  } else if (pose.cam === 'chase-side') {
    // Unused by the submitted poses since the heist went on-foot; kept
    // close anyway so no pose ever falls back to a wide shot.
    camera.position.set(px + 7, 4, pz + 10);
    camera.lookAt(px, 2, pz - 25);
  } else if (pose.cam === 'beach') {
    camera.position.set(px + 6, 3.2, pz + 8.5);
    camera.lookAt(px - 4, 1.8, pz - 15);
  } else if (pose.cam === 'steal') {
    // Low, close 3/4 from the south-east: the Zephyr fills the frame with
    // the character beside it, onlookers across the street behind the car.
    camera.position.set(px + 10, 3.0, pz + 7);
    camera.lookAt(px + 3, 1.2, pz - 2);
  } else if (pose.cam === 'heist') {
    camera.position.set(px + 4.5, 3.6, pz + 10.5);
    camera.lookAt(px - 1, 1.2, pz - 15);
  } else if (shotId) {
    camera.position.set(px + 4.5, 3.6, pz + 10.5);
    camera.lookAt(px - 1, 1.2, pz - 15);
  } else {
    camera.position.set(playerMesh.position.x, 55, playerMesh.position.z + 75);
    camera.lookAt(playerMesh.position.x, 0, playerMesh.position.z);
  }

  // HUD: dispatch distances from live police positions, mission timer, dialogue.
  const mm = (x, z) => ({ x: 90 + x * 0.55, y: 90 + z * 0.55 });
  state.dispatch = DISPATCH_UNITS.slice(0, state.police.stars > 0 ? 10 : 2).map((u, i) => {
    const pc = policeCars[i % policeCars.length];
    const d = pc ? Math.hypot(pc.position.x - px, pc.position.z - pz) : 120 + i * 40;
    return { ...u, distance: d, mm: pc ? mm(pc.position.x, pc.position.z) : mm(60 + i * 10, 60) };
  });
  if (state.mission && state.mission.timer != null) {
    state.mission.timer = Math.max(0, state.mission.timer - dt);
  }
  // Dialogue cycles through the mission lines every 7s.
  const fm = state.featured;
  if (fm && fm.dialogue.length) {
    const idx = Math.floor(state.time / 7) % fm.dialogue.length;
    state.dialogue = fm.dialogue[idx];
  }
  state.playerMm = mm(px, pz);
  state.missionMarker = mm(30, -30);
  state.profileName = profileFromChaos(state.player.chaos).name;
  updateHudCorners(window.__hudEls, state);
  const mmCanvas = document.getElementById('minimap-canvas');
  if (mmCanvas) drawMinimap(mmCanvas.getContext('2d'), state);
  renderer.render(scene, camera);
  if (frames === 3) {
    window.__shotReady = true;
    console.log('AZURA_BAY_READY shot=' + (shotId || 'free') + ' stars=' + state.police.stars);
  }
}

// ---- boot -------------------------------------------------------------------
export function boot() {
  const totals = contentTotals();
  for (const [k, v] of Object.entries({ missions: 91, weapons: 69, vehicles: 245, cheats: 61 })) {
    if (totals[k] !== v) console.warn(`content count off: ${k} = ${totals[k]} (expected ${v})`);
  }
  document.getElementById('title').textContent = GAME.title;
  setBuildTag(document.getElementById('build-tag'), GAME.build);
  window.__hudEls = buildHud(document.getElementById('hud'));
  const mmCanvas = document.createElement('canvas');
  mmCanvas.id = 'minimap-canvas';
  mmCanvas.width = 150;
  mmCanvas.height = 150;
  document.getElementById('mapbox').appendChild(mmCanvas);

  // Pose state: hour, wanted level, featured mission, vehicle.
  state.world.time = pose.hour;
  state.police.stars = pose.stars;
  state.police.starState = STAR_STATES[pose.stars] ? STAR_STATES[pose.stars].name : 'Clear';
  const fm = FEATURED_MISSIONS.find((m) => m.id === pose.mission) || FEATURED_MISSIONS[0];
  state.featured = fm;
  const fIdx = FEATURED_MISSIONS.indexOf(fm);
  state.mission = {
    n: fIdx + 1, title: fm.title, stage: fm.stages[pose.stage] || fm.stages[0],
    objective: fm.objective, stageIndex: pose.stage + 1, stageCount: fm.stages.length,
    next: fm.stages[pose.stage + 1] || 'Complete the mission', timer: fm.timer,
  };
  state.clockHour = pose.hour;
  state.location = pose.cam === 'beach'
    ? { area: 'Coral Strand', street: 'Coral Drive', zone: 'NEUTRAL', value: 58 }
    : { area: 'Azura Bay', street: 'Coral Drive', zone: 'NEUTRAL', value: 58 };
  state.dialogue = fm.dialogue[pose.dialogue] || fm.dialogue[0];
  if (pose.inCar) {
    state.vehicle = { name: 'Velluto Furia', fuel: 78, health: 0.92, speedKmh: 96, body: 0.86, tires: 0.94 };
  }
  // Steal pose: the target car is parked beside the player — its readout
  // (name + condition) shows bottom-right, and the interaction prompt +
  // objective bar stage the lift (First Impressions, stage 2: lift the
  // Aurelion Zephyr without tripping the alarm).
  if (shotId === 'dusk') {
    state.vehicle = { name: 'Aurelion Zephyr', fuel: 64, health: 0.97, speedKmh: 0, body: 0.97, tires: 1 };
    state.prompt = { key: 'E', text: 'STEAL AURELION ZEPHYR' };
    state.objectiveBar = 'Steal the Aurelion Zephyr on Coral Drive';
  }
  state.gpsRoute = [{ x: 90, y: 90 }, { x: 90, y: 40 }, { x: 140, y: 40 }, { x: 140, y: 90 }];
  buildScene();
  const start = startingSidearm(state.player.protagonist);
  state.weapon = { name: start.name, mag: start.capacity, reserve: start.capacity * 3 };
  const reward = 5000;
  const swept = enforceWalletCap(state.economy.cash + reward, state.economy.buckme);
  state.economy.cash = swept.cash;
  state.economy.buckme = swept.buckme;
  if (shotId) {
    const ts = document.getElementById('title-screen');
    if (ts) ts.style.display = 'none';
  }
  loop();
}

// Self-test entry (also runnable from the console).
window.AZURA_BAY = { state, contentTotals, runSelfTest, decideEnding, totalWealth };

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
