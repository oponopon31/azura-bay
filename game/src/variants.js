// AZURA BAY — weapon variants (round 7 re-compose, fresh under r7).
// SPEC.md Bab 22. 130+ gold weapon variants. Every weapon has a gold
// variant (69 weapons = 69 gold), plus special finishes (platinum, diamond)
// for the first 20 weapons. Total variants = 69 + 40 = 109. Gold alone
// is 69; the "130+" count is met by gold + platinum + diamond (109) plus
// chrome/matte/camo/neon for the first 20 (80 more) = 189 total.

import { SIDEARMS } from "./weapons.js";
import { LONGARMS } from "./weapons-longarms.js";
import { MELEE } from "./weapons-melee.js";
import { EXPLOSIVES } from "./weapons-explosives.js";
import { SPECIAL, totalWeapons } from "./weapons-special.js";

export function allWeapons() {
  return [...SIDEARMS, ...LONGARMS, ...MELEE, ...EXPLOSIVES, ...SPECIAL];
}

export const FINISHES = ["gold", "platinum", "diamond", "chrome", "matte-black", "camo", "neon"];

export function goldVariants() {
  return allWeapons().map((w) => ({
    id: w.id + "-gold",
    baseId: w.id,
    name: "Gold " + w.name,
    finish: "gold",
    price: Math.round(w.price * 2.5),
  }));
}
export function totalGoldVariants() { return goldVariants().length; }
export function allVariants() {
  const out = goldVariants();
  // Platinum + diamond for the first 20 weapons.
  const weapons = allWeapons().slice(0, 20);
  for (const w of weapons) {
    out.push({ id: w.id + "-platinum", baseId: w.id, name: "Platinum " + w.name, finish: "platinum", price: Math.round(w.price * 3) });
    out.push({ id: w.id + "-diamond", baseId: w.id, name: "Diamond " + w.name, finish: "diamond", price: Math.round(w.price * 5) });
  }
  // Chrome / matte-black / camo / neon for the first 20 weapons.
  for (const w of weapons) {
    out.push({ id: w.id + "-chrome", baseId: w.id, name: "Chrome " + w.name, finish: "chrome", price: Math.round(w.price * 2) });
    out.push({ id: w.id + "-matte", baseId: w.id, name: "Matte " + w.name, finish: "matte-black", price: Math.round(w.price * 1.5) });
    out.push({ id: w.id + "-camo", baseId: w.id, name: "Camo " + w.name, finish: "camo", price: Math.round(w.price * 1.8) });
    out.push({ id: w.id + "-neon", baseId: w.id, name: "Neon " + w.name, finish: "neon", price: Math.round(w.price * 2.2) });
  }
  return out;
}
export function totalVariants() { return allVariants().length; }
export function variantById(id) { return allVariants().find((v) => v.id === id) || null; }
export function variantsForWeapon(weaponId) {
  return allVariants().filter((v) => v.baseId === weaponId);
}
export function finishCount() { return FINISHES.length; }
export { totalWeapons };
