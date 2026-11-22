// config.js — AZURA BAY core constants (SPEC Bab 11/23/29).
// All numbers below come straight from the user's spec; nothing is invented.

// Money (Bab 11, 23): wallet cap $20,000 — excess sweeps to BuckMe automatically.
export const WALLET_MAX = 20000;
// Good Ending 1 reads BuckMe SAVINGS, never wallet cash (cash can never reach it).
export const BUCKME_GOOD1 = 40000;
// The only money cheat in the game (Bab 3).
export const MONEY_CHEAT_AMOUNT = 250000;

// HUD meters (Bab 29): health regens +3/s only up to 50% maxHealth and only
// after 8s without taking damage; focus drains 0.10/s while aiming, regens 0.05/s.
export const HEALTH_REGEN_CAP = 0.5;
export const HEALTH_REGEN_RATE = 3;
export const HEALTH_REGEN_DELAY = 8;
export const FOCUS_DRAIN_AIM = 0.10;
export const FOCUS_REGEN = 0.05;
// Adrenaline: +0.08 on taking damage, +0.25 on a kill, decays 0.04/s;
// at >= 0.5 sprint costs half stamina.
export const ADRENALINE_ON_DAMAGE = 0.08;
export const ADRENALINE_ON_KILL = 0.25;
export const ADRENALINE_DECAY = 0.04;
export const ADRENALINE_SPRINT_HALF = 0.5;
// Scuba oxygen drains 1.2/s (Bab 29).
export const OXYGEN_SCUBA_DRAIN = 1.2;

// Relationship (Bab 29): starts at 40, +2 per mission done together.
export const RELATIONSHIP_START = 40;

// Content counts asserted by the selftest (SPEC header note — must not change).
export const COUNTS = {
  missions: 91,
  weapons: 69,
  vehicles: 245,
  cheats: 61,
  strangers: 13,
  radioStations: 24,
  characters: 27,
  fishSpecies: 35,
  weaponVariants: 130,
  achievements: 32,
  hiddenPackages: 26,
  mapPoints: 27,
};

// Night shot location (round 3): Coral Drive nightclub, 21:30, 1 star.
// Game-city coords (relative), NOT atlas coords.
export const PLACES = {
  nightclub: { name: 'Coral Drive Nightclub', x: 120, z: -240, hour: 21.5, stars: 1 },
  azuraHarbor: { name: 'Azura Harbor', x: 854, z: 390 },
};

export const GAME = {
  title: 'AZURA BAY',
  subtitle: 'AZURA BAY open world: 91 story missions across Solmaris',
  build: 'AZURA BAY · Round 10',
  chapters: 5,
};
