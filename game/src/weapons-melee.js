// weapons-melee.js — Melee (9), SPEC §2c.
// Golf Club has 4 head variants (Driver/Iron/Putter/Wedge); Knife has 4 blade
// variants (Combat/Switchblade/Survival/Bushcraft) — each counts as one entry.
export const MELEE = [
  { id: 'bat', name: 'Baseball Bat', kind: 'melee', damage: 24, range: 2.2, handling: 90, unlock: 'm1', variants: ['Wood Bat', 'Aluminium Bat', 'Nail Bat'] },
  { id: 'baton', name: 'Police Baton', kind: 'melee', damage: 20, range: 1.8, handling: 92, unlock: 'm5' },
  { id: 'crowbar', name: 'Crowbar', kind: 'melee', damage: 26, range: 2.0, handling: 85, unlock: 'm2' },
  { id: 'hammer', name: 'Hammer', kind: 'melee', damage: 30, range: 1.6, handling: 80, unlock: 'm7' },
  { id: 'golfclub', name: 'Golf Club', kind: 'melee', damage: 22, range: 2.4, handling: 88, unlock: 'm15', variants: ['Driver', 'Iron', 'Putter', 'Wedge'] },
  { id: 'poolcue', name: 'Pool Cue', kind: 'melee', damage: 18, range: 2.2, handling: 86, unlock: 'm11' },
  { id: 'flashlight', name: 'Flashlight', kind: 'melee', damage: 14, range: 1.6, handling: 95, unlock: 'm3', note: 'doubles as a light source' },
  { id: 'knuckles', name: 'Brass Knuckles', kind: 'melee', damage: 28, range: 1.2, handling: 94, unlock: 'm6' },
  { id: 'knife', name: 'Knife', kind: 'melee', damage: 34, range: 1.4, handling: 90, unlock: 'm4', variants: ['Combat Knife', 'Switchblade', 'Survival Knife', 'Bushcraft Knife'] },
];

export function meleeDps(m) {
  // Melee swings ~1.6/s baseline; heavier weapons swing slower.
  const rate = m.damage >= 30 ? 1.3 : 1.7;
  return Math.round(m.damage * rate);
}

export function meleeById(id) {
  return MELEE.find((m) => m.id === id) || null;
}
