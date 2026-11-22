// properties.js — Properties, safehouses & businesses, SPEC §9.
// Safehouses can NOT be bought — they unlock automatically with story progress.
// Garages are the only buyable property: 12 base (8 buy + 4 free from story)
// + 3 special-edition bonus garages = 15 total.
export const SAFEHOUSES = [
  { id: 'keys-house', name: "Cole's Cayo Verde House", area: 'Cayo Verde', unlock: 'm1', note: 'starting safehouse' },
  { id: 'bayside-201', name: 'Bayview Apartments, 201', area: 'Bayview', unlock: 'm25', note: 'Safehouses 2/4' },
  { id: 'marlowe-motel', name: 'Port Marlowe Motel', area: 'Port Marlowe', unlock: 'm23', note: 'Chapter 2 base' },
  { id: 'coral-strand', name: 'Coral Strand Safehouse', area: 'Coral Strand', unlock: 'm60', note: 'Chapter 4 base' },
];

export const GARAGES = [
  // 8 buyable
  { id: 'g1', name: 'Azura Bay Garage', area: 'Azura Bay', price: 25000, buyable: true },
  { id: 'g2', name: 'Coral Strand Garage', area: 'Coral Strand', price: 40000, buyable: true },
  { id: 'g3', name: 'Salsa Quarter Garage', area: 'Salsa Quarter', price: 18000, buyable: true },
  { id: 'g4', name: 'Port Marlowe Garage', area: 'Port Marlowe', price: 12000, buyable: true },
  { id: 'g5', name: 'Ambrosia Garage', area: 'Ambrosia', price: 15000, buyable: true },
  { id: 'g6', name: 'Foxglove Garage', area: 'Foxglove', price: 10000, buyable: true },
  { id: 'g7', name: 'Waverly Bay Garage', area: 'Waverly Bay', price: 14000, buyable: true },
  { id: 'g8', name: 'Silver Sands Garage', area: 'Silver Sands', price: 22000, buyable: true },
  // 4 free from story
  { id: 'g9', name: 'Keys Storage', area: 'Cayo Verde', price: 0, buyable: false, unlock: 'm11' },
  { id: 'g10', name: 'Reedmarsh Shed', area: 'Reedmarsh', price: 0, buyable: false, unlock: 'm17' },
  { id: 'g11', name: 'Millhaven Depot', area: 'Millhaven', price: 0, buyable: false, unlock: 'm62' },
  { id: 'g12', name: 'Azura Harbor Warehouse', area: 'Azura Harbor', price: 0, buyable: false, unlock: 'm79' },
  // 3 special-edition bonus garages
  { id: 'g13', name: 'Paradise Garage', area: 'Waverly Bay', price: 0, buyable: false, bonus: true, note: 'weapon locker + fence for stolen goods' },
  { id: 'g14', name: 'Coral Strand Penthouse Garage', area: 'Coral Strand', price: 0, buyable: false, bonus: true },
  { id: 'g15', name: 'Mount Corvina Lodge Garage', area: 'Mount Corvina', price: 0, buyable: false, bonus: true },
];

export const BUSINESSES = [
  { id: 'kingofclubs', name: 'King of Clubs', kind: 'nightclub', owner: 'Dante “Big D” Osei' },
  { id: 'clubnine', name: 'Club Nine', kind: 'nightclub' },
  { id: 'coralclub', name: 'The Coral Club', kind: 'nightclub' },
  { id: 'vault', name: 'The Vault Nightclub', kind: 'nightclub' },
  { id: 'rawdeal', name: 'Raw Deal Records', kind: 'studio', owner: "Malik “M-Que” Stanton" },
  { id: 'rideout', name: 'Rideout Customs', kind: 'mod shop', note: 'main Solmaris vehicle modification shop' },
  { id: 'sara', name: "Sara's Unisex Salon", kind: 'salon', note: 'hair, Cole beard, Mara makeup & nails' },
  { id: 'barnacle', name: 'Barnacle Beauties', kind: 'salon' },
  { id: 'kurts', name: "Kurt's Barber Shop", kind: 'barber' },
  { id: 'electricfang', name: 'Electric Fang Tattoo', kind: 'tattoo', note: '50+ designs' },
  { id: 'stock44', name: 'Stock 44', kind: 'clothing' },
  { id: 'goodtime', name: 'Goodtime Gear', kind: 'clothing', note: 'streetwear' },
  { id: 'ammunation', name: 'Ironhold Arms', kind: 'gun shop' },
  { id: 'stronghold', name: 'Stronghold Ammunition', kind: 'gun shop' },
  { id: 'pawnandgun', name: 'Pawn and Gun', kind: 'gun shop' },
  { id: 'unclejack', name: "Uncle Jack's Liquor", kind: 'liquor' },
  { id: 'tishawocka', name: 'Marisol Flea Market', kind: 'market' },
];

export function storedCarCount(storedCars) {
  return (storedCars || []).length;
}

export function buyableGarages() {
  return GARAGES.filter((g) => g.buyable);
}

export function bonusGarages() {
  return GARAGES.filter((g) => g.bonus);
}
