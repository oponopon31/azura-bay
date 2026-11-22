// Azura Bay — re-authored under recording r21
// stunts.js — Stunts (397) & free-roam robberies, SPEC §6.
// Stunt Jumps 130, Under the Bridges 202, Knife Flights 40, Base Jumps 25 = 397.
// Robberies: 72 convenience stores, 23 fast food, 22 bank jobs (14 small banks
// + 8 big vaults), 20 jewelry stores, 15 pawn shops, 14 liquor stores,
// 7 payday loans. NOTE: the spec labels the robbery total "175" but the
// breakdown sums to 173 (72+23+22+20+15+14+7) — the user's arithmetic;
// the code implements the breakdown (173) honestly.
export const STUNT_KINDS = [
  { id: 'jump', name: 'Stunt Jumps', total: 130 },
  { id: 'bridge', name: 'Under the Bridges', total: 202 },
  { id: 'knife', name: 'Knife Flights', total: 40 },
  { id: 'base', name: 'Base Jumps', total: 25 },
];

export const ROBBERY_KINDS = [
  { id: 'convenience', name: 'Convenience Stores', total: 72 },
  { id: 'fastfood', name: 'Fast Food Joints', total: 23 },
  { id: 'bank', name: 'Bank Jobs', total: 22, detail: '14 small banks + 8 big bank vaults' },
  { id: 'jewelry', name: 'Jewelry Stores', total: 20 },
  { id: 'pawn', name: 'Pawn Shops', total: 15 },
  { id: 'liquor', name: 'Liquor Stores', total: 14 },
  { id: 'payday', name: 'Payday Loans', total: 7 },
];

// Free-roam robbery rules (SPEC §19): always bring your partner (Cole +
// Mara together). Alone with more than 2 guards, guards shoot without
// warning. Disarm the guards first before threatening civilians.
export const ROBBERY_RULES = {
  bringPartner: true,
  guardsShootAloneAbove: 2,
  disarmGuardsFirst: true,
};

export function stuntCountByKind(kind) {
  const k = STUNT_KINDS.find((s) => s.id === kind);
  return k ? k.total : 0;
}

export function totalStunts() {
  return STUNT_KINDS.reduce((n, s) => n + s.total, 0);
}

export function totalRobberies() {
  return ROBBERY_KINDS.reduce((n, r) => n + r.total, 0);
}
