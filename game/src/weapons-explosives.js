// AZURA BAY — explosives (round 7 re-compose, written fresh under r7).
// 4 explosives, exact user names from SPEC.md section 2d.

export const EXPLOSIVES = [
  { id: "frag", name: "Frag Grenade", damage: 90, fireRate: 1, range: 30, handling: 70, capacity: 5, price: 500, unlock: 20, desc: "Standard frag. Variants: Standard, Impact." },
  { id: "sticky", name: "Sticky Bomb", damage: 120, fireRate: 1, range: 25, handling: 65, capacity: 5, price: 800, unlock: 30, desc: "Sticks, then booms." },
  { id: "molotov", name: "Molotov Cocktail", damage: 60, fireRate: 1, range: 20, handling: 75, capacity: 5, price: 300, unlock: 15, desc: "Fire Bottle. Variants: Classic, Napalm." },
  { id: "smoke", name: "Smoke Grenade", damage: 5, fireRate: 1, range: 25, handling: 80, capacity: 5, price: 250, unlock: 18, desc: "Smoke / Flashbang. Cover and blind." },
];

export function explosiveById(id) { return EXPLOSIVES.find((w) => w.id === id) || null; }
export function totalExplosives() { return EXPLOSIVES.length; }
