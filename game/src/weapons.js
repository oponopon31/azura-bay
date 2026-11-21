// weapons.js — Sidearms (16), SPEC §2a. User's exact names, no renames.
// ES9 = Jason's starting pistol, K17 = Lucia's standard pistol.
// Fairview Kalinga .50 has the highest pistol damage (55);
// Scorpio Akulus has the highest revolver damage (58); Coil Shocker is stun.
// Stats: damage (per shot), fireRate (shots/s), range (m), handling (0-100),
// capacity (magazine), unlock (mission gating), role (who starts with it).
export const SIDEARMS = [
  { id: 'nipper', name: 'Scorpio Nipper .38', kind: 'sidearm', damage: 22, fireRate: 3.2, range: 28, handling: 88, capacity: 6, unlock: 'm1', note: 'compact, light' },
  { id: 'es9', name: 'Girardi ES9', kind: 'sidearm', damage: 26, fireRate: 4.0, range: 32, handling: 82, capacity: 15, unlock: 'm1', role: 'jason-start', note: "Jason's starting pistol" },
  { id: 'k17', name: 'Klose K17', kind: 'sidearm', damage: 27, fireRate: 4.2, range: 34, handling: 85, capacity: 17, unlock: 'm1', role: 'lucia-standard', note: "Lucia's standard pistol, polymer 9mm" },
  { id: 'duke1992', name: 'Duke Arms 1992', kind: 'sidearm', damage: 34, fireRate: 2.6, range: 30, handling: 74, capacity: 8, unlock: 'm3', note: 'heavy, M1911-style' },
  { id: 'es18', name: 'Girardi ES18', kind: 'sidearm', damage: 24, fireRate: 3.0, range: 30, handling: 80, capacity: 18, unlock: 'm12', burst: 3, note: 'burst-fire, 3 rounds per pull — fires 3 bullets' },
  { id: 'k17mcd', name: 'Klose K17 MCD', kind: 'sidearm', damage: 22, fireRate: 9.0, range: 26, handling: 70, capacity: 24, unlock: 'm22', note: 'full-auto, 24 rounds' },
  { id: 'drx', name: 'Schlamm DRX', kind: 'sidearm', damage: 30, fireRate: 3.4, range: 40, handling: 90, capacity: 12, unlock: 'm27', note: 'tactical, high precision' },
  { id: 'kalinga50', name: 'Fairview Kalinga .50', kind: 'sidearm', damage: 55, fireRate: 1.8, range: 38, handling: 62, capacity: 7, unlock: 'm34', note: 'big-calibre, Desert Eagle-style, highest pistol damage' },
  { id: 'shocker', name: 'Coil Shocker', kind: 'sidearm', damage: 5, fireRate: 1.0, range: 6, handling: 95, capacity: 1, unlock: 'm9', stun: true, note: 'electric stun gun, non-lethal' },
  { id: 'wcr1', name: 'Wortham WCR-1', kind: 'sidearm', damage: 30, fireRate: 2.8, range: 24, handling: 96, capacity: 5, unlock: 'm16', note: 'snub-nose revolver, highest handling' },
  { id: 'hawk38', name: 'Hawk & Little .38', kind: 'sidearm', damage: 28, fireRate: 2.4, range: 26, handling: 84, capacity: 6, unlock: 'm6', note: 'classic double-action revolver' },
  { id: 'mustang357', name: 'Duke Mustang .357', kind: 'sidearm', damage: 42, fireRate: 2.0, range: 32, handling: 72, capacity: 6, unlock: 'm30', note: 'magnum revolver, high destruction' },
  { id: 'morgan', name: 'Hawk & Little Morgan', kind: 'sidearm', damage: 46, fireRate: 1.9, range: 36, handling: 68, capacity: 6, unlock: 'm41', note: 'large special revolver' },
  { id: 'akulus', name: 'Scorpio Akulus', kind: 'sidearm', damage: 58, fireRate: 1.6, range: 44, handling: 60, capacity: 6, unlock: 'm48', note: 'heavy long-barrel revolver, highest revolver damage' },
  { id: 'capo', name: 'Capo Pistol', kind: 'sidearm', damage: 32, fireRate: 3.0, range: 30, handling: 78, capacity: 10, unlock: 'm36', note: 'classic / cartel style' },
  { id: 'service', name: 'Beretta-style Service Pistol', kind: 'sidearm', damage: 25, fireRate: 4.4, range: 30, handling: 86, capacity: 15, unlock: 'm20', note: 'standard law-enforcement service pistol' },
];

// Damage per second (burst weapons fire `burst` rounds per pull).
export function weaponDps(w) {
  return w.damage * w.fireRate * (w.burst || 1);
}

export function sidearmById(id) {
  return SIDEARMS.find((w) => w.id === id) || null;
}

// Starting loadout per protagonist.
export function startingSidearm(protagonist) {
  if (protagonist === 'jason') return sidearmById('es9');
  return sidearmById('k17');
}
