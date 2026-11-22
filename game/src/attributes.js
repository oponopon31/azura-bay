// Azura Bay — re-authored under recording r21
// attributes.js — Character stats (Cole & Mara), SPEC §10.
// 3 attributes, 4 standard levels each, Level 5 max in late-game once the
// story level cap opens.
export const ATTRIBUTES = [
  {
    id: 'strength', name: 'Strength / Health', icon: 'heart', iconColor: 'pink',
    desc: 'Permanent max health + melee power.',
    train: 'Gym (bench press, squat, deadlift, chest fly, pull-up). Finish sessions fully; protein shake in the safehouse fridge / protein bar at the gym; sleep.',
  },
  {
    id: 'cardio', name: 'Cardio / Stamina', icon: 'lightning', iconColor: 'lime',
    desc: 'Sprint, swim, dive and fight duration.',
    train: 'Treadmill, stationary bike, punching bag (safehouse lower floor); long runs, swimming, cycling, kayaking.',
  },
  {
    id: 'focus', name: 'Focus', icon: 'eye', iconColor: 'purple',
    desc: 'Special Ability duration (slow-motion combat & driving).',
    train: 'Basketball, fishing, meditation at meditation spots; headshots (Violent/Psycho profile) or non-lethal takedowns (Professional/Hardened profile); random acts of kindness (e.g. help a fallen drunk NPC).',
  },
];

export const MAX_LEVEL = 5;
export const STANDARD_LEVELS = 4;

// XP needed per level (level 5 needs the late-game cap to open).
export const LEVEL_XP = [0, 100, 250, 500, 900];

export function levelFromXp(xp) {
  let level = 1;
  for (let i = 0; i < LEVEL_XP.length; i++) {
    if (xp >= LEVEL_XP[i]) level = i + 1;
  }
  return Math.min(level, MAX_LEVEL);
}

// Summary of both protagonists' attributes for the HUD / save screen.
export function summary(stats) {
  const out = {};
  for (const a of ATTRIBUTES) {
    const s = (stats && stats[a.id]) || { xp: 0 };
    out[a.id] = { level: levelFromXp(s.xp), xp: s.xp };
  }
  return out;
}
