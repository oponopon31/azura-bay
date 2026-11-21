// weapons-special.js — Special category (3 entries).
// *** Kategori Special = tambahan koordinator, BUKAN spesifikasi user — bisa di-veto. ***
// The user's arsenal has no minigun, a GTA staple. These three are a
// coordinator addition: if the user vetoes this category, delete this file
// and its one line in weapons.js — every other system keeps working.
// Minigun spins up before firing; Railgun is a charge shot that penetrates;
// Firework Launcher lobs colourful explosive rockets.

export const SPECIAL = [
  { id: 'minigun', name: 'Minigun', kind: 'special', damage: 22, rpm: 1200, mag: 200, mode: 'auto', spinUp: 0.5, handling: 0.50, range: 130, recoil: 0.80, spread: 0.030, reloadMs: 4000, moveSlow: 0.60, tracer: 0xffe9a8, price: 25000, tier: 3, desc: 'A gatling gun — spin it up and hold the trigger. Everything in front of you has a bad day.' },
  { id: 'railgun', name: 'Railgun', kind: 'special', damage: 150, rpm: 30, mag: 1, mode: 'charge', handling: 0.60, range: 250, recoil: 2.00, spread: 0.001, reloadMs: 3000, penetrate: true, tracer: 0x7fd4ff, price: 30000, tier: 3, desc: 'A railgun — hold to charge, release to put a hole through whatever is downrange.' },
  { id: 'firework', name: 'Firework Launcher', kind: 'special', damage: 0, blast: 6, blastDamage: 80, rpm: 90, mag: 6, mode: 'semi', handling: 0.65, range: 100, recoil: 1.00, spread: 0.010, reloadMs: 2400, projectile: true, projSpeed: 55, projGravity: 4, tracer: 0xff7ad9, price: 12000, tier: 3, desc: 'A firework launcher — explosive, colourful, and completely unserious.' },
];
