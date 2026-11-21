// economy.js — Economy: 3 money types & fences, SPEC §17 + §23.
// 1) Clean money / bank balance (spent directly, goes to BuckMe savings).
// 2) Marked Bills (bank / armoured-truck robbery proceeds — must be laundered
//    / exchanged through a fence first).
// 3) Stolen Goods (drugs, jewellery, luxury watches, stolen cars).
// Some main-story missions need a minimum bank balance before they unlock.
// Wallet cap $20,000 (Bab 23): excess is NOT pocketed — it sweeps to BuckMe.
import { WALLET_MAX } from './config.js';

export const MONEY_TYPES = [
  { id: 'clean', name: 'Clean Money', desc: 'Bank balance; spent directly, feeds BuckMe savings.' },
  { id: 'marked', name: 'Marked Bills', desc: 'Bank / armoured-truck robbery proceeds; launder via a fence first.' },
  { id: 'goods', name: 'Stolen Goods', desc: 'Drugs, jewellery, luxury watches, stolen cars.' },
];

// Specialist fences (SPEC §17).
export const FENCES = [
  { id: 'tyrone', name: 'Tyrone', specialty: 'drugs', note: 'highest payout for drugs' },
  { id: 'yasmani', name: 'Yasmani', specialty: 'jewellery & marked bills', note: 'also unlocks armoured-truck & big-vault robbery missions' },
  { id: 'moses', name: 'Moses', specialty: 'standard stolen cars, no tracker', note: 'Chapter 2, $1,000+ per car' },
  { id: 'paynspray', name: "Pay 'n' Spray", specialty: 'tracked standard stolen cars', note: 'early Chapter 3, $4,000+ per car' },
  { id: 'randy', name: 'Randy', specialty: 'special-order supercars, mint condition', note: '$30,000+ per car' },
];

// Minimum bank balance required to open certain story missions.
export const MISSION_MIN_BALANCE = {
  m34: 5000,
  m50: 15000,
  m59: 25000,
  m82: 40000,
  m89: 50000,
};

// Sweep wallet excess to BuckMe (called after mission rewards, fence sales
// and any cash gain). Returns the new { cash, buckme }.
export function enforceWalletCap(cash, buckme) {
  if (cash > WALLET_MAX) {
    const excess = cash - WALLET_MAX;
    return { cash: WALLET_MAX, buckme: buckme + excess, swept: excess };
  }
  return { cash, buckme, swept: 0 };
}

// Total wealth across clean cash + BuckMe savings + marked bills (at face
// value) — used by the HUD and the ending check.
export function totalWealth(state) {
  const s = state || {};
  return (s.cash || 0) + (s.buckme || 0) + (s.marked || 0);
}

// Launder marked bills through a fence (Yasmani takes a cut).
export function launderMarked(marked, fenceId) {
  const fence = FENCES.find((f) => f.id === fenceId);
  if (!fence) return { clean: 0, kept: marked };
  const rate = fenceId === 'yasmani' ? 0.85 : 0.7;
  return { clean: Math.floor(marked * rate), kept: 0, fence: fence.name };
}
