// AZURA BAY — fishing (round 7 re-compose, written fresh under r7).
// SPEC.md Bab 18. 35 fish species. Rarity: common, uncommon, rare,
// legendary. Legendary fish only bite at night or in storms.

export const FISH = [
  { name: "Bluegill", rarity: "common", weight: 0.5 },
  { name: "Largemouth Bass", rarity: "common", weight: 2.5 },
  { name: "Catfish", rarity: "common", weight: 4.0 },
  { name: "Redfish", rarity: "common", weight: 3.0 },
  { name: "Snook", rarity: "common", weight: 5.0 },
  { name: "Tarpon", rarity: "uncommon", weight: 25.0 },
  { name: "Mahi Mahi", rarity: "uncommon", weight: 12.0 },
  { name: "Kingfish", rarity: "uncommon", weight: 15.0 },
  { name: "Grouper", rarity: "uncommon", weight: 18.0 },
  { name: "Snapper", rarity: "uncommon", weight: 6.0 },
  { name: "Trout", rarity: "common", weight: 1.5 },
  { name: "Mullet", rarity: "common", weight: 1.0 },
  { name: "Pompano", rarity: "common", weight: 2.0 },
  { name: "Flounder", rarity: "common", weight: 2.5 },
  { name: "Sheepshead", rarity: "common", weight: 3.5 },
  { name: "Black Drum", rarity: "uncommon", weight: 8.0 },
  { name: "Spotted Seatrout", rarity: "uncommon", weight: 4.5 },
  { name: "Cobia", rarity: "uncommon", weight: 20.0 },
  { name: "Amberjack", rarity: "uncommon", weight: 30.0 },
  { name: "Sailfish", rarity: "rare", weight: 40.0 },
  { name: "Marlin", rarity: "rare", weight: 60.0 },
  { name: "Tuna", rarity: "rare", weight: 50.0 },
  { name: "Shark", rarity: "rare", weight: 80.0 },
  { name: "Stingray", rarity: "rare", weight: 15.0 },
  { name: "Eel", rarity: "rare", weight: 3.0 },
  { name: "Barracuda", rarity: "rare", weight: 10.0 },
  { name: "Bonefish", rarity: "rare", weight: 5.0 },
  { name: "Permit", rarity: "rare", weight: 7.0 },
  { name: "Golden Tarpon", rarity: "legendary", weight: 35.0 },
  { name: "Ghost Marlin", rarity: "legendary", weight: 70.0 },
  { name: "King of the Keys", rarity: "legendary", weight: 90.0 },
  { name: "Swamp Monster", rarity: "legendary", weight: 100.0 },
  { name: "Neon Guppy", rarity: "legendary", weight: 0.2 },
  { name: "Ancient Catfish", rarity: "legendary", weight: 50.0 },
  { name: "Leviathan", rarity: "legendary", weight: 200.0 },
];

export function totalFish() { return FISH.length; }
export function fishByRarity(rarity) { return FISH.filter((f) => f.rarity === rarity); }
export function fishByName(name) { return FISH.find((f) => f.name === name) || null; }
// Legendary fish only bite at night or in storms.
export function canCatch(fish, timeMinutes, weather) {
  if (fish.rarity !== "legendary") return true;
  const h = timeMinutes / 60;
  const night = h >= 20 || h < 6;
  return night || weather === "storm" || weather === "rain";
}
export function fishValue(fish) {
  const base = { common: 10, uncommon: 50, rare: 200, legendary: 1000 }[fish.rarity];
  return Math.round(base * (1 + fish.weight / 10));
}
