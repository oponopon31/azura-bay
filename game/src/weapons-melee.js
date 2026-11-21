// AZURA BAY — melee weapons (round 7 re-compose, written fresh under r7).
// 9 melee weapons, exact user names from SPEC.md section 2c.

export const MELEE = [
  { id: "bat", name: "Baseball Bat", damage: 18, fireRate: 2.5, range: 2, handling: 85, price: 100, unlock: 1, desc: "Classic bat. Variants: Wood, Aluminium, Nail Bat." },
  { id: "baton", name: "Police Baton", damage: 15, fireRate: 3, range: 2, handling: 88, price: 150, unlock: 4, desc: "Standard issue baton." },
  { id: "crowbar", name: "Crowbar", damage: 20, fireRate: 2.2, range: 2, handling: 80, price: 120, unlock: 2, desc: "Pries doors and heads." },
  { id: "hammer", name: "Hammer", damage: 22, fireRate: 2, range: 2, handling: 78, price: 130, unlock: 3, desc: "Heavy hammer." },
  { id: "golf", name: "Golf Club", damage: 17, fireRate: 2.4, range: 2, handling: 82, price: 200, unlock: 6, desc: "Driver, Iron, Putter, Wedge." },
  { id: "cue", name: "Pool Cue", damage: 14, fireRate: 2.8, range: 2, handling: 84, price: 90, unlock: 5, desc: "Bar-room classic." },
  { id: "flashlight", name: "Flashlight", damage: 12, fireRate: 3, range: 2, handling: 90, price: 80, unlock: 1, desc: "Torch. Light and pain." },
  { id: "knuckles", name: "Brass Knuckles", damage: 16, fireRate: 4, range: 1, handling: 92, price: 250, unlock: 7, desc: "Close and personal." },
  { id: "knife", name: "Knife", damage: 25, fireRate: 3.5, range: 2, handling: 86, price: 300, unlock: 2, desc: "Combat, Switchblade, Survival, Bushcraft." },
];

export function meleeById(id) { return MELEE.find((w) => w.id === id) || null; }
export function meleeDps(w) { return Math.round(w.damage * w.fireRate); }
export function totalMelee() { return MELEE.length; }
