// main.js — Boot and the game loop: input, lighting and day/night, camera,
// menus, autosave and the debug hook. One job: wire every system together.

import * as THREE from 'three';
import { makeRng } from './rng.js';
import { START_CASH, MISSIONS } from './config.js';
import { createAudio } from './audio.js';
import { createEffects } from './effects.js';
import { buildCity } from './city.js';
import { spawnParkedCars, spawnTraffic, updateVehicles } from './vehicles.js';
import { spawnPedestrians, updatePedestrians, knockDownPed } from './pedestrians.js';
import { createPlayer } from './player.js';
import { createDriving } from './driving.js';
import { createCombat } from './combat.js';
import { createWeapons } from './weapons.js';
import { createPolice } from './police.js';
import { createMissions } from './missions.js';
import { createHud } from './hud.js';
import { createSave } from './save.js';
import { applyShot } from './shots.js';
import { createSelfTest } from './selftest.js';

const params = new URLSearchParams(location.search);
const seed = Number(params.get('seed') || 7);
const shotName = params.get('shot');
const selftestOn = params.has('selftest');

const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
if (selftestOn) renderer.shadowMap.enabled = false; // self-test: sim speed over shadows
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
const G = {
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
  turbo: selftestOn ? 12 : 1, // self-test runs the sim fast, rendering rarely
  autosaveTimer: 0,
  atSafehouse: false,
};
G.audio = createAudio();
G.effects = createEffects(G);
G.city = buildCity(G);
G.player = createPlayer(G);
G.driving = createDriving(G);
G.combat = createCombat(G);
G.weapons = createWeapons(G);
G.police = createPolice(G);
G.missions = createMissions(G);
G.hud = createHud(G);
G.save = createSave(G);
G.pedestrians = { knockDownPed };
spawnParkedCars(G);
spawnTraffic(G);
spawnPedestrians(G);

// ---- Sky / sun from the time of day ----
const SKY_STOPS = [
  [0, 0x0b1220], [5, 0x1a2340], [6.5, 0xff9a5c], [8, 0x87b5d9],
  [16.5, 0x8fb8d8], [17.5, 0xffb36b], [18.7, 0xe86a4e], [19.5, 0x2e3a5e],
  [21, 0x0e1626], [24, 0x0b1220],
];
function skyColorAt(t) {
  for (let i = 0; i < SKY_STOPS.length - 1; i++) {
    const [t0, c0] = SKY_STOPS[i], [t1, c1] = SKY_STOPS[i + 1];
    if (t >= t0 && t <= t1) {
      const f = (t - t0) / (t1 - t0);
      return new THREE.Color(c0).lerp(new THREE.Color(c1), f);
    }
  }
  return new THREE.Color(0x87b5d9);
}
function updateLighting() {
  const t = G.timeOfDay;
  const elev = Math.sin(((t - 6) / 12) * Math.PI); // 1 at noon, 0 at 6/18, <0 at night
  const azim = ((t - 6) / 24) * Math.PI * 2;
  const sunDir = new THREE.Vector3(Math.cos(azim), Math.max(0.08, elev), Math.sin(azim) * 0.6).normalize();
  const focus = G.player.pos;
  sun.position.set(focus.x + sunDir.x * 320, sunDir.y * 320 + 40, focus.z + sunDir.z * 320);
  sun.target.position.copy(focus);
  const warmth = THREE.MathUtils.clamp(1 - Math.abs(elev) * 1.4, 0.15, 1);
  sun.color.setHex(0xffd9a0).lerp(new THREE.Color(0xff8a3c), warmth * 0.8);
  sun.intensity = THREE.MathUtils.clamp(elev, 0, 1) * 2.4 + 0.15;
  hemi.intensity = 0.3 + THREE.MathUtils.clamp(elev, 0, 1) * 0.55;
  const sky = skyColorAt(t);
  scene.background = sky;
  scene.fog.color.copy(sky);
  G.city.update(0, t);
}

// ---- Input ----
const canvas = renderer.domElement;
function onKeyDown(e) {
  if (e.repeat) return;
  G.input.keys[e.code] = true;
  G.audio.ensure();
  // Tab (hold) opens the weapon wheel; preventDefault keeps the browser
  // from moving focus away from the game.
  if (e.code === 'Tab') {
    e.preventDefault();
    if (G.mode === 'playing') G.hud.showWeaponWheel(true);
    return;
  }
  if (e.code === 'Escape') {
    if (G.mode === 'playing') pauseGame();
    else if (G.mode === 'paused') resumeGame();
    return;
  }
  if (G.mode !== 'playing') return;
  G.pressKey(e.code);
}
function onKeyUp(e) {
  G.input.keys[e.code] = false;
  if (e.code === 'Tab') G.hud.showWeaponWheel(false);
}
addEventListener('keydown', onKeyDown);
addEventListener('keyup', onKeyUp);

G.pressKey = (code) => {
  if (code === 'KeyE') {
    if (G.player.onFoot) {
      // A weapon pickup on the ground comes before getting in a car.
      if (G.weapons.tryPickup()) return;
      const car = G.driving.nearestEnterable();
      if (car) G.driving.enterCar(car);
    } else {
      G.driving.exitCar();
    }
  } else if (code === 'KeyF') {
    // Melee weapon equipped: swing it; otherwise throw a bare punch.
    if (!G.weapons.tryMelee()) G.combat.punch();
  } else if (code === 'KeyR') {
    G.weapons.startReload();
  } else if (code === 'KeyV') {
    // Radio moved here (R is reload now).
    G.audio.setRadio(!G.audio.radioOn);
    G.hud.toast(G.audio.radioOn ? 'Radio on — Azura FM' : 'Radio off');
  } else if (code === 'KeyQ') {
    G.weapons.next();
  } else if (code === 'KeyG') {
    G.weapons.detonateStickies();
  } else if (code === 'KeyX') {
    G.weapons.toggleThrowMode();
  } else if (code === 'KeyL') {
    G.player.toggleFlashlight?.();
  } else if (code === 'KeyM') {
    const panel = document.getElementById('mission-panel');
    G.hud.toggleMissionPanel(!panel.classList.contains('show'));
  } else if (code === 'KeyN') {
    G.audio.setMuted(!G.audio.muted);
    G.hud.toast(G.audio.muted ? 'Sound muted' : 'Sound on');
  } else if (code.startsWith('Digit')) {
    const n = Number(code.slice(5));
    if (n >= 1 && n <= 9) G.weapons.equipSlot(n);
  }
};

canvas.addEventListener('mousedown', (e) => {
  G.audio.ensure();
  if (G.mode !== 'playing') return;
  if (e.button === 0) {
    G.input.mouseDown = true;
    G.weapons.triggerDown();
    if (document.pointerLockElement !== canvas) canvas.requestPointerLock?.();
  } else if (e.button === 2) {
    G.player.aiming = true;
  }
});
addEventListener('mouseup', (e) => {
  G.input.mouseDown = false;
  G.weapons.triggerUp();
  if (e.button === 2) G.player.aiming = false;
});
addEventListener('mousemove', (e) => {
  if (G.mode !== 'playing') return;
  if (document.pointerLockElement === canvas || G.input.dragging) {
    G.player.camYaw -= e.movementX * 0.0032;
    G.player.camPitch = THREE.MathUtils.clamp(G.player.camPitch + e.movementY * 0.0022, -0.05, 0.85);
  }
});
canvas.addEventListener('mousedown', () => { G.input.dragging = true; });
addEventListener('mouseup', () => { G.input.dragging = false; });
canvas.addEventListener('contextmenu', (e) => e.preventDefault());
addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});

// ---- Game state transitions ----
G.newGame = () => {
  G.save.clear();
  G.money = START_CASH;
  G.stats = {
    carsStolen: 0, shotsFired: 0, punches: 0, copsDown: 0, crimes: 0, missionsDone: 0,
    stuns: 0, civiliansHurt: 0, psycho: false, relationship: 40, lastMissionWho: null, choices: {},
  };
  G.missions.reset();
  G.police.heat = 0; G.police.stars = 0;
  G.player.resetToSafehouse();
  G.timeOfDay = 17.5;
  G.mode = 'playing';
  G.hud.hideMenus();
  G.hud.hideEndCard();
  G.missions.start();
  G.audio.setRadio(false);
};
G.continueGame = () => {
  if (G.save.load()) {
    G.police.heat = 0; G.police.stars = 0;
    G.player.camYaw = G.player.heading + Math.PI;
    G.mode = 'playing';
    G.hud.hideMenus();
    G.hud.hideEndCard();
    G.missions.start();
    G.hud.toast('Welcome back to Azura Bay.');
  } else {
    G.newGame();
  }
};
G.resumeGame = () => { G.mode = 'playing'; G.hud.hidePause(); };
G.quitToMenu = () => {
  G.saveGame();
  G.mode = 'menu';
  G.hud.showStart(G.save.exists());
};
G.saveGame = () => G.save.save();

// Switch the playable protagonist (Lucia / Jason): weapon loadout,
// player mesh and the HUD character badge all follow.
G.setCharacter = (who) => {
  if (who !== 'jason' && who !== 'lucia') return;
  G.weapons.setCharacter(who);
  G.player.setCharacter(who);
  G.hud.setCharacter(who);
};
function pauseGame() { G.mode = 'paused'; G.hud.showPause(); }
G.hud.bindButtons(G);

// ---- Self-test ----
let selftest = null;
if (selftestOn) {
  selftest = createSelfTest(G);
  G.mode = 'playing';
  G.hud.hideMenus();
  G.missions.start();
  window.__selftest = selftest;
}

// ---- Shot posing ----
if (shotName) {
  G.mode = 'playing';
  G.hud.hideMenus();
  applyShot(G, shotName);
  // Let the world settle, then signal readiness for the screenshot.
  setTimeout(() => { document.title = 'SHOT READY'; window.__shotReady = true; }, 1200);
}

// ---- Main loop ----
const clock = new THREE.Clock();
let frames = 0;
function update(dt) {
  G.elapsed += dt;
  if (G.mode !== 'playing') return;
  // Day/night drifts slowly; frozen in shot mode.
  if (G.dayNightCycle) G.timeOfDay = (G.timeOfDay + dt * 0.02) % 24;
  G.player.update(dt);
  G.driving.update(dt);
  updateVehicles(G, dt);
  updatePedestrians(G, dt);
  G.police.update(dt);
  G.combat.update(dt);
  G.weapons.update(dt);
  G.missions.update(dt);
  G.effects.update(dt);
  // Engine + siren follow the driving state.
  const driving = !G.player.onFoot && G.player.car;
  G.audio.setEngine(driving ? Math.abs(G.player.car.speed) / G.player.car.cls.maxSpeed : 0, driving);
  // Autosave every 45 s.
  G.autosaveTimer += dt;
  if (G.autosaveTimer > 45) { G.autosaveTimer = 0; G.saveGame(); }
  // Save at the safehouse door.
  const atDoor = Math.hypot(G.player.pos.x - (-40), G.player.pos.z - 262) < 10;
  if (atDoor && !G.atSafehouse) { G.saveGame(); G.hud.toast('Progress saved at the safehouse.'); }
  G.atSafehouse = atDoor;
  if (selftest) selftest.update(dt);
}

function animate() {
  requestAnimationFrame(animate);
  const steps = G.turbo;
  for (let i = 0; i < steps; i++) update(1 / 60);
  // Camera.
  if (G.shotCamera) {
    camera.position.copy(G.shotCamera.pos);
    camera.lookAt(G.shotCamera.look);
  } else if (G.mode === 'playing' || G.mode === 'paused' || G.mode === 'busted' || G.mode === 'wasted') {
    if (!G.player.onFoot && G.player.car) G.driving.updateCamera(1 / 60);
    else G.player.updateCamera(1 / 60);
  }
  updateLighting();
  if (G.mode === 'playing' || G.mode === 'paused') G.hud.update(1 / 60);
  // Self-test: render rarely — the simulation is what is being tested.
  if (!selftestOn || frames % 8 === 0) renderer.render(scene, camera);
  frames++;
  if (frames === 5 && !shotName && !selftestOn) {
    // First paint done: show the start menu over the live city.
    G.hud.showStart(G.save.exists());
  }
}
updateLighting();
animate();

// ---- Debug hook for scripted playtests (CDP) ----
window.__azura = {
  G,
  pressKey: (code) => G.pressKey(code),
  snapshot() {
    return {
      mode: G.mode,
      money: G.money,
      mission: G.missions.index,
      missionActive: G.missions.active,
      stars: G.police.stars,
      heat: Math.round(G.police.heat),
      health: Math.round(G.player.health),
      onFoot: G.player.onFoot,
      pos: { x: Math.round(G.player.pos.x), z: Math.round(G.player.pos.z) },
      speed: Math.round(G.player.speed * 10) / 10,
      cars: G.cars.length,
      peds: G.peds.filter((p) => p.alive).length,
      cops: G.police.cops.filter((c) => c.alive).length,
      timeOfDay: Math.round(G.timeOfDay * 100) / 100,
    };
  },
};
console.log('[AZURA BAY] boot ok, seed=' + seed + (shotName ? ', shot=' + shotName : '') + (selftestOn ? ', selftest on' : ''));
