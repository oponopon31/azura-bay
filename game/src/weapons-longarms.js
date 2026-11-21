// weapons-longarms.js — Longarms (37), SPEC §2b.
// SMG 8, Shotguns 10, Assault Rifles 8, LMG 2, Sniper Rifles 4, Heavy 5.
// Stats: damage, fireRate, range, handling, capacity, unlock (mission gating).
export const LONGARMS = [
  // SMG (8)
  { id: 'microsmg', name: 'Micro SMG', sub: 'smg', damage: 18, fireRate: 11.0, range: 30, handling: 86, capacity: 30, unlock: 'm4' },
  { id: 'mac11', name: 'MAC-11', sub: 'smg', damage: 20, fireRate: 12.0, range: 26, handling: 78, capacity: 32, unlock: 'm8' },
  { id: 'vatra', name: 'BZI Vatra', sub: 'smg', damage: 22, fireRate: 9.0, range: 34, handling: 82, capacity: 28, unlock: 'm14' },
  { id: 'uw9', name: 'UW9', sub: 'smg', damage: 21, fireRate: 10.0, range: 32, handling: 84, capacity: 30, unlock: 'm19' },
  { id: 'peg9', name: 'PEG-9', sub: 'smg', damage: 23, fireRate: 9.5, range: 36, handling: 80, capacity: 33, unlock: 'm25' },
  { id: 'mp5', name: 'MP5', sub: 'smg', damage: 24, fireRate: 9.0, range: 40, handling: 88, capacity: 30, unlock: 'm31', variants: ['MP5K', 'MP5SD', 'MP5A3'] },
  { id: 'militarysmg', name: 'Vom Feuer Military SMG', sub: 'smg', damage: 25, fireRate: 8.5, range: 42, handling: 86, capacity: 30, unlock: 'm37' },
  { id: 'pd90', name: 'ADB PD-90', sub: 'smg', damage: 19, fireRate: 10.5, range: 30, handling: 90, capacity: 50, unlock: 'm44' },
  // Shotguns (10)
  { id: 'morland850', name: 'Morland 850', sub: 'shotgun', damage: 64, fireRate: 1.1, range: 18, handling: 70, capacity: 6, unlock: 'm7' },
  { id: 'laird350', name: 'Fortune & Son Laird 350', sub: 'shotgun', damage: 58, fireRate: 1.3, range: 20, handling: 74, capacity: 5, unlock: 'm13' },
  { id: 'drifter', name: 'Shrewsbury Drifter', sub: 'shotgun', damage: 52, fireRate: 1.6, range: 22, handling: 78, capacity: 8, unlock: 'm18' },
  { id: 'hobo', name: 'Shrewsbury Hobo', sub: 'shotgun', damage: 48, fireRate: 1.8, range: 20, handling: 80, capacity: 6, unlock: 'm23' },
  { id: 'longshot', name: 'Mason & Keen Longshot', sub: 'shotgun', damage: 70, fireRate: 0.9, range: 24, handling: 66, capacity: 4, unlock: 'm29' },
  { id: 'shortstraw', name: 'Mason & Keen Shortstraw', sub: 'shotgun', damage: 62, fireRate: 1.2, range: 14, handling: 72, capacity: 2, unlock: 'm33' },
  { id: 'az1200', name: 'Girardi AZ1200', sub: 'shotgun', damage: 56, fireRate: 1.5, range: 22, handling: 76, capacity: 8, unlock: 'm39' },
  { id: 'super400', name: 'Girardi Super400', sub: 'shotgun', damage: 60, fireRate: 1.4, range: 20, handling: 75, capacity: 7, unlock: 'm45' },
  { id: 'comshot12', name: 'Godwin Comshot 12', sub: 'shotgun', damage: 66, fireRate: 1.0, range: 19, handling: 68, capacity: 6, unlock: 'm52' },
  { id: 'kvga12', name: 'Kozlov KVGA-12', sub: 'shotgun', damage: 54, fireRate: 2.2, range: 21, handling: 77, capacity: 10, unlock: 'm58' },
  // Assault Rifles (8)
  { id: 'kz59', name: 'Kozlov KZ-59', sub: 'rifle', damage: 36, fireRate: 8.0, range: 70, handling: 76, capacity: 30, unlock: 'm10' },
  { id: 'duke556', name: 'Duke Arms 556', sub: 'rifle', damage: 34, fireRate: 8.5, range: 75, handling: 80, capacity: 30, unlock: 'm17' },
  { id: 'compactar', name: 'Compact Assault Rifle', sub: 'rifle', damage: 32, fireRate: 9.0, range: 60, handling: 84, capacity: 30, unlock: 'm24' },
  { id: 'heathen', name: 'Hillinger Heathen', sub: 'rifle', damage: 38, fireRate: 7.5, range: 72, handling: 78, capacity: 30, unlock: 'm32' },
  { id: 'fra', name: 'ADB FRA', sub: 'rifle', damage: 35, fireRate: 8.2, range: 74, handling: 79, capacity: 30, unlock: 'm40' },
  { id: 'vfg1', name: 'Vom Feuer VF-G1', sub: 'rifle', damage: 37, fireRate: 7.8, range: 78, handling: 81, capacity: 30, unlock: 'm47' },
  { id: 'w14', name: 'Wortham W-14', sub: 'rifle', damage: 33, fireRate: 8.8, range: 68, handling: 83, capacity: 32, unlock: 'm55' },
  { id: 'tmr', name: 'Tactical Marksman Rifle', sub: 'rifle', damage: 52, fireRate: 2.5, range: 95, handling: 72, capacity: 10, unlock: 'm62' },
  // LMG (2)
  { id: 'cmg', name: 'Combat Machine Gun', sub: 'lmg', damage: 30, fireRate: 9.5, range: 65, handling: 62, capacity: 100, unlock: 'm49' },
  { id: 'm350', name: 'ADB M350', sub: 'lmg', damage: 32, fireRate: 8.8, range: 68, handling: 64, capacity: 120, unlock: 'm57' },
  // Sniper Rifles (4)
  { id: 'ffsr', name: 'Fairview FF-SR', sub: 'sniper', damage: 95, fireRate: 0.8, range: 220, handling: 58, capacity: 5, unlock: 'm42' },
  { id: 'huntingsniper', name: 'Hunting Sniper Rifle', sub: 'sniper', damage: 82, fireRate: 1.0, range: 180, handling: 64, capacity: 5, unlock: 'm50' },
  { id: 'assaultsniper', name: 'Duke Assault Sniper', sub: 'sniper', damage: 88, fireRate: 1.1, range: 200, handling: 62, capacity: 8, unlock: 'm60' },
  { id: 'ff50', name: 'Fairview FF-50', sub: 'sniper', damage: 120, fireRate: 0.6, range: 300, handling: 50, capacity: 5, unlock: 'm71', note: '.50 anti-materiel' },
  // Heavy Weapons (5)
  { id: 'boomer', name: 'Hillinger Boomer', sub: 'heavy', damage: 150, fireRate: 0.5, range: 60, handling: 45, capacity: 4, unlock: 'm59' },
  { id: 'glr40', name: 'Deever Tech GLR40', sub: 'heavy', damage: 140, fireRate: 0.7, range: 55, handling: 48, capacity: 6, unlock: 'm66' },
  { id: 'hat', name: 'Hauners H-AT', sub: 'heavy', damage: 180, fireRate: 0.4, range: 90, handling: 42, capacity: 2, unlock: 'm73', note: 'RPG anti-vehicle' },
  { id: 'flamethrower', name: 'Flamethrower', sub: 'heavy', damage: 25, fireRate: 6.0, range: 12, handling: 55, capacity: 100, unlock: 'm68' },
  { id: 'speargun', name: 'Speargun', sub: 'heavy', damage: 70, fireRate: 0.7, range: 40, handling: 60, capacity: 1, unlock: 'm54' },
];

// Sub-category counts (SPEC §2b): 8 / 10 / 8 / 2 / 4 / 5 = 37.
export const LONGARM_SUBCOUNTS = {
  smg: 8,
  shotgun: 10,
  rifle: 8,
  lmg: 2,
  sniper: 4,
  heavy: 5,
};

export function longarmsInSub(sub) {
  return LONGARMS.filter((w) => w.sub === sub);
}

export function weaponsInTier(tier) {
  return LONGARMS.filter((w) => w.sub === tier);
}

export function longarmById(id) {
  return LONGARMS.find((w) => w.id === id) || null;
}
