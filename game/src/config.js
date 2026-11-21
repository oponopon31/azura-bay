// config.js — Azura Bay tuning, palette, world layout and mission data.
// One job: every number and name the rest of the game shares.
// PITCH is 80 — road centrelines sit at -320..320 in steps of 80, so the
// whole grid is multiples of one number.
// Round 5: the car-class rows are re-expressed with handling stats first,
// matching the order the driving model reads them. Values unchanged.

import { STORY } from './story.js';

export const GAME_TITLE = 'AZURA BAY';
export const SAVE_KEY = 'azura-bay-save-v1';

// ---- World layout (metres) ----
export const BLOCK = 64;          // building block size
export const ROAD = 16;           // road width
export const PITCH = BLOCK + ROAD; // 80 — distance between road centrelines
export const GRID = 9;            // roads per axis, centrelines at -320..320
export const CITY_HALF = 320;     // city edge; beach starts past +336 on z
export const BEACH_Z = 336;       // sand begins
export const WATER_Z = 372;       // sea begins
export const HARBOR_X = 336;      // docks begin on the east edge

export function roadCentres() {
  const out = [];
  for (let i = 0; i < GRID; i++) out.push(-CITY_HALF + i * PITCH);
  return out;
}

// True when (x,z) is on a road surface (within half the road width of a centreline).
export function onRoad(x, z) {
  const half = ROAD / 2 + 1;
  for (let i = 0; i < GRID; i++) {
    const c = -CITY_HALF + i * PITCH;
    if (Math.abs(x - c) < half || Math.abs(z - c) < half) return true;
  }
  return false;
}

// Nearest road centreline coordinate on one axis (for lane snapping).
export function nearestRoad(v) {
  return Math.round((v + CITY_HALF) / PITCH) * PITCH - CITY_HALF;
}

// ---- Palette (golden-hour coastal city) ----
export const PALETTE = {
  skyDay: 0x87b5d9,
  skyGolden: 0xffb36b,
  skyDusk: 0x2e3a5e,
  fogGolden: 0xf2a35e,
  sun: 0xffd9a0,
  road: 0x2e2e33,
  roadLine: 0xd8c86a,
  sidewalk: 0x9a938a,
  sand: 0xe8cf9a,
  sea: 0x1e6f8e,
  seaDeep: 0x14506b,
  building: [0xe8dcc8, 0xd9c1a3, 0xc9b8a6, 0xb8c4cc, 0xe0b48f, 0xa8b8a0, 0xd98f6a, 0x8fa3b8],
  glass: 0x3a5a78,
  carPaint: [0xc0392b, 0x2e6fb0, 0xe8e8e8, 0x222222, 0xe67e22, 0x27ae60, 0x8e44ad, 0xf1c40f, 0x16a085, 0xb03a5b],
};

// ---- Player / driving tuning ----
export const PLAYER = {
  walkSpeed: 6,
  runSpeed: 10.5,
  health: 100,
  punchDamage: 25,
  punchRange: 2.2,
};

export const CAR_CLASSES = {
  sedan: {
    accel: 15,
    brake: 32,
    maxSpeed: 36,
    maxReverse: 12,
    grip: 2.4,
    turn: 1.9,
  },
  coupe: {
    accel: 19,
    brake: 34,
    maxSpeed: 44,
    maxReverse: 13,
    grip: 2.7,
    turn: 2.1,
  },
  suv: {
    accel: 14,
    brake: 30,
    maxSpeed: 34,
    maxReverse: 11,
    grip: 2.5,
    turn: 1.7,
  },
  truck: {
    accel: 10,
    brake: 26,
    maxSpeed: 28,
    maxReverse: 10,
    grip: 2.1,
    turn: 1.5,
  },
  van: {
    accel: 11,
    brake: 28,
    maxSpeed: 29,
    maxReverse: 10,
    grip: 2.0,
    turn: 1.6,
  },
  police: {
    accel: 20,
    brake: 36,
    maxSpeed: 46,
    maxReverse: 13,
    grip: 2.8,
    turn: 2.3,
  },
  taxi: {
    accel: 14,
    brake: 30,
    maxSpeed: 34,
    maxReverse: 11,
    grip: 2.3,
    turn: 1.9,
  },
};

// ---- Wanted system ----
// Heat 0..100 maps to 0..5 stars; a 6th star is the total Leonida manhunt
// (SPEC Bab 12) and is only reached through the Heat system in world.js.
export const WANTED = {
  stealCar: 18,      // heat added for stealing a car
  hitPedestrian: 26,
  hitCar: 6,
  shoot: 12,
  killCop: 30,
  speedPastCop: 3,   // per second while speeding near police
  decayDelay: 7,     // seconds out of sight before heat falls
  decayRate: 7,      // heat per second while hidden
  maxHeat: 100,
};
// Star states (SPEC Bab 12): hollow = reported, nobody knows who;
// solid = seen directly; blinking = out of sight; red = searching the area;
// 6 stars = whole-Leonida manhunt.
export const STAR_STATES = ['none', 'hollow', 'solid', 'blinking', 'red', 'six'];
export function starStateFor(stars, seenNow, heat) {
  if (stars <= 0) return 'none';
  if (stars >= 6) return 'six';
  if (!seenNow && heat > 0) return 'red';
  return 'solid';
}
// Stars from heat: 0,1,2,3,4,5 at heat 0,10,28,48,68,86
export function starsFromHeat(heat) {
  if (heat < 10) return 0;
  if (heat < 28) return 1;
  if (heat < 48) return 2;
  if (heat < 68) return 3;
  if (heat < 86) return 4;
  return 5;
}
export function policeCarCount(stars) {
  return [0, 1, 2, 3, 3, 4][stars] || 0;
}
export function helicopterAt(stars) { return stars >= 3; }

// ---- Wallet (SPEC Bab 23) ----
export const WALLET_MAX = 20000; // cash on hand caps here; the rest goes to BuckMe via ATM

// ---- Missions ----
// The 91-mission story lives in story.js; MISSIONS is the same list, kept
// under the old name so the HUD and the self-test keep working.
export const MISSIONS = STORY;

// ---- Key places (world coordinates; mission markers sit on roads / open ground
// so they are actually reachable) ----
export const PLACES = {
  safehouse: { x: -40, z: 280 },   // villa block centre, south side
  safehouseDoor: { x: -40, z: 262 }, // front door, on open ground
  garage:    { x: 200, z: 240 },   // Marina Row garage, on road z=240
  harbor:    { x: 400, z: 40 },    // east docks package spot
  courierDrops: [
    { x: -240, z: -240 },
    { x: 240, z: -160 },
    { x: -160, z: 160 },
  ],
  nightclub: { x: 120, z: -240 }, // Ocean Drive nightclub — round-3 meet spot (night shot)
};

// ---- Traffic / pedestrians ----
export const TRAFFIC_COUNT = 14;
export const PARKED_COUNT = 10;
export const PED_COUNT = 26;

// ---- Save ----
export const START_CASH = 250;

// ---- Round 3 build manifest (read by main.ts preflight + debug) ----
export const ROUND3 = {
  version: 3,
  build: 'r3-entrypoint-rewrite',
  missions: 91,
  weapons: 69,
  vehicles: 245,
  cheats: 61,
  shots: ['cover', 'shootout', 'dusk', 'heist', 'night'],
};
