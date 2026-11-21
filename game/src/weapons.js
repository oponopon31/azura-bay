// AZURA BAY — sidearms (round 7 re-compose, written fresh under r7).
// 16 sidearms, EXACT user names from SPEC.md §2a. ES9 = Jason's start
// pistol, K17 = Lucia's standard. Fairview Kalinga .50 = highest pistol
// damage; Scorpio Akulus = highest revolver damage; Coil Shocker = stun.

export const SIDEARMS = [
  { id: 'nipper', name: 'Scorpio Nipper .38', kind: 'pistol', damage: 22, fireRate: 4.5, range: 28, handling: 88, capacity: 6, price: 350, unlock: 1, desc: 'Compact and light.' },
  { id: 'es9', name: 'Girardi ES9', kind: 'pistol', damage: 26, fireRate: 5.0, range: 32, handling: 80, capacity: 15, price: 500, unlock: 1, desc: "Standard pistol. Jason's starting sidearm." },
  { id: 'k17', name: 'Klose K17', kind: 'pistol', damage: 25, fireRate: 5.2, range: 30, handling: 84, capacity: 17, price: 550, unlock: 1, desc: "Polymer 9mm. Lucia's standard pistol." },
  { id: 'duke1992', name: 'Duke Arms 1992', kind: 'pistol', damage: 34, fireRate: 3.2, range: 30, handling: 70, capacity: 8, price: 900, unlock: 5, desc: 'Heavy, M1911-style.' },
  { id: 'es18', name: 'Girardi ES18', kind: 'pistol', damage: 24, fireRate: 6.0, range: 30, handling: 76, capacity: 18, price: 1200, unlock: 12, desc: 'Burst-fire, 3 rounds per pull.' , burst: 3 },
  { id: 'k17mcd', name: 'Klose K17 MCD', kind: 'pistol', damage: 23, fireRate: 9.0, range: 26, handling: 72, capacity: 24, price: 1800, unlock: 20, desc: 'Full-auto, 24 rounds.' },
  { id: 'drx', name: 'Schlamm DRX', kind: 'pistol', damage: 30, fireRate: 4.0, range: 40, handling: 82, capacity: 12, price: 1500, unlock: 18, desc: 'Tactical, high precision.' },
  { id: 'kalinga50', name: 'Fairview Kalinga .50', kind: 'pistol', damage: 55, fireRate: 2.2, range: 34, handling: 55, capacity: 7, price: 2500, unlock: 34, desc: 'Big-bore Desert Eagle-style. Highest pistol damage.' },
  { id: 'shocker', name: 'Coil Shocker', kind: 'stun', damage: 5, fireRate: 1.5, range: 6, handling: 90, capacity: 1, price: 400, unlock: 3, desc: 'Electric stun gun. Non-lethal.' },
  { id: 'wcr1', name: 'Wortham WCR-1', kind: 'revolver', damage: 30, fireRate: 3.5, range: 26, handling: 92, capacity: 5, price: 700, unlock: 8, desc: 'Snub-nose revolver. Highest handling.' },
  { id: 'hl38', name: 'Hawk & Little .38', kind: 'revolver', damage: 28, fireRate: 3.0, range: 28, handling: 78, capacity: 6, price: 650, unlock: 6, desc: 'Classic double-action revolver.' },
  { id: 'mustang357', name: 'Duke Mustang .357', kind: 'revolver', damage: 42, fireRate: 2.8, range: 32, handling: 68, capacity: 6, price: 1400, unlock: 25, desc: 'Magnum revolver. High destructive power.' },
  { id: 'morgan', name: 'Hawk & Little Morgan', kind: 'revolver', damage: 46, fireRate: 2.5, range: 34, handling: 60, capacity: 6, price: 1900, unlock: 40, desc: 'Large special revolver.' },
  { id: 'akulus', name: 'Scorpio Akulus', kind: 'revolver', damage: 58, fireRate: 2.0, range: 38, handling: 50, capacity: 6, price: 2800, unlock: 44, desc: 'Heavy long-barrel revolver. Highest revolver damage.' },
  { id: 'capo', name: 'Capo Pistol', kind: 'pistol', damage: 32, fireRate: 3.8, range: 30, handling: 74, capacity: 10, price: 1100, unlock: 30, desc: 'Classic / cartel style.' },
  { id: 'service', name: 'Beretta-style Service Pistol', kind: 'pistol', damage: 27, fireRate: 4.8, range: 32, handling: 81, capacity: 15, price: 600, unlock: 2, desc: 'Standard service pistol.' },
];

export function sidearmById(id) { return SIDEARMS.find((w) => w.id === id) || null; }
export function weaponDps(w) { return Math.round(w.damage * w.fireRate); }
export function startPistol(protagonist) {
  return protagonist === 'Jason' ? sidearmById('es9') : sidearmById('k17');
}
