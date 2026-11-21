// AZURA BAY — gun shops (round 7 re-compose, written fresh under r7).
// SPEC.md Bab 21. 24 shops. 6 Expanded (bigger stock, rare weapons).
// Ammu-Nation, Stronghold Ammunition, Pawn and Gun are the main chains.

export const GUN_SHOPS = [
  { id: "ammu-vc", name: "Ammu-Nation Vice City", zone: "Vice City", expanded: true },
  { id: "ammu-beach", name: "Ammu-Nation Vice Beach", zone: "Vice Beach", expanded: true },
  { id: "ammu-keys", name: "Ammu-Nation Leonida Keys", zone: "Leonida Keys", expanded: false },
  { id: "ammu-gellhorn", name: "Ammu-Nation Port Gellhorn", zone: "Port Gellhorn", expanded: true },
  { id: "ammu-ambrosia", name: "Ammu-Nation Ambrosia", zone: "Ambrosia", expanded: false },
  { id: "ammu-waning", name: "Ammu-Nation Waning Sands", zone: "Waning Sands", expanded: false },
  { id: "stronghold-vc", name: "Stronghold Ammunition Vice City", zone: "Vice City", expanded: true },
  { id: "stronghold-gellhorn", name: "Stronghold Ammunition Port Gellhorn", zone: "Port Gellhorn", expanded: true },
  { id: "stronghold-keys", name: "Stronghold Ammunition Leonida Keys", zone: "Leonida Keys", expanded: false },
  { id: "pawn-vc", name: "Pawn and Gun Vice City", zone: "Vice City", expanded: true },
  { id: "pawn-beach", name: "Pawn and Gun Vice Beach", zone: "Vice Beach", expanded: false },
  { id: "pawn-gellhorn", name: "Pawn and Gun Port Gellhorn", zone: "Port Gellhorn", expanded: false },
  { id: "phil-ammu", name: "Phil's Ammu-Nation", zone: "Vice City", expanded: false, note: "Phil Cassidy's shop" },
  { id: "gun-vc-2", name: "Vice City Gun Store", zone: "Vice City", expanded: false },
  { id: "gun-vc-3", name: "Downtown Arms", zone: "Vice City", expanded: false },
  { id: "gun-beach-2", name: "Beach Arms", zone: "Vice Beach", expanded: false },
  { id: "gun-keys-2", name: "Keys Arms", zone: "Leonida Keys", expanded: false },
  { id: "gun-gellhorn-2", name: "Gellhorn Arms", zone: "Port Gellhorn", expanded: false },
  { id: "gun-ambrosia-2", name: "Ambrosia Arms", zone: "Ambrosia", expanded: false },
  { id: "gun-millport", name: "Millport Arms", zone: "Millport", expanded: false },
  { id: "gun-salton", name: "Salton Arms", zone: "Salton", expanded: false },
  { id: "gun-bayside", name: "Bayside Arms", zone: "Bayside", expanded: false },
  { id: "gun-capri", name: "Capri Arms", zone: "Capri", expanded: false },
  { id: "gun-watson", name: "Watson Bay Arms", zone: "Watson Bay", expanded: false },
];

export function totalGunShops() { return GUN_SHOPS.length; }
export function expandedCount() { return GUN_SHOPS.filter((s) => s.expanded).length; }
export function expandedShops() { return GUN_SHOPS.filter((s) => s.expanded); }
export function shopById(id) { return GUN_SHOPS.find((s) => s.id === id) || null; }
export function shopsByZone(zone) { return GUN_SHOPS.filter((s) => s.zone === zone); }
// Expanded shops stock rare weapons; normal shops stock standard weapons.
export function stockFor(shop) {
  return shop.expanded ? "standard + rare" : "standard";
}
