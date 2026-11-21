// main.js — Boot and the game loop: input, lighting and day/night, camera,
// menus, autosave and the debug hook. One job: wire every system together.
// Every system is wired in dependency-safe order (vehicleDb, radio,
// gunshops, cheats, strangers, collectibles, stunts, mysteries, properties,
// attributes, phone, events, economy, fishing, activities, world,
// leonidamap, variants), with the key bindings (B map, U phone, V radio
// station, O Photo Studio, T Auto-Drive / Quick GPS, Y surrender,
// H hide in car, J call Joey), and a debug snapshot with the systems'
// counts. Every system gains a small read helper (totalWealth,
// expandedCount, completedCount/remainingCount, crowdSize, ...), the
// debug snapshot reports the round-3 fields, and the pause menu shows a
// build tag so a screenshot always says which round it came from.
// Round 5: the loop helpers are renamed (refreshLighting, handleKeyDown,
// handleKeyUp), selftestOn becomes selftestMode, and the shared state
// parameter is Game instead of G. Behaviour unchanged.

import { createCharacters } from './characters.js';
import { createVariants } from './variants.js';
import { createLeonidaMap } from './leonidamap.js';
import { createWorld } from './world.js';
import { createActivities } from './activities.js';
import { createFishing } from './fishing.js';
import { createEconomy } from './economy.js';
import { createEvents } from './events.js';
import { createPhone } from './phone.js';
import { createAttributes } from './attributes.js';
import { createProperties } from './properties.js';
import { createMysteries } from './mysteries.js';
import { createStunts } from './stunts.js';
import { createCollectibles } from './collectibles.js';
import { createStrangers } from './strangers.js';
import { createCheats } from './cheats.js';
import { createGunshops } from './gunshops.js';
import { createRadio } from './radio.js';
import { createVehicleDb } from './vehicles-data.js';
import { createSelfTest } from './selftest.js';
import { applyShot } from './shots.js';
import { createSave } from './save.js';
import { createHud } from './hud.js';
import { createMissions } from './missions.js';
import { createPolice } from './police.js';
import { createWeapons } from './weapons.js';
import { createCombat } from './combat.js';
import { createDriving } from './driving.js';
import { createPlayer } from './player.js';
import { spawnPedestrians, updatePedestrians, knockDownPed, stunPed, interactAnimal, panicNearby } from './pedestrians.js';
import { spawnParkedCars, spawnTraffic, updateVehicles } from './vehicles.js';
import { buildCity } from './city.js';
import { createEffects } from './effects.js';
import { createAudio } from './audio.js';
import { START_CASH, MISSIONS } from './config.js';
import { makeRng } from './rng.js';
import * as THREE from 'three';

const params = new URLSearchParams(location.search);
const seed = Number(params.get('seed') || 7);
const shotName = params.get('shot');
const selftestMode = params.has('selftest');

const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
if (selftestMode) renderer.shadowMap.enabled = false; // self-test: sim speed over shadows
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;
document.getElementById('game').appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.fog = new THREE.Fog(0xf2a35e, 120, 700);
const camera = new THREE.PerspectiveCamera(62, innerWidth / innerHeight, 0.1, 1500);
camera.position.set(-40, 6, 265);

// ---- Lights ----
const sun = new THREE.DirectionalLight(0xffd9a0, 2.4);
sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048);
sun.shadow.camera.left = -260; sun.shadow.camera.right = 260;
sun.shadow.camera.top = 260; sun.shadow.camera.bottom = -260;
sun.shadow.camera.near = 10; sun.shadow.camera.far = 900;
sun.shadow.bias = -0.0006;
scene.add(sun);
scene.add(sun.target);
const hemi = new THREE.HemisphereLight(0xbfd9ff, 0x8a6a4a, 0.7);
scene.add(hemi);

// ---- The shared game context ----
const Game = {
  renderer, scene, camera,
  rng: makeRng(seed),
  seed,
  elapsed: 0,
  timeOfDay: 17.5,       // golden hour
  dayNightCycle: true,   // shots freeze this for reproducibility
  mode: 'menu',          // menu | playing | paused | busted | wasted
  money: START_CASH,
  cars: [], peds: [],
  stats: { carsStolen: 0, shotsFired: 0, punches: 0, copsDown: 0, crimes: 0, missionsDone: 0, stuns: 0, civiliansHurt: 0, psycho: false, relationship: 40, lastMissionWho: null, choices: {} },
  input: { keys: {}, mouseDown: false, dragging: false },
  shotCamera: null,
  // Turbo: the self-test runs the sim 12x with rare renders. A ?turbo=N
  // query lets a scripted probe run the sim fast without the self-test.
  turbo: selftestMode ? 12 : (Math.max(1, Number(params.get('turbo') || 1)) || 1),
  autosaveTimer: 0,
  atSafehouse: false,
};
Game.audio = createAudio();
Game.effects = createEffects(Game);
Game.city = buildCity(Game);
Game.player = createPlayer(Game);
Game.driving = createDriving(Game);
Game.combat = createCombat(Game);
Game.weapons = createWeapons(Game);
Game.police = createPolice(Game);
Game.missions = createMissions(Game);
Game.hud = createHud(Game);
Game.save = createSave(Game);
// ---- Round-2 systems (dependency-safe order) ----
Game.vehicleDb = createVehicleDb();
Game.world = createWorld(Game);
Game.settings = Game.world.settings;
Game.settings.scopeFirstPerson = false; // player.js reads this for scope zoom
// police.js reads Game.wardrobe.currentOutfit() for Heat memory.
Game.wardrobe = {
  currentOutfit: () => (Game.world ? `${Game.world.wardrobe.hat}-${Game.world.wardrobe.hoodie}${Game.world.wardrobe.glasses ? '-shades' : ''}` : 'default'),
};
Game.radio = createRadio(Game);
Game.gunshops = createGunshops(Game);
Game.cheats = createCheats(Game);
Game.strangers = createStrangers(Game);
Game.collectibles = createCollectibles(Game);
Game.stunts = createStunts(Game);
Game.mysteries = createMysteries(Game);
Game.properties = createProperties(Game);
Game.attributes = createAttributes(Game);
Game.phone = createPhone(Game);
Game.events = createEvents(Game);
Game.economy = createEconomy(Game);
Game.fishing = createFishing(Game);
Game.activities = createActivities(Game);
Game.achievements = Game.activities; // save.js reads Game.achievements
Game.leonidaMap = createLeonidaMap(Game);
Game.variants = createVariants(Game);
Game.characters = createCharacters(Game);
Game.pedestrians = { knockDownPed, stunPed, interactAnimal, panicNearby };
spawnParkedCars(Game);
spawnTraffic(Game);
spawnPedestrians(Game);

// ---- Sky / sun from the time of day ----
const SKY_STOPS = [
  [0, 0x0b1220], [5, 0x1a2340], [6.5, 0xff9a5c], [8, 0x87b5d9],
  [16.5, 0x8fb8d8], [17.5, 0xffb36b], [18.7, 0xe86a4e], [19.5, 0x2e3a5e],
  [21, 0x0e1626], [24, 0x0b1220],
];
function refreshLighting() {
  const t = Game.timeOfDay;
  const elev = Math.sin(((t - 6) / 12) * Math.PI); // 1 at noon, 0 at 6/18, <0 at night
  const azim = ((t - 6) / 24) * Math.PI * 2;
  const sunDir = new THREE.Vector3(Math.cos(azim), Math.max(0.08, elev), Math.sin(azim) * 0.6).normalize();
  const focus = Game.player.pos;
  sun.position.set(focus.x + sunDir.x * 320, sunDir.y * 320 + 40, focus.z + sunDir.z * 320);
  sun.target.position.copy(focus);
  const warmth = THREE.MathUtils.clamp(1 - Math.abs(elev) * 1.4, 0.15, 1);
  sun.color.setHex(0xffd9a0).lerp(new THREE.Color(0xff8a3c), warmth * 0.8);
  sun.intensity = THREE.MathUtils.clamp(elev, 0, 1) * 2.4 + 0.15;
  hemi.intensity = 0.3 + THREE.MathUtils.clamp(elev, 0, 1) * 0.55;
  const sky = skyTintAt(t);
  scene.background = sky;
  scene.fog.color.copy(sky);
  Game.city.update(0, t);
}

function skyTintAt(t) {
  for (let i = 0; i < SKY_STOPS.length - 1; i++) {
    const [t0, c0] = SKY_STOPS[i], [t1, c1] = SKY_STOPS[i + 1];
    if (t >= t0 && t <= t1) {
      const f = (t - t0) / (t1 - t0);
      return new THREE.Color(c0).lerp(new THREE.Color(c1), f);
    }
  }
  return new THREE.Color(0x87b5d9);
}

// ---- Input ----
const canvas = renderer.domElement;
function handleKeyUp(e) {
  Game.input.keys[e.code] = false;
  if (e.code === 'Tab') Game.hud.showWeaponWheel(false);
}
function handleKeyDown(e) {
  if (e.repeat) return;
  Game.input.keys[e.code] = true;
  Game.audio.ensure();
  // Cheat combos are typed as arrow keys while the phone is open.
  if (Game.hud.phoneVisible() && e.code.startsWith('Arrow')) {
    Game.phone.typeComboKey(e.code);
    return;
  }
  // Tab (hold) opens the weapon wheel; preventDefault keeps the browser
  // from moving focus away from the game.
  if (e.code === 'Tab') {
    e.preventDefault();
    if (Game.mode === 'playing') Game.hud.showWeaponWheel(true);
    return;
  }
  if (e.code === 'Escape') {
    if (Game.mode === 'playing') pause();
    else if (Game.mode === 'paused') resumeGame();
    return;
  }
  if (Game.mode !== 'playing') return;
  Game.pressKey(e.code);
}
addEventListener('keydown', handleKeyDown);
addEventListener('keyup', handleKeyUp);

const SLOT_KEYS = ['melee', 'sidearm', 'primary', 'secondary', 'explosive'];
Game.pressKey = (code) => {
  if (code === 'KeyE') {
    if (Game.player.onFoot) {
      // A weapon pickup on the ground comes before getting in a car.
      if (Game.weapons.tryPickup()) return;
      const car = Game.driving.nearestEnterable();
      if (car) Game.driving.enterCar(car);
    } else {
      Game.driving.exitCar();
    }
  } else if (code === 'KeyF') {
    // Melee weapon equipped: swing it; otherwise throw a bare punch.
    if (!Game.weapons.tryMelee()) Game.combat.punch();
  } else if (code === 'KeyR') {
    Game.weapons.startReload();
  } else if (code === 'KeyV') {
    // Radio: next station (and the radio comes on).
    Game.radio.next();
    Game.audio.setRadio(true);
  } else if (code === 'KeyQ') {
    Game.weapons.next();
  } else if (code === 'KeyG') {
    Game.weapons.detonateStickies();
  } else if (code === 'KeyX') {
    Game.weapons.toggleThrowMode();
  } else if (code === 'KeyL') {
    Game.player.toggleFlashlight?.();
  } else if (code === 'KeyM') {
    const panel = document.getElementById('mission-panel');
    Game.hud.toggleMissionPanel(!panel.classList.contains('show'));
  } else if (code === 'KeyN') {
    Game.audio.setMuted(!Game.audio.muted);
    Game.hud.toast(Game.audio.muted ? 'Sound muted' : 'Sound on');
  } else if (code === 'KeyB') {
    // Leonida map (2D).
    Game.hud.showMap(!Game.hud.mapVisible());
  } else if (code === 'KeyU') {
    // Smartphone.
    Game.hud.showPhone(!Game.hud.phoneVisible());
  } else if (code === 'KeyO') {
    // Photo Studio.
    Game.hud.showPhotoStudio(!Game.hud.photoVisible());
  } else if (code === 'KeyT') {
    // Auto-Drive / Quick GPS: drive to the mission marker (or the waypoint).
    const target = Game.missions.marker || (Game.leonidaMap.waypoint ? { x: 0, z: 0 } : null);
    if (target && Game.player.car) {
      Game.driving.setAutoDrive(true, { x: target.x, z: target.z });
    } else if (!Game.player.car) {
      Game.hud.toast('Auto-Drive needs a car first.');
    } else {
      Game.hud.toast('Auto-Drive needs a destination — set a marker or a waypoint.');
    }
  } else if (code === 'KeyY') {
    // Surrender (1–2 stars).
    Game.police.surrender();
  } else if (code === 'KeyH') {
    // Hide in the car (back seat).
    Game.world.hideInCar(!Game.world.hiddenInCar);
  } else if (code === 'KeyJ') {
    // Call Joey — clear the heat, for a price.
    Game.world.callJoey();
  } else if (code === 'KeyC') {
    // Crouch is held in player.update via the keys map; C here toggles
    // the non-lethal mode (limb shots incapacitate, never kill).
    Game.world.nonLethalMode = !Game.world.nonLethalMode;
    Game.hud.toast(Game.world.nonLethalMode ? 'Non-lethal mode on — limb shots incapacitate.' : 'Non-lethal mode off.');
  } else if (code.startsWith('Digit')) {
    const n = Number(code.slice(5));
    if (n >= 1 && n <= 5) Game.weapons.equipSlot(SLOT_KEYS[n - 1]);
  }
};

canvas.addEventListener('mousedown', (e) => {
  Game.audio.ensure();
  if (Game.mode !== 'playing') return;
  if (e.button === 0) {
    Game.input.mouseDown = true;
    Game.weapons.triggerDown();
    if (document.pointerLockElement !== canvas) canvas.requestPointerLock?.();
  } else if (e.button === 2) {
    Game.player.aiming = true;
  }
});
addEventListener('mouseup', (e) => {
  Game.input.mouseDown = false;
  Game.weapons.triggerUp();
  if (e.button === 2) Game.player.aiming = false;
});
addEventListener('mousemove', (e) => {
  if (Game.mode !== 'playing') return;
  if (document.pointerLockElement === canvas || Game.input.dragging) {
    Game.player.camYaw -= e.movementX * 0.0032;
    Game.player.camPitch = THREE.MathUtils.clamp(Game.player.camPitch + e.movementY * 0.0022, -0.05, 0.85);
  }
});
canvas.addEventListener('mousedown', () => { Game.input.dragging = true; });
addEventListener('mouseup', () => { Game.input.dragging = false; });
canvas.addEventListener('contextmenu', (e) => e.preventDefault());
addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});

// ---- Game state transitions ----
Game.newGame = () => {
  Game.save.clear();
  Game.money = START_CASH;
  Game.stats = {
    carsStolen: 0, shotsFired: 0, punches: 0, copsDown: 0, crimes: 0, missionsDone: 0,
    stuns: 0, civiliansHurt: 0, psycho: false, relationship: 40, lastMissionWho: null, choices: {},
  };
  Game.missions.reset();
  Game.police.heat = 0; Game.police.stars = 0;
  Game.player.resetToSafehouse();
  Game.timeOfDay = 17.5;
  Game.mode = 'playing';
  Game.hud.hideMenus();
  Game.hud.hideEndCard();
  Game.missions.start();
  Game.audio.setRadio(false);
};
Game.continueGame = () => {
  if (Game.save.load()) {
    Game.police.heat = 0; Game.police.stars = 0;
    Game.player.camYaw = Game.player.heading + Math.PI;
    Game.mode = 'playing';
    Game.hud.hideMenus();
    Game.hud.hideEndCard();
    Game.missions.start();
    Game.hud.toast('Welcome back to Azura Bay.');
  } else {
    Game.newGame();
  }
};
Game.resumeGame = () => { Game.mode = 'playing'; Game.hud.hidePause(); };
Game.quitToMenu = () => {
  Game.saveGame();
  Game.mode = 'menu';
  Game.hud.showStart(Game.save.exists());
};
// A cheat, once activated, disables saving for the rest of the session.
Game.saveGame = () => {
  if (Game.cheats && Game.cheats.saveBlocked()) {
    Game.hud.toast('Saving is disabled — a cheat was activated this session.');
    return false;
  }
  return Game.save.save();
};

// Switch the playable protagonist (Lucia / Jason): weapon loadout,
// player mesh and the HUD character badge all follow.
Game.setCharacter = (who) => {
  if (who !== 'jason' && who !== 'lucia') return;
  Game.weapons.setCharacter(who);
  Game.player.setCharacter(who);
  Game.hud.setCharacter(who);
};
function pause() { Game.mode = 'paused'; Game.hud.showPause(); }
Game.hud.bindButtons(Game);

// ---- Self-test ----
let selftest = null;
if (selftestMode) {
  selftest = createSelfTest(Game);
  Game.mode = 'playing';
  Game.hud.hideMenus();
  Game.missions.start();
  window.__selftest = selftest;
}

// ---- Shot posing ----
if (shotName) {
  Game.mode = 'playing';
  Game.hud.hideMenus();
  applyShot(Game, shotName);
  // Let the world settle, then signal readiness for the screenshot.
  setTimeout(() => { document.title = 'SHOT READY'; window.__shotReady = true; }, 1200);
}

// ---- Main loop ----
const clock = new THREE.Clock();
let frames = 0;
function update(dt) {
  Game.elapsed += dt;
  if (Game.mode !== 'playing') return;
  // Day/night drifts slowly; frozen in shot mode.
  if (Game.dayNightCycle) Game.timeOfDay = (Game.timeOfDay + dt * 0.02) % 24;
  Game.player.update(dt);
  Game.driving.update(dt);
  updateVehicles(Game, dt);
  updatePedestrians(Game, dt);
  Game.police.update(dt);
  Game.combat.update(dt);
  Game.weapons.update(dt);
  Game.missions.update(dt);
  Game.effects.update(dt);
  // Round-2 systems.
  Game.collectibles.update();
  Game.stunts.update();
  Game.strangers.update();
  Game.events.update(dt);
  Game.mysteries.update();
  Game.world.update(dt);
  if (frames % 300 === 0) Game.activities.checkAchievements();
  // Engine + siren follow the driving state.
  const driving = !Game.player.onFoot && Game.player.car;
  Game.audio.setEngine(driving ? Math.abs(Game.player.car.speed) / Game.player.car.cls.maxSpeed : 0, driving);
  // Autosave every 45 s.
  Game.autosaveTimer += dt;
  if (Game.autosaveTimer > 45) { Game.autosaveTimer = 0; Game.saveGame(); }
  // Save at the safehouse door.
  const atDoor = Math.hypot(Game.player.pos.x - (-40), Game.player.pos.z - 262) < 10;
  if (atDoor && !Game.atSafehouse) { Game.saveGame(); Game.hud.toast('Progress saved at the safehouse.'); }
  Game.atSafehouse = atDoor;
  if (selftest) selftest.update(dt);
}

function animate() {
  requestAnimationFrame(animate);
  const steps = Game.turbo;
  for (let i = 0; i < steps; i++) update(1 / 60);
  // Camera.
  if (Game.shotCamera) {
    camera.position.copy(Game.shotCamera.pos);
    camera.lookAt(Game.shotCamera.look);
  } else if (Game.mode === 'playing' || Game.mode === 'paused' || Game.mode === 'busted' || Game.mode === 'wasted') {
    if (!Game.player.onFoot && Game.player.car) Game.driving.updateCamera(1 / 60);
    else Game.player.updateCamera(1 / 60);
  }
  refreshLighting();
  // Bab 29: the HUD corners stay live in the menu too, so the start screen
  // shows real health / BuckMe / profile instead of empty bars.
  if (Game.mode === 'playing' || Game.mode === 'paused' || Game.mode === 'menu') Game.hud.update(1 / 60);
  // Self-test: render rarely — the simulation is what is being tested.
  if (!selftestMode || frames % 8 === 0) renderer.render(scene, camera);
  frames++;
  if (frames === 5 && !shotName && !selftestMode) {
    // First paint done: show the start menu over the live city.
    Game.hud.showStart(Game.save.exists());
  }
}
refreshLighting();
animate();

// ---- Debug hook for scripted playtests (CDP) ----
window.__azura = {
  Game,
  pressKey: (code) => Game.pressKey(code),
  snapshot() {
    return {
      mode: Game.mode,
      money: Game.money,
      mission: Game.missions.index,
      missionActive: Game.missions.active,
      stars: Game.police.stars,
      heat: Math.round(Game.police.heat),
      health: Math.round(Game.player.health),
      onFoot: Game.player.onFoot,
      pos: { x: Math.round(Game.player.pos.x), z: Math.round(Game.player.pos.z) },
      speed: Math.round(Game.player.speed * 10) / 10,
      cars: Game.cars.length,
      peds: Game.peds.filter((p) => p.alive).length,
      cops: Game.police.cops.filter((c) => c.alive).length,
      timeOfDay: Math.round(Game.timeOfDay * 100) / 100,
      // Round-2 systems.
      weapons: Game.weapons.ownedList().length,
      vehicles: Game.vehicleDb.count,
      radioStation: Game.radio.current.name,
      gunShops: Game.gunshops.shops.length,
      cheats: Game.cheats.cheats.length,
      strangers: Game.strangers.doneCount(),
      collectiblesFound: Game.collectibles.foundCount(),
      collectiblesTotal: Game.collectibles.total,
      stuntsDone: Game.stunts.stuntTotal(),
      robberiesDone: Game.stunts.robberyDone(),
      mysteries: Game.mysteries.count(),
      garagesOwned: Game.properties.ownedGarages.length,
      achievements: Game.activities.unlockedCount(),
      fishCaught: Game.fishing.logbookCount(),
      mapPoints: Game.leonidaMap.points.length,
      variants: Game.variants.total(),
      // Round-3 additions.
      totalWealth: Game.economy.totalWealth(),
      expandedShops: Game.gunshops.expandedCount(),
      characters: Game.characters.roster.length,
      profile: Game.missions.criminalProfile(),
    };
  },
};
if (Game.hud.setBuildTag) Game.hud.setBuildTag('AZURA BAY · Round 3 · 91 missions · 69 weapons · 245 vehicles');
console.log('[AZURA BAY] boot ok, seed=' + seed + (shotName ? ', shot=' + shotName : '') + (selftestMode ? ', selftest on' : ''));
