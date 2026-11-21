// AZURA BAY — activities & challenges (round 7 re-compose, fresh under r7).
// SPEC.md Bab 19–20. Mini-games: basketball, fishing, golf, darts, pool,
// bowling, arcade, gym, yoga, meditation, kayaking, cycling, swimming,
// shooting range, races, stunt jumps. 32 challenges (Survival, Fitness,
// Combat, Driving, Collection). Medal points: bronze 1, silver 2, gold 3.

export const MINI_GAMES = [
  "basketball", "fishing", "golf", "darts", "pool", "bowling", "arcade",
  "gym", "yoga", "meditation", "kayaking", "cycling", "swimming",
  "shooting-range", "races", "stunt-jumps",
];

export const CHALLENGES = [
  { id: "surv-1", name: "Survive 1 minute at 5 stars", kind: "survival", medal: "bronze" },
  { id: "surv-2", name: "Survive 5 minutes at 5 stars", kind: "survival", medal: "silver" },
  { id: "surv-3", name: "Survive 10 minutes at 5 stars", kind: "survival", medal: "gold" },
  { id: "surv-4", name: "Escape a 6-star manhunt", kind: "survival", medal: "gold" },
  { id: "surv-5", name: "Survive a plane crash", kind: "survival", medal: "silver" },
  { id: "fit-1", name: "Run 10 km", kind: "fitness", medal: "bronze" },
  { id: "fit-2", name: "Swim 5 km", kind: "fitness", medal: "silver" },
  { id: "fit-3", name: "Cycle 20 km", kind: "fitness", medal: "silver" },
  { id: "fit-4", name: "Kayak 10 km", kind: "fitness", medal: "silver" },
  { id: "fit-5", name: "100x Workout", kind: "fitness", medal: "gold" },
  { id: "combat-1", name: "100 headshots", kind: "combat", medal: "bronze" },
  { id: "combat-2", name: "500 headshots", kind: "combat", medal: "silver" },
  { id: "combat-3", name: "1000 headshots", kind: "combat", medal: "gold" },
  { id: "combat-4", name: "Win 10 combat challenges", kind: "combat", medal: "silver" },
  { id: "combat-5", name: "Win 20 combat challenges", kind: "combat", medal: "gold" },
  { id: "drive-1", name: "Win 10 races", kind: "driving", medal: "bronze" },
  { id: "drive-2", name: "Win 20 races", kind: "driving", medal: "silver" },
  { id: "drive-3", name: "Win 50 races", kind: "driving", medal: "gold" },
  { id: "drive-4", name: "Drive 1000 km", kind: "driving", medal: "silver" },
  { id: "drive-5", name: "Drive 5000 km", kind: "driving", medal: "gold" },
  { id: "coll-1", name: "Find 100 collectibles", kind: "collection", medal: "bronze" },
  { id: "coll-2", name: "Find 500 collectibles", kind: "collection", medal: "silver" },
  { id: "coll-3", name: "Find 1000 collectibles", kind: "collection", medal: "gold" },
  { id: "coll-4", name: "Complete all card sets", kind: "collection", medal: "gold" },
  { id: "coll-5", name: "Find all 34 Luxury Watches", kind: "collection", medal: "gold" },
  { id: "spec-1", name: "Photograph all 170 wildlife species", kind: "collection", medal: "gold" },
  { id: "spec-2", name: "Catch all 35 fish", kind: "collection", medal: "gold" },
  { id: "spec-3", name: "Complete all 397 stunts", kind: "driving", medal: "gold" },
  { id: "spec-4", name: "Complete all 13 Strangers & Freaks", kind: "collection", medal: "gold" },
  { id: "spec-5", name: "Reach Focus level 5", kind: "fitness", medal: "gold" },
  { id: "spec-6", name: "Reach Strength level 5", kind: "fitness", medal: "gold" },
  { id: "spec-7", name: "Reach Cardio level 5", kind: "fitness", medal: "gold" },
];

export const MEDAL_POINTS = { bronze: 1, silver: 2, gold: 3 };

export function totalChallenges() { return CHALLENGES.length; }
export function challengeById(id) { return CHALLENGES.find((c) => c.id === id) || null; }
export function challengesByKind(kind) { return CHALLENGES.filter((c) => c.kind === kind); }
export function medalPoints(medal) { return MEDAL_POINTS[medal] || 0; }
export function totalMedalPoints(doneIds) {
  return doneIds.reduce((s, id) => {
    const c = challengeById(id);
    return s + (c ? medalPoints(c.medal) : 0);
  }, 0);
}
export function totalMiniGames() { return MINI_GAMES.length; }
