// AZURA BAY — special weapons (round 7 re-compose, written fresh under r7).
// 3 coordinator-added Special weapons, marked as additions the user can veto
// (SPEC.md section 2, delegation note). Total weapons = 66 user + 3 = 69.

export const SPECIAL = [
  { id: "minigun", name: "Minigun", damage: 30, fireRate: 20, range: 70, handling: 40, capacity: 500, price: 15000, unlock: 60, desc: "Special addition. Variants: Standard, Gold." },
  { id: "railgun", name: "Railgun", damage: 200, fireRate: 0.5, range: 150, handling: 35, capacity: 5, price: 20000, unlock: 70, desc: "Special addition. Experimental." },
  { id: "firework", name: "Firework Launcher", damage: 80, fireRate: 1, range: 60, handling: 50, capacity: 10, price: 8000, unlock: 65, desc: "Special addition. Celebratory." },
];

export function specialById(id) { return SPECIAL.find((w) => w.id === id) || null; }
export function specialDps(w) { return Math.round(w.damage * w.fireRate); }
export function totalSpecial() { return SPECIAL.length; }
export function totalWeapons() { return 16 + 37 + 9 + 4 + 3; } // 69
