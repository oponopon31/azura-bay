// AZURA BAY — GTA 6 fan open world (gta6-01). Round 7 re-compose.
// Shared constants. Single source of truth for economy caps, world bounds,
// profile levels, ending thresholds, and named places. Written fresh under
// recording r7 from SPEC.md (Bab 10–12, 17, 23, 28–29) — no file copied.

export const GAME_TITLE = 'AZURA BAY';
export const GAME_SUBTITLE = 'GTA 6 fan open world: 91 story missions across Leonida';
export const BUILD_TAG = 'AZURA BAY · Round 7';

// --- Economy (SPEC Bab 17, 23) ---
export const WALLET_MAX = 20000; // cash wallet cap; excess auto-sweeps to BuckMe
export const BUCKME_GOOD1_MIN = 40000; // Good Ending 1 needs BuckMe savings >= this
export const MONEY_CHEAT_AMOUNT = 250000; // the only money cheat

// --- World (SPEC Bab 28; gtabase coords /8, z = -Y/8, north = -z) ---
export const WORLD = {
  minX: -900, maxX: 220,
  minZ: -820, maxZ: 830,
  // gtabase -> game: x = gx/8, z = -gy/8
  toGameX: (gx) => Math.round(gx / 8),
  toGameZ: (gy) => Math.round(-gy / 8),
};

// Named places (SPEC Bab 28 + MAP-DATA.md (g); nightclub from round-3 note)
export const PLACES = {
  nightclub: { name: 'Ocean Drive Nightclub', x: 120, z: -240 },
  viceCity: { name: 'Vice City', x: -28, z: -95 },
  viceBeach: { name: 'Vice Beach', x: 191, z: -112 },
  portGellhorn: { name: 'Port Gellhorn', x: -820, z: -533 },
  keyLento: { name: 'Key Lento', x: -296, z: 749 },
  ambrosia: { name: 'Ambrosia', x: -380, z: -529 },
  millport: { name: 'Millport', x: -89, z: -781 },
  vcia: { name: 'VCIA', x: -265, z: 83 },
  mountKalaga: { name: 'Mount Kalaga', x: -425, z: -805 },
  lakeLeonida: { name: 'Lake Leonida', x: -244, z: -599 },
  grassrivers: { name: 'Grassrivers', x: -410, z: 534 },
  gooseKey: { name: 'Goose Key', x: -778, z: 809 },
  capri: { name: 'Capri', x: -886, z: -25 },
  watsonBay: { name: 'Watson Bay', x: -608, z: 426 },
  hamlet: { name: 'Hamlet', x: -358, z: 390 },
  waningSands: { name: 'Waning Sands', x: -31, z: -504 },
  glorianaKey: { name: 'Gloriana Key', x: 90, z: 175 },
};

// --- Criminal Profile (SPEC Bab 10–11) ---
// Levels in order; index 0 = cleanest. Psycho is permanent once shattered;
// Irredeemable is the permanent ceiling above Psycho.
export const PROFILE_LEVELS = [
  'Professional', 'Hardened', 'Violent & Dangerous', 'Psycho', 'Irredeemable',
];
export const PROFILE = {
  PROFESSIONAL: 0, HARDENED: 1, VIOLENT: 2, PSYCHO: 3, IRREDEEMABLE: 4,
};

// --- Wanted & Heat (SPEC Bab 12) ---
export const STAR_STATES = ['hollow', 'solid', 'blinking', 'red', 'manhunt'];
export const MAX_WANTED = 6;

// --- HUD (SPEC Bab 29) ---
export const HUD = {
  healthRegenPerSec: 3,
  healthRegenCapFrac: 0.5, // regen only up to 50% of max health
  healthRegenDelaySec: 8, // only after 8s without damage
  focusDrainAim: 0.10, // per second while aiming
  focusRegen: 0.05, // per second
  oxygenDrainScuba: 1.2, // per second with tank
  adrenalineOnDamage: 0.08,
  adrenalineOnKill: 0.25,
  adrenalineDecay: 0.04, // per second
  adrenalineSprintFrac: 0.5, // sprint costs half stamina while adrenaline >= 0.5
  lowFuelFrac: 0.25,
  engineFailingFrac: 0.35,
};

// --- Characters / attributes (SPEC Bab 10, 15) ---
export const ATTRIBUTE_LEVELS = [0, 100, 250, 500, 900]; // xp per level 1..5
export const RELATIONSHIP_START = 40;
export const RELATIONSHIP_BANDS = [
  [30, 'Strained'], [55, 'Partners'], [80, 'In Sync'], [101, 'Bonnie & Clyde'],
];

// --- Cheats (SPEC Bab 3, 22) ---
export const CHEAT_MONEY_ID = 'money-250k';

// --- Shots (screenshots) ---
export const SHOT_NAMES = ['cover', 'shootout', 'dusk', 'heist', 'night'];

export function clamp(v, lo, hi) { return v < lo ? lo : v > hi ? hi : v; }
export function lerp(a, b, t) { return a + (b - a) * t; }
