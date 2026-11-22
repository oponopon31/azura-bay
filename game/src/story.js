// story.js — Chapters, endings and Criminal Profile, SPEC §1, §11.
// Endings are NOT picked from a menu: they emerge organically from 4 factors —
// (1) BuckMe family savings, (2) Cole–Mara relationship, (3) Criminal Profile,
// (4) choices in earlier missions. Good Ending 1 reads BuckMe SAVINGS
// (>= $40,000), never wallet cash (cash is capped at $20,000).

export const CHAPTERS = [
  { n: 1, name: 'Keys, Cages and Currents', missions: 22, area: 'Solmaris Keys', blurb: 'Mara in prison; Cole\'s early action.' },
  { n: 2, name: 'Cold Water', missions: 11, area: 'Port Marlowe', blurb: 'Mara free with an ankle monitor; building a life with Cole.' },
  { n: 3, name: 'Neon and Fast Money', missions: 26, area: 'Azura Bay', blurb: 'Cole + Mara operating together — steal luxury cars, rob banks, rob cartels.' },
  { n: 4, name: 'Azura Bay, Baby', missions: 25, area: 'Coral Strand', blurb: 'Their own business around Coral Strand; legal trouble and authority surveillance.' },
  { n: 5, name: 'The Last Run', missions: 7, area: 'Solmaris', blurb: 'Endgame / climax.' },
];

export function chapterReward(chapter) {
  // Reward paid on completing a chapter (clean money to BuckMe).
  return [0, 5000, 8000, 20000, 35000, 50000][chapter] || 0;
}

// Criminal Profile (Bab 11): 5 levels. Psycho becomes PERMANENT if the logo
// shatters; Irredeemable is the highest permanent criminal status, above Psycho.
export const PROFILES = [
  { level: 1, name: 'Professional', desc: 'Incapacitate without killing; tidy, minimal civilian casualties.' },
  { level: 2, name: 'Hardened', desc: 'Standard and brutal combat against enemies.' },
  { level: 3, name: 'Violent & Dangerous', desc: 'Often shoots indiscriminately and hurts civilians.' },
  { level: 4, name: 'Psycho', desc: 'Extreme chaos — if the logo shatters, PERMANENT, cannot be restored.' },
  { level: 5, name: 'Irredeemable', desc: 'Highest permanent criminal status, above Psycho. Breaking point is the last warning before Irredeemable.' },
];

export function profileByLevel(level) {
  return PROFILES[Math.max(1, Math.min(5, level)) - 1];
}

// Profile from a chaos score (0-100): kills of civilians, wanton destruction.
export function profileFromChaos(chaos) {
  if (chaos >= 95) return PROFILES[4];
  if (chaos >= 75) return PROFILES[3];
  if (chaos >= 45) return PROFILES[2];
  if (chaos >= 15) return PROFILES[1];
  return PROFILES[0];
}

// Breaking point: the last warning before Irredeemable.
export function breakingPoint(chaos) {
  return chaos >= 90 && chaos < 95;
}

// The 4 organic endings (Bab 11).
export const ENDINGS = [
  { id: 'good1', name: 'Good Ending 1', desc: 'Both survive and escape the police pursuit together.', condition: 'BuckMe savings >= $40,000 and relationship strong' },
  { id: 'good2', name: 'Good Ending 2 — Swim For It (Unarmed)', desc: 'One sacrifices themselves to prison (Cole jailed, Mara free, new life).', condition: 'Swim For It chosen unarmed' },
  { id: 'bad1', name: 'Bad Ending 1 — Swim For It (Armed)', desc: 'Escape fails; both are shot on the bridge.', condition: 'Swim For It chosen armed' },
  { id: 'bad2', name: 'Bad Ending 2 — No Surrender', desc: 'Bonnie & Clyde style — die in a crash / shootout.', condition: 'No Surrender chosen' },
];

// Decide the ending from the 4 organic factors. savings = BuckMe clean savings.
export function decideEnding({ savings, relationship, profileLevel, swimArmed, noSurrender }) {
  if (noSurrender) return ENDINGS[3];
  if (swimArmed === true) return ENDINGS[2];
  if (swimArmed === false) return ENDINGS[1];
  if (savings >= 40000 && relationship >= 55 && profileLevel <= 3) return ENDINGS[0];
  if (savings >= 40000 && relationship >= 55) return ENDINGS[0];
  return ENDINGS[1];
}

// After the credits, time rewinds to just before the final mission — free
// roam or replay the last mission to chase another ending.
export const POST_GAME_REWIND = 'Rewind to before the final mission; free roam or replay for another ending.';
