// weapons-special.js — Special category (3). COORDINATOR ADDITIONS, not user
// spec: the user delegated weapon categories to the assistant (SPEC §2,
// "lu aja beresin kalo soal category") and these are clearly marked as
// additions the user can veto. They bring the total to 69 (66 user + 3).
export const SPECIALS = [
  { id: 'minigun', name: 'Minigun', kind: 'special', damage: 28, fireRate: 20.0, range: 80, handling: 40, capacity: 500, unlock: 'm63', variants: ['Standard Minigun', 'Gold Minigun'], added: 'coordinator' },
  { id: 'railgun', name: 'Railgun', kind: 'special', damage: 220, fireRate: 0.5, range: 150, handling: 45, capacity: 10, unlock: 'm70', added: 'coordinator' },
  { id: 'firework', name: 'Firework Launcher', kind: 'special', damage: 60, fireRate: 1.0, range: 50, handling: 70, capacity: 12, unlock: 'm64', added: 'coordinator' },
];

export function specialDps(s) {
  return Math.round(s.damage * s.fireRate);
}

export function specialById(id) {
  return SPECIALS.find((s) => s.id === id) || null;
}
