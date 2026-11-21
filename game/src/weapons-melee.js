// weapons-melee.js — Close-quarters table: the 9 melee weapons.
// Every row carries its swing profile: damage per hit, reach in metres,
// swingMs (how long one swing takes), knockback (how far the target is
// shoved) and combo (whether fast follow-up swings chain).
// Golf Club and Knife are single rows; their `variants` arrays list the
// in-world versions (Driver / Iron / Putter / Wedge; Combat / Switchblade /
// Survival / Bushcraft) — variants, never separate weapons. The flashlight
// doubles as a light: press L to toggle its beam.
// Round 5: rows re-expressed one field per line, keys grouped by meaning
// (identity, then swing numbers, then shop numbers) so the table reads
// top-to-bottom instead of left-to-right. Values unchanged.

export const MELEE = [
  {
    id: 'bat',
    name: 'Baseball Bat',
    kind: 'melee',
    damage: 35,
    range: 2.4,
    swingMs: 450,
    knockback: 3,
    handling: 0.70,
    variants: ['Wood', 'Aluminium', 'Nail Bat'],
    price: 150,
    tier: 0,
    desc: 'A baseball bat — heavy, honest, and always in the trunk. Wood, Aluminium, or Nail Bat in the world.',
  },
  {
    id: 'baton',
    name: 'Police Baton',
    kind: 'melee',
    damage: 28,
    range: 2.0,
    swingMs: 350,
    knockback: 2,
    handling: 0.80,
    price: 200,
    tier: 0,
    desc: 'A police baton — the standard-issue argument ender.',
  },
  {
    id: 'crowbar',
    name: 'Crowbar',
    kind: 'melee',
    damage: 38,
    range: 2.2,
    swingMs: 500,
    knockback: 3.5,
    handling: 0.65,
    price: 250,
    tier: 0,
    desc: 'A crowbar — pries doors, and people.',
  },
  {
    id: 'hammer',
    name: 'Hammer',
    kind: 'melee',
    damage: 40,
    range: 2.0,
    swingMs: 520,
    knockback: 3.5,
    handling: 0.60,
    price: 220,
    tier: 0,
    desc: 'A hammer — slow, heavy, and final.',
  },
  {
    id: 'golfclub',
    name: 'Golf Club',
    kind: 'melee',
    damage: 32,
    range: 2.6,
    swingMs: 480,
    knockback: 3,
    handling: 0.70,
    variants: ['Driver', 'Iron', 'Putter', 'Wedge'],
    price: 300,
    tier: 0,
    desc: 'A golf club — Driver, Iron, Putter, or Wedge, pick your swing.',
  },
  {
    id: 'poolcue',
    name: 'Pool Cue',
    kind: 'melee',
    damage: 26,
    range: 2.4,
    swingMs: 380,
    knockback: 2,
    handling: 0.78,
    price: 120,
    tier: 0,
    desc: 'A pool cue — medium reach, quick hands, and a habit of snapping.',
  },
  {
    id: 'flashlight',
    name: 'Flashlight',
    kind: 'melee',
    damage: 24,
    range: 1.9,
    swingMs: 360,
    knockback: 2,
    light: true,
    handling: 0.82,
    price: 180,
    tier: 0,
    desc: 'A heavy steel flashlight — a club that also lights the dark. Press L for the beam.',
  },
  {
    id: 'knuckles',
    name: 'Brass Knuckles',
    kind: 'melee',
    damage: 22,
    range: 1.5,
    swingMs: 240,
    knockback: 1,
    combo: true,
    handling: 0.95,
    price: 100,
    tier: 0,
    desc: 'Brass knuckles — the fastest fists in the drawer, and the shortest reach.',
  },
  {
    id: 'knife',
    name: 'Knife',
    kind: 'melee',
    damage: 30,
    range: 1.8,
    swingMs: 280,
    knockback: 1.5,
    combo: true,
    handling: 0.90,
    variants: ['Combat Knife', 'Switchblade', 'Survival Knife', 'Bushcraft Knife'],
    price: 280,
    tier: 0,
    desc: 'A knife — Combat, Switchblade, Survival, or Bushcraft, fast and sharp.',
  },
];

// ---- Round 3: melee DPS helper (damage per second at full swing speed) ----
export function meleeDps(w) {
  if (!w || !w.swingMs) return 0;
  return Math.round((w.damage * 1000) / w.swingMs);
}
