// weapons-explosives.js — Explosives data table (4 entries).
// Molotov Cocktail / Fire Bottle is ONE entry (two names, one item).
// Smoke / Flashbang Grenade is ONE entry with two throw modes — X switches
// between smoke (vision-blocking cloud) and flash (blinding burst).
// Thrown fields: fuse (seconds before a frag blows), stick (sticks to a
// surface/car, detonated remotely with G), blast (AoE radius), blastDamage,
// burnDps/burnSecs + firePool (molotov ground fire), modes (smoke/flash).

export const EXPLOSIVES = [
  { id: 'frag', name: 'Frag Grenade', kind: 'explosive', damage: 0, blast: 9, blastDamage: 130, fuse: 2.5, rpm: 60, mag: 1, mode: 'throw', handling: 0.70, range: 40, price: 300, tier: 3, desc: 'A frag grenade — pull the pin, count to two, and be somewhere else.' },
  { id: 'sticky', name: 'Sticky Bomb', kind: 'explosive', damage: 0, blast: 10, blastDamage: 150, stick: true, rpm: 60, mag: 1, mode: 'throw', handling: 0.70, range: 35, price: 500, tier: 3, desc: 'A sticky bomb — throw it, it sticks, and G detonates it when you say so.' },
  { id: 'molotov', name: 'Molotov Cocktail', kind: 'explosive', damage: 0, burnDps: 15, burnSecs: 5, firePool: 6, rpm: 60, mag: 1, mode: 'throw', handling: 0.70, range: 35, price: 150, tier: 3, desc: 'A Molotov cocktail — a fire bottle that turns the ground into a bonfire.' },
  { id: 'smokeflash', name: 'Smoke / Flashbang Grenade', kind: 'explosive', damage: 0, modes: ['smoke', 'flash'], stun: true, stunSecs: 3, rpm: 60, mag: 1, mode: 'throw', handling: 0.75, range: 35, price: 250, tier: 3, desc: 'A smoke/flashbang grenade — X switches between a blinding flash and a vision-blocking smoke cloud.' },
];
