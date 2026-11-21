// AZURA BAY — Wanted & Heat (round 7 re-compose, written fresh under r7).
// SPEC.md Bab 12. Police remember face / clothes / plate / weapon / duo.
// Star states: hollow (reported, not yet known), white (seen directly),
// blink (lost sight), red (sweeping radius), 6 stars (all-Leonida manhunt).
// Escape: destroy CCTV, change clothes (car trunk), mask/hat, split the duo,
// change car / Pay 'n' Spray / call Joey, loot police trunks (armor + shotgun/AR).

export const STAR_STATES = ["none", "hollow", "white", "blink", "red", "manhunt"];
export const MAX_STARS = 6;

export function newPolice() {
  return { stars: 0, state: "none", heat: 0, radius: 0, helicopter: false, clueChips: [] };
}

// Add wanted level. Returns the new state.
export function addWanted(police, stars) {
  police.stars = Math.min(MAX_STARS, police.stars + stars);
  police.heat = Math.min(100, police.heat + stars * 15);
  updateState(police);
  return police;
}
export function updateState(police) {
  if (police.stars === 0) police.state = "none";
  else if (police.stars >= 6) police.state = "manhunt";
  else if (police.heat >= 70) police.state = "red";
  else if (police.heat >= 40) police.state = "blink";
  else if (police.heat >= 15) police.state = "white";
  else police.state = "hollow";
  police.helicopter = police.stars >= 3;
  police.radius = police.stars * 150;
  return police;
}
// Heat decays over time when the player is out of sight.
export function decayHeat(police, seconds) {
  police.heat = Math.max(0, police.heat - seconds * 0.5);
  if (police.heat === 0 && police.stars > 0) {
    police.stars = 0;
  }
  updateState(police);
  return police;
}
// Surrender at 1-2 stars (hands up, go to jail, lose a little cash).
export function canSurrender(police) { return police.stars >= 1 && police.stars <= 2; }
export function surrender(police) {
  if (!canSurrender(police)) return { ok: false };
  police.stars = 0;
  police.heat = 0;
  police.state = "none";
  police.helicopter = false;
  return { ok: true, jailed: true };
}
// Escape actions reduce heat.
export function escapeAction(police, action) {
  const reductions = {
    "destroy-cctv": 20, "change-clothes": 25, "mask": 15, "split-duo": 20,
    "change-car": 20, "pay-n-spray": 40, "call-joey": 30, "hide": 10,
  };
  const red = reductions[action] || 0;
  police.heat = Math.max(0, police.heat - red);
  if (police.heat === 0) police.stars = 0;
  updateState(police);
  return police;
}
export function addClueChip(police, chip) {
  // chip: CCTV, FACE, CLOTHES, VEHICLE
  if (!police.clueChips.includes(chip)) police.clueChips.push(chip);
  return police;
}
export function clearClueChips(police) { police.clueChips = []; return police; }
export function isWanted(police) { return police.stars > 0; }
