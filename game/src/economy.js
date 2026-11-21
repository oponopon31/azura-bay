// AZURA BAY — economy (round 7 re-compose, written fresh under r7).
// SPEC.md Bab 11 + 25. Three money types:
//   cash   — wallet, capped at $20,000 (WALLET_MAX). Excess sweeps to BuckMe.
//   buckme — joint savings, uncapped. Decides Ending Good 1 (>= $40,000).
//   bank   — clean money for legal purchases.
// Fences buy stolen goods: Tyrone, Yasmani, Moses, Randy.

export const WALLET_MAX = 20000;
export const BUCKME_GOOD1_MIN = 40000;

export function newEconomy() {
  return { cash: 500, buckme: 0, bank: 1000, fences: {} };
}

// Sweep wallet excess into BuckMe (SPEC Bab 11). Returns amount swept.
export function enforceWalletCap(econ) {
  if (econ.cash <= WALLET_MAX) return 0;
  const excess = econ.cash - WALLET_MAX;
  econ.cash = WALLET_MAX;
  econ.buckme += excess;
  return excess;
}

export function addCash(econ, amount) {
  econ.cash += amount;
  return enforceWalletCap(econ);
}
export function addBuckMe(econ, amount) { econ.buckme += amount; return amount; }
export function addBank(econ, amount) { econ.bank += amount; return amount; }
export function spendCash(econ, amount) {
  if (econ.cash < amount) return false;
  econ.cash -= amount;
  return true;
}
export function spendBuckMe(econ, amount) {
  if (econ.buckme < amount) return false;
  econ.buckme -= amount;
  return true;
}
export function spendBank(econ, amount) {
  if (econ.bank < amount) return false;
  econ.bank -= amount;
  return true;
}

// Fences: sell stolen goods for cash (laundered into the wallet, then capped).
export const FENCES = [
  { id: "tyrone", name: "Tyrone", zone: "Vice City", rate: 0.6, desc: "Buys stolen electronics and jewelry." },
  { id: "yasmani", name: "Yasmani", zone: "Vice City", rate: 0.65, desc: "Jewelry fence." },
  { id: "moses", name: "Moses", zone: "Port Gellhorn", rate: 0.55, desc: "Buys stolen cars and parts." },
  { id: "randy", name: "Randy", zone: "Vice City", rate: 0.5, desc: "Buys anything, no questions." },
];

export function fenceById(id) { return FENCES.find((f) => f.id === id) || null; }
export function sellToFence(econ, fenceId, value) {
  const fence = fenceById(fenceId);
  if (!fence) return 0;
  const paid = Math.floor(value * fence.rate);
  addCash(econ, paid);
  return paid;
}

// Mission reward: cash into the wallet (capped, excess to BuckMe),
// clean money into BuckMe.
export function missionReward(econ, cashAmount, cleanAmount) {
  const swept = addCash(econ, cashAmount);
  if (cleanAmount > 0) addBuckMe(econ, cleanAmount);
  return { swept, cash: econ.cash, buckme: econ.buckme };
}
