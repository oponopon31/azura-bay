// main.js — AZURA BAY bootstrap (GTA 6 fan open world).
// Loads the full Leonida data model, builds the 3D scene (three.js), wires the
// four-corner HUD, and runs the game loop. index.html loads this as a module.
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
import { MAP_POINTS, gamePos, REGIONS } from './leonidamap.js';
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

// ---- game state ------------------------------------------------------------
const state = {
  player: freshPlayer('jason'),
  world: freshWorld(1337),
  economy: { cash: 500, buckme: 0, marked: 0 },
  police: { stars: 0, starState: 'Clear', memory: freshMemory(), seenNow: false },
  missionsDone: new Set(),
  weapon: { name: 'Girardi ES9', mag: 15, reserve: 45 },
  vehicle: null,
  profileName: 'Professional',
  breakingPoint: false,
  cheatsActive: [],
  time: 0,
  gpsRoute: [],
  mapBlocks: [],
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

// ---- 3D scene ---------------------------------------------------------------
let renderer, scene, camera, playerMesh, clock;

function buildScene() {
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.getElementById('game').appendChild(renderer.domElement);
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x87b5d6);
  scene.fog = new THREE.Fog(0x87b5d6, 200, 900);
  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 2000);
  camera.position.set(0, 60, 80);
  camera.lookAt(0, 0, 0);
  scene.add(new THREE.AmbientLight(0xffffff, 0.7));
  const sun = new THREE.DirectionalLight(0xfff2cc, 1.2);
  sun.position.set(100, 200, 50);
  scene.add(sun);
  // Ground (Leonida landmass, game coords from gtabase/8).
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(2000, 2000),
    new THREE.MeshLambertMaterial({ color: 0x4a7c43 })
  );
  ground.rotation.x = -Math.PI / 2;
  scene.add(ground);
  // Lake Leonida (centre).
  const lake = new THREE.Mesh(
    new THREE.CircleGeometry(90, 32),
    new THREE.MeshLambertMaterial({ color: 0x2a6db0 })
  );
  lake.rotation.x = -Math.PI / 2;
  lake.position.set(-243.5, 0.5, -599.25);
  scene.add(lake);
  // City blocks around Vice City (game coords).
  const blockMat = new THREE.MeshLambertMaterial({ color: 0x8a8f96 });
  for (let i = 0; i < 40; i++) {
    const w = 12 + (i % 5) * 6;
    const d = 12 + (i % 3) * 8;
    const h = 8 + (i % 7) * 6;
    const b = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), blockMat);
    b.position.set(-60 + (i % 8) * 18, h / 2, -140 + Math.floor(i / 8) * 22);
    scene.add(b);
    state.mapBlocks.push({ x: 0, y: 0, w: 4, h: 4 });
  }
  // Mission markers (gold) at map points.
  const markerMat = new THREE.MeshBasicMaterial({ color: 0xffd34d });
  for (const p of MAP_POINTS.slice(0, 12)) {
    const pos = gamePos(p);
    const m = new THREE.Mesh(new THREE.SphereGeometry(2, 8, 8), markerMat);
    m.position.set(pos.x, 6, pos.z);
    scene.add(m);
  }
  // Player (Jason, blue; Lucia, pink on switch).
  playerMesh = new THREE.Mesh(
    new THREE.BoxGeometry(2, 4, 2),
    new THREE.MeshLambertMaterial({ color: 0x2a6db0 })
  );
  playerMesh.position.set(0, 2, 0);
  scene.add(playerMesh);
  clock = new THREE.Clock();
}

// ---- input ------------------------------------------------------------------
const keys = {};
window.addEventListener('keydown', (e) => { keys[e.key.toLowerCase()] = true; });
window.addEventListener('keyup', (e) => { keys[e.key.toLowerCase()] = false; });

// ---- game loop --------------------------------------------------------------
function loop() {
  requestAnimationFrame(loop);
  const dt = Math.min(0.05, clock.getDelta());
  state.time += dt;
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
  // Camera follows the player.
  camera.position.set(playerMesh.position.x, 55, playerMesh.position.z + 75);
  camera.lookAt(playerMesh.position.x, 0, playerMesh.position.z);
  // Day/night: sun dims at night.
  scene.background = new THREE.Color(isNightAt(state.world.time) ? 0x0a1420 : isDuskAt(state.world.time) ? 0xd67a4a : 0x87b5d6);
  // HUD.
  state.profileName = profileFromChaos(state.player.chaos).name;
  updateHudCorners(window.__hudEls, state);
  const mm = document.getElementById('minimap-canvas');
  if (mm) drawMinimap(mm.getContext('2d'), state);
  renderer.render(scene, camera);
}

// ---- boot -------------------------------------------------------------------
export function boot() {
  const totals = contentTotals();
  // Warn (not fail) if a content count is off — the selftest is the authority.
  for (const [k, v] of Object.entries({ missions: 91, weapons: 69, vehicles: 245, cheats: 61 })) {
    if (totals[k] !== v) console.warn(`content count off: ${k} = ${totals[k]} (expected ${v})`);
  }
  document.getElementById('title').textContent = GAME.title;
  document.getElementById('subtitle').textContent = GAME.subtitle;
  setBuildTag(document.getElementById('build-tag'), GAME.build);
  window.__hudEls = buildHud(document.getElementById('hud'));
  // Minimap canvas (rounded, satellite top-down).
  const mm = document.createElement('canvas');
  mm.id = 'minimap-canvas';
  mm.width = 180;
  mm.height = 180;
  document.getElementById('mapbox').appendChild(mm);
  // GPS route: player -> road -> Vice City marker (pink).
  state.gpsRoute = [{ x: 90, y: 90 }, { x: 90, y: 40 }, { x: 140, y: 40 }, { x: 140, y: 90 }];
  buildScene();
  // Starting weapon per protagonist.
  const start = startingSidearm(state.player.protagonist);
  state.weapon = { name: start.name, mag: start.capacity, reserve: start.capacity * 3 };
  // Mission rewards sweep wallet excess to BuckMe (Bab 23).
  const reward = 5000;
  const swept = enforceWalletCap(state.economy.cash + reward, state.economy.buckme);
  state.economy.cash = swept.cash;
  state.economy.buckme = swept.buckme;
  loop();
}

// Self-test entry (also runnable from the console).
window.AZURA_BAY = { state, contentTotals, runSelfTest, decideEnding, totalWealth };

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
