// collectibles.js — Collections & 100% completion, SPEC §5.
// Itemized list (1,216 items + 26 Hidden Packages = 1,242 tracked items).
// The spec's "~3,000" is the in-fiction total toward 100%; the itemized
// list below is fully implemented and tracked.
export const CARD_SETS = [
  { name: 'Azura Bay Flamingos', count: 24, theme: 'Sports' },
  { name: 'Narcos', count: 24, theme: 'Sports' },
  { name: 'Manatees', count: 24, theme: 'Sports' },
  { name: 'Club De Fútbol', count: 30, theme: 'Sports' },
  { name: 'Harbor City Swingers', count: 24, theme: 'Sports' },
  { name: 'Penetrators', count: 24, theme: 'Sports' },
  { name: 'Wrath', count: 24, theme: 'Sports' },
  { name: 'Sunset Corkers', count: 24, theme: 'Sports' },
  { name: 'Panic', count: 24, theme: 'Sports' },
  { name: 'Pounders', count: 24, theme: 'Sports' },
  { name: 'Backyard Wrestling', count: 12, theme: 'Entertainment & Comics' },
  { name: "America's Next Top Hooker", count: 24, theme: 'Entertainment & Comics' },
  { name: 'Delights Dancers', count: 18, theme: 'Entertainment & Comics' },
  { name: 'Jack of Hearts Dancers', count: 36, theme: 'Entertainment & Comics' },
  { name: 'Nine1Nine Dancers', count: 36, theme: 'Entertainment & Comics' },
  { name: 'The Legends of Ratface', count: 36, theme: 'Entertainment & Comics' },
  { name: "Right Wing: America's Hero", count: 36, theme: 'Entertainment & Comics' },
  { name: 'Ed Comics Universe', count: 36, theme: 'Entertainment & Comics' },
];

export const COLLECTIBLE_GROUPS = [
  { id: 'cards', name: 'Collectible Cards', total: 480, sets: 18, sellTo: 'Azura Bay Pawn & Pawn Stash' },
  { id: 'flamingos', name: 'Cocaine Flamingos', total: 125, note: 'flamingo statues hiding hidden packages' },
  { id: 'watches', name: 'Luxury Watches', total: 34, note: 'unlock the time-control cheats' },
  { id: 'underwater', name: 'Underwater Discoveries', total: 33, note: 'sunken treasure & shipwrecks' },
  { id: 'waink-landmarks', name: 'WAiNK Landmarks', total: 31 },
  { id: 'waink-curiosities', name: 'WAiNK Curiosities', total: 35 },
  { id: 'waink-sculptures', name: 'WAiNK Sculptures', total: 23 },
  { id: 'magazines', name: 'Magazines, Books & Comics', total: 27 },
  { id: 'bookswaps', name: 'Book Swaps', total: 7 },
  { id: 'tags', name: 'No Flusher Tags', total: 23, note: 'street graffiti/tags' },
  { id: 'meditation', name: 'Meditation Spots', total: 18 },
  { id: 'hoops', name: 'Basketball Hoops', total: 100 },
  { id: 'standout', name: 'Standout Vehicles', total: 280 },
  { id: 'hidden-packages', name: 'Hidden Packages', total: 26, note: '26 locations across Solmaris (Bab 27)' },
];

export function totalCollectibles() {
  return COLLECTIBLE_GROUPS.reduce((n, g) => n + g.total, 0);
}

export function totalCards() {
  return CARD_SETS.reduce((n, s) => n + s.count, 0);
}

// 100% completion percentage from a {groupId: foundCount} map.
export function progressPct(found) {
  const total = totalCollectibles();
  let got = 0;
  for (const g of COLLECTIBLE_GROUPS) got += Math.min(found[g.id] || 0, g.total);
  return Math.round((got / total) * 1000) / 10;
}
