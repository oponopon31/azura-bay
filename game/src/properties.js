// AZURA BAY — properties (round 7 re-compose, written fresh under r7).
// SPEC.md Bab 9. Safehouses are NOT purchasable — they unlock via story.
// 12 garages (8 buy + 4 free) + 3 bonus = 15 total, incl. Paradise Garage
// (Watson Bay). Locations: Jack of Hearts, NINE1NINE, Malibu Club, Vault
// Nightclub, Only Raw Records, Rideout Customs, Sara's Unisex Salon,
// Barnacle Beauties, Kurt's Barber Shop, Electric Fang Tattoo (50+ designs),
// Stock 305, Goodtime Gear, Ammu-Nation, Stronghold Ammunition, Pawn and Gun,
// Uncle Jack's Liquor, Tisha-Wocka Flea Market.

export const SAFEHOUSES = [
  { id: "keys-trailer", name: "Leonida Keys Trailer", zone: "Leonida Keys", unlock: "Chapter 1", price: 0 },
  { id: "vice-apartment", name: "Vice City Apartment", zone: "Vice City", unlock: "Chapter 2", price: 0 },
  { id: "port-house", name: "Port Gellhorn House", zone: "Port Gellhorn", unlock: "Chapter 3", price: 0 },
  { id: "beach-house", name: "Vice Beach House", zone: "Vice Beach", unlock: "Chapter 4", price: 0 },
];

export const GARAGES = [
  { id: "paradise", name: "Paradise Garage", zone: "Watson Bay", price: 0, bonus: true, note: "Bonus garage" },
  { id: "keys-garage", name: "Keys Garage", zone: "Leonida Keys", price: 0, free: true },
  { id: "vice-garage", name: "Vice Garage", zone: "Vice City", price: 0, free: true },
  { id: "gellhorn-garage", name: "Gellhorn Garage", zone: "Port Gellhorn", price: 0, free: true },
  { id: "beach-garage", name: "Beach Garage", zone: "Vice Beach", price: 0, free: true },
  { id: "ambrosia-garage", name: "Ambrosia Garage", zone: "Ambrosia", price: 50000 },
  { id: "millport-garage", name: "Millport Garage", zone: "Millport", price: 75000 },
  { id: "salton-garage", name: "Salton Garage", zone: "Salton", price: 60000 },
  { id: "bayside-garage", name: "Bayside Garage", zone: "Bayside", price: 80000 },
  { id: "la-perle-garage", name: "La Perle Garage", zone: "La Perle", price: 90000 },
  { id: "capri-garage", name: "Capri Garage", zone: "Capri", price: 100000 },
  { id: "waning-garage", name: "Waning Sands Garage", zone: "Waning Sands", price: 70000 },
  { id: "emerald-garage", name: "Emerald Springs Garage", zone: "Emerald Springs", price: 85000 },
  { id: "grassrivers-garage", name: "Grassrivers Garage", zone: "Grassrivers", price: 0, bonus: true, note: "Bonus garage" },
  { id: "mount-garage", name: "Mount Kalaga Garage", zone: "Mount Kalaga", price: 0, bonus: true, note: "Bonus garage" },
];

export const LOCATIONS = [
  { id: "jack-hearts", name: "Jack of Hearts", kind: "nightclub", zone: "Vice City" },
  { id: "nine1nine", name: "NINE1NINE", kind: "nightclub", zone: "Vice City" },
  { id: "malibu", name: "Malibu Club", kind: "nightclub", zone: "Vice Beach" },
  { id: "vault", name: "Vault Nightclub", kind: "nightclub", zone: "Vice City" },
  { id: "only-raw", name: "Only Raw Records", kind: "studio", zone: "Vice City" },
  { id: "rideout", name: "Rideout Customs", kind: "garage", zone: "Vice City" },
  { id: "sara-salon", name: "Sara's Unisex Salon", kind: "salon", zone: "Vice City" },
  { id: "barnacle", name: "Barnacle Beauties", kind: "salon", zone: "Vice Beach" },
  { id: "kurt-barber", name: "Kurt's Barber Shop", kind: "barber", zone: "Vice City" },
  { id: "electric-fang", name: "Electric Fang Tattoo", kind: "tattoo", zone: "Vice City", note: "50+ designs" },
  { id: "stock305", name: "Stock 305", kind: "clothing", zone: "Vice City" },
  { id: "goodtime", name: "Goodtime Gear", kind: "clothing", zone: "Vice Beach" },
  { id: "ammunation", name: "Ammu-Nation", kind: "gunshop", zone: "Vice City" },
  { id: "stronghold", name: "Stronghold Ammunition", kind: "gunshop", zone: "Port Gellhorn" },
  { id: "pawn-gun", name: "Pawn and Gun", kind: "gunshop", zone: "Vice City" },
  { id: "uncle-jack", name: "Uncle Jack's Liquor", kind: "liquor", zone: "Leonida Keys" },
  { id: "tisha-wocka", name: "Tisha-Wocka Flea Market", kind: "market", zone: "Vice City" },
];

export function totalSafehouses() { return SAFEHOUSES.length; }
export function totalGarages() { return GARAGES.length; }
export function buyableGarages() { return GARAGES.filter((g) => g.price > 0); }
export function freeGarages() { return GARAGES.filter((g) => g.price === 0); }
export function bonusGarages() { return GARAGES.filter((g) => g.bonus); }
export function safehouseById(id) { return SAFEHOUSES.find((s) => s.id === id) || null; }
export function garageById(id) { return GARAGES.find((g) => g.id === id) || null; }
export function locationById(id) { return LOCATIONS.find((l) => l.id === id) || null; }
export function totalLocations() { return LOCATIONS.length; }
