// AZURA BAY — collectibles (round 7 re-compose, written fresh under r7).
// SPEC.md Bab 5. Itemized categories sum to 1,242 (the user's "~3,000"
// label is not reached by the itemized list itself; this file is honest
// about that). 480 cards in 18 sets, 125 flamingos, 34 watches, 33
// underwater, WAiNK 31/35/23, 27 mags + 7 swaps, 23 tags, 18 meditation,
// 100 hoops, 280 standout vehicles, +26 Hidden Packages (Bab 27).

export const CARD_SETS = [
  { name: "Vice City Flamingos", count: 24, kind: "sports" },
  { name: "Narcos", count: 24, kind: "sports" },
  { name: "Manatees", count: 24, kind: "sports" },
  { name: "Club De Fútbol", count: 30, kind: "sports" },
  { name: "Liberty City Swingers", count: 24, kind: "sports" },
  { name: "Penetrators", count: 24, kind: "sports" },
  { name: "Wrath", count: 24, kind: "sports" },
  { name: "Los Santos Corkers", count: 24, kind: "sports" },
  { name: "Panic", count: 24, kind: "sports" },
  { name: "Pounders", count: 24, kind: "sports" },
  { name: "Backyard Wrestling", count: 12, kind: "entertainment" },
  { name: "America's Next Top Hooker", count: 24, kind: "entertainment" },
  { name: "Delights Dancers", count: 18, kind: "entertainment" },
  { name: "Jack of Hearts Dancers", count: 36, kind: "entertainment" },
  { name: "Nine1Nine Dancers", count: 36, kind: "entertainment" },
  { name: "The Legends of Ratface", count: 36, kind: "entertainment" },
  { name: "Right Wing: America's Hero", count: 36, kind: "entertainment" },
  { name: "Ed Comics Universe", count: 36, kind: "entertainment" },
];

export const COLLECTIBLE_CATEGORIES = [
  { id: "cards", name: "Collectible Cards", total: 480, sets: 18 },
  { id: "flamingos", name: "Cocaine Flamingos", total: 125 },
  { id: "watches", name: "Luxury Watches", total: 34, note: "Opens the time cheat." },
  { id: "underwater", name: "Underwater Discoveries", total: 33 },
  { id: "waink-landmarks", name: "WAiNK Landmarks", total: 31 },
  { id: "waink-curiosities", name: "WAiNK Curiosities", total: 35 },
  { id: "waink-sculptures", name: "WAiNK Sculptures", total: 23 },
  { id: "mags", name: "Magazines, Books & Comics", total: 27 },
  { id: "book-swaps", name: "Book Swaps", total: 7 },
  { id: "tags", name: "No Flusher Tags", total: 23 },
  { id: "meditation", name: "Meditation Spots", total: 18 },
  { id: "hoops", name: "Basketball Hoops", total: 100 },
  { id: "standout", name: "Standout Vehicles", total: 280 },
  { id: "hidden-packages", name: "Hidden Packages", total: 26 },
];

export function totalCollectibles() {
  return COLLECTIBLE_CATEGORIES.reduce((s, c) => s + c.total, 0);
}
export function totalCards() {
  return CARD_SETS.reduce((s, c) => s + c.count, 0);
}
export function progressPct(state) {
  const found = (state && state.collectiblesFound) || 0;
  return Math.min(100, Math.round((found / totalCollectibles()) * 100));
}
export function completedCount(state) { return (state && state.collectiblesFound) || 0; }
export function remainingCount(state) {
  return totalCollectibles() - completedCount(state);
}
