// gunshops.js — Ammu-Nation network, SPEC §23 + §27.
// 24 Ammu-Nation shops; 6 "Expanded" shops carry the fullest stock:
// Woodhatch (Capri), Big Shots (Hamlet), Phil's Ammu-Nation, Black Eagle,
// Iron & Oak, Prestige Firearms (Coral Strand).
// 8 attachment categories. Shopping challenges: Well Armed, Stylishly Armed,
// Heavily Armed. Green weapon locker at Ammu-Nation for loadouts
// (pawn-shop storage is separate).
export const SHOPS = [
  { id: 'woodhatch', name: 'Woodhatch', area: 'Capri', expanded: true },
  { id: 'bigshots', name: 'Big Shots', area: 'Hamlet', expanded: true },
  { id: 'phils', name: "Phil's Ammu-Nation", area: 'Azura Bay', expanded: true, owner: 'Phil Cassidy' },
  { id: 'blackeagle', name: 'Black Eagle', area: 'Azura Bay', expanded: true },
  { id: 'ironoak', name: 'Iron & Oak', area: 'Ambrosia', expanded: true },
  { id: 'prestige', name: 'Prestige Firearms', area: 'Coral Strand', expanded: true },
  { id: 'stronghold', name: 'Stronghold Ammunition', area: 'Azura Bay', expanded: false },
  { id: 'pawnandgun', name: 'Pawn and Gun', area: 'Port Marlowe', expanded: false },
  { id: 'ab1', name: 'Ammu-Nation Downtown', area: 'Downtown', expanded: false },
  { id: 'ab2', name: 'Ammu-Nation Little Havana', area: 'Little Havana', expanded: false },
  { id: 'ab3', name: 'Ammu-Nation Coral Drive', area: 'Coral Drive', expanded: false },
  { id: 'ab4', name: 'Ammu-Nation Coral Strand', area: 'Coral Strand', expanded: false },
  { id: 'ab5', name: 'Ammu-Nation Stockyard', area: 'Stockyard', expanded: false },
  { id: 'ab6', name: 'Ammu-Nation La Perle', area: 'La Perle', expanded: false },
  { id: 'ab7', name: 'Ammu-Nation Bayside', area: 'Bayside', expanded: false },
  { id: 'ab8', name: 'Ammu-Nation Salton', area: 'Salton', expanded: false },
  { id: 'ab9', name: 'Ammu-Nation Millport', area: 'Millport', expanded: false },
  { id: 'ab10', name: 'Ammu-Nation Watson Bay', area: 'Watson Bay', expanded: false },
  { id: 'ab11', name: 'Ammu-Nation Key Lento', area: 'Key Lento', expanded: false },
  { id: 'ab12', name: 'Ammu-Nation Reedmarsh', area: 'Reedmarsh', expanded: false },
  { id: 'ab13', name: 'Ammu-Nation Waning Sands', area: 'Waning Sands', expanded: false },
  { id: 'ab14', name: 'Ammu-Nation Mount Corvina', area: 'Mount Corvina', expanded: false },
  { id: 'ab15', name: 'Ammu-Nation Pelican Key', area: 'Pelican Key', expanded: false },
  { id: 'ab16', name: 'Ammu-Nation Marlowe Raceway', area: 'Marlowe International Raceway', expanded: false },
];

// 8 attachment categories (SPEC §27).
export const ATTACHMENT_CATEGORIES = [
  'Grips', 'Magazines', 'Optics', 'Suppressors',
  'Muzzle/Tactical Attachments', 'Flashlights', 'Cosmetic Finishes', 'Stocks',
];

// Shopping challenges (SPEC §27).
export const SHOPPING_CHALLENGES = ['Well Armed', 'Stylishly Armed', 'Heavily Armed'];

export function expandedCount() {
  return SHOPS.filter((s) => s.expanded).length;
}

export function shopById(id) {
  return SHOPS.find((s) => s.id === id) || null;
}
