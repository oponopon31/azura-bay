// gunshops.js — Ironhold Arms network, SPEC §23 + §27.
// 24 Ironhold Arms shops; 6 "Expanded" shops carry the fullest stock:
// Woodhatch (Capri), Big Shots (Foxglove), Hank's Ironhold, Black Eagle,
// Iron & Oak, Prestige Firearms (Coral Strand).
// 8 attachment categories. Shopping challenges: Well Armed, Stylishly Armed,
// Heavily Armed. Green weapon locker at Ironhold Arms for loadouts
// (pawn-shop storage is separate).
export const SHOPS = [
  { id: 'woodhatch', name: 'Woodhatch', area: 'Capri', expanded: true },
  { id: 'bigshots', name: 'Big Shots', area: 'Foxglove', expanded: true },
  { id: 'phils', name: "Hank's Ironhold", area: 'Azura Bay', expanded: true, owner: 'Hank Fuller' },
  { id: 'blackeagle', name: 'Black Eagle', area: 'Azura Bay', expanded: true },
  { id: 'ironoak', name: 'Iron & Oak', area: 'Ambrosia', expanded: true },
  { id: 'prestige', name: 'Prestige Firearms', area: 'Coral Strand', expanded: true },
  { id: 'stronghold', name: 'Stronghold Ammunition', area: 'Azura Bay', expanded: false },
  { id: 'pawnandgun', name: 'Pawn and Gun', area: 'Port Marlowe', expanded: false },
  { id: 'ab1', name: 'Ironhold Arms Downtown', area: 'Downtown', expanded: false },
  { id: 'ab2', name: 'Ironhold Arms Salsa Quarter', area: 'Salsa Quarter', expanded: false },
  { id: 'ab3', name: 'Ironhold Arms Coral Drive', area: 'Coral Drive', expanded: false },
  { id: 'ab4', name: 'Ironhold Arms Coral Strand', area: 'Coral Strand', expanded: false },
  { id: 'ab5', name: 'Ironhold Arms Stockyard', area: 'Stockyard', expanded: false },
  { id: 'ab6', name: 'Ironhold Arms La Perle', area: 'La Perle', expanded: false },
  { id: 'ab7', name: 'Ironhold Arms Bayview', area: 'Bayview', expanded: false },
  { id: 'ab8', name: 'Ironhold Arms Salton', area: 'Salton', expanded: false },
  { id: 'ab9', name: 'Ironhold Arms Millhaven', area: 'Millhaven', expanded: false },
  { id: 'ab10', name: 'Ironhold Arms Waverly Bay', area: 'Waverly Bay', expanded: false },
  { id: 'ab11', name: 'Ironhold Arms Cayo Verde', area: 'Cayo Verde', expanded: false },
  { id: 'ab12', name: 'Ironhold Arms Reedmarsh', area: 'Reedmarsh', expanded: false },
  { id: 'ab13', name: 'Ironhold Arms Silver Sands', area: 'Silver Sands', expanded: false },
  { id: 'ab14', name: 'Ironhold Arms Mount Corvina', area: 'Mount Corvina', expanded: false },
  { id: 'ab15', name: 'Ironhold Arms Pelican Key', area: 'Pelican Key', expanded: false },
  { id: 'ab16', name: 'Ironhold Arms Marlowe Raceway', area: 'Marlowe International Raceway', expanded: false },
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
