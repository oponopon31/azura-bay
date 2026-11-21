// gunshops.js — Ammu-Nation network, SPEC §23 + §27.
// 24 Ammu-Nation shops; 6 "Expanded" shops carry the fullest stock:
// Woodhatch (Capri), Big Shots (Hamlet), Phil's Ammu-Nation, Black Eagle,
// Iron & Oak, Prestige Firearms (Ocean Beach).
// 8 attachment categories. Shopping challenges: Well Armed, Stylishly Armed,
// Heavily Armed. Green weapon locker at Ammu-Nation for loadouts
// (pawn-shop storage is separate).
export const SHOPS = [
  { id: 'woodhatch', name: 'Woodhatch', area: 'Capri', expanded: true },
  { id: 'bigshots', name: 'Big Shots', area: 'Hamlet', expanded: true },
  { id: 'phils', name: "Phil's Ammu-Nation", area: 'Vice City', expanded: true, owner: 'Phil Cassidy' },
  { id: 'blackeagle', name: 'Black Eagle', area: 'Vice City', expanded: true },
  { id: 'ironoak', name: 'Iron & Oak', area: 'Ambrosia', expanded: true },
  { id: 'prestige', name: 'Prestige Firearms', area: 'Ocean Beach', expanded: true },
  { id: 'stronghold', name: 'Stronghold Ammunition', area: 'Vice City', expanded: false },
  { id: 'pawnandgun', name: 'Pawn and Gun', area: 'Port Gellhorn', expanded: false },
  { id: 'vc1', name: 'Ammu-Nation Downtown', area: 'Downtown', expanded: false },
  { id: 'vc2', name: 'Ammu-Nation Little Havana', area: 'Little Havana', expanded: false },
  { id: 'vc3', name: 'Ammu-Nation Ocean Beach', area: 'Ocean Beach', expanded: false },
  { id: 'vc4', name: 'Ammu-Nation Vice Beach', area: 'Vice Beach', expanded: false },
  { id: 'vc5', name: 'Ammu-Nation Stockyard', area: 'Stockyard', expanded: false },
  { id: 'vc6', name: 'Ammu-Nation La Perle', area: 'La Perle', expanded: false },
  { id: 'vc7', name: 'Ammu-Nation Bayside', area: 'Bayside', expanded: false },
  { id: 'vc8', name: 'Ammu-Nation Salton', area: 'Salton', expanded: false },
  { id: 'vc9', name: 'Ammu-Nation Millport', area: 'Millport', expanded: false },
  { id: 'vc10', name: 'Ammu-Nation Watson Bay', area: 'Watson Bay', expanded: false },
  { id: 'vc11', name: 'Ammu-Nation Key Lento', area: 'Key Lento', expanded: false },
  { id: 'vc12', name: 'Ammu-Nation Grassrivers', area: 'Grassrivers', expanded: false },
  { id: 'vc13', name: 'Ammu-Nation Waning Sands', area: 'Waning Sands', expanded: false },
  { id: 'vc14', name: 'Ammu-Nation Mount Kalaga', area: 'Mount Kalaga', expanded: false },
  { id: 'vc15', name: 'Ammu-Nation Goose Key', area: 'Goose Key', expanded: false },
  { id: 'vc16', name: 'Ammu-Nation Gellhorn Raceway', area: 'Gellhorn International Raceway', expanded: false },
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
