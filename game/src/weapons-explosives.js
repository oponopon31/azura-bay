// weapons-explosives.js — Thrown things: the 4 explosive entries.
// Molotov Cocktail / Fire Bottle is ONE row (two names, one item).
// Smoke / Flashbang Grenade is ONE row with two throw modes — X switches
// between smoke (a vision-blocking cloud) and flash (a blinding burst).
// Thrown fields: fuse (seconds before a frag blows), stick (sticks to a
// surface or car, detonated remotely with G), blast (AoE radius),
// blastDamage, burnDps / burnSecs + firePool (molotov ground fire),
// modes (smoke / flash).
// Round 5: rows re-expressed one field per line, keys grouped by meaning.
// Values unchanged.

export const EXPLOSIVES = [
  {
    id: 'frag',
    name: 'Frag Grenade',
    kind: 'explosive',
    damage: 0,
    rpm: 60,
    mag: 1,
    mode: 'throw',
    handling: 0.70,
    range: 40,
    blast: 9,
    blastDamage: 130,
    variants: ['Standard', 'Impact'],
    price: 300,
    tier: 3,
    desc: 'A frag grenade — pull the pin, count to two, and be somewhere else. Impact variant blows on contact.',
    fuse: 2.5,
  },
  {
    id: 'sticky',
    name: 'Sticky Bomb',
    kind: 'explosive',
    damage: 0,
    rpm: 60,
    mag: 1,
    mode: 'throw',
    handling: 0.70,
    range: 35,
    blast: 10,
    blastDamage: 150,
    price: 500,
    tier: 3,
    desc: 'A sticky bomb — throw it, it sticks, and G detonates it when you say so.',
    stick: true,
  },
  {
    id: 'molotov',
    name: 'Molotov Cocktail',
    kind: 'explosive',
    damage: 0,
    rpm: 60,
    mag: 1,
    mode: 'throw',
    handling: 0.70,
    range: 35,
    burnDps: 15,
    burnSecs: 5,
    variants: ['Classic', 'Napalm'],
    price: 150,
    tier: 3,
    desc: 'A Molotov cocktail — a fire bottle that turns the ground into a bonfire. Napalm variant burns longer.',
    firePool: 6,
  },
  {
    id: 'smokeflash',
    name: 'Smoke / Flashbang Grenade',
    kind: 'explosive',
    damage: 0,
    rpm: 60,
    mag: 1,
    mode: 'throw',
    handling: 0.75,
    range: 35,
    stun: true,
    stunSecs: 3,
    price: 250,
    tier: 3,
    desc: 'A smoke/flashbang grenade — X switches between a blinding flash and a vision-blocking smoke cloud.',
    modes: ['smoke', 'flash'],
  },
];

// ---- Round 3: explosive lookup by id (gun shops + HUD use it) ----
export function explosiveById(id) {
  return EXPLOSIVES.find((w) => w.id === id) || null;
}
