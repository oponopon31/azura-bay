// shots.js — Screenshot poses for the dossier (round 10).
// 5 poses in shots.json; the 4 submitted screenshots are cover / shootout /
// dusk / heist (dossier cap is 4). The 5th pose, night, is a midnight meet
// at the Coral Drive nightclub, 21:30, 1 star.
// Round 10: the 'dusk' slot is now the steal-car shot (First Impressions —
// steal the Aurelion Zephyr off Coral Drive at dusk); the heist moved to
// night (21:30) so the set has real time-of-day variety.
export const SHOTS = [
  { id: 'cover', name: 'Cover', scene: 'Mara & Cole in a police pursuit on Coral Drive at sunset, Azura Bay skyline', hour: 18.5, stars: 3 },
  { id: 'shootout', name: 'Shootout', scene: 'Street shootout outside Ironhold Arms, police responding', hour: 14, stars: 3 },
  { id: 'dusk', name: 'Steal', scene: 'Steal the Aurelion Zephyr off Coral Drive — First Impressions', hour: 18.5, stars: 0 },
  { id: 'heist', name: 'Heist', scene: 'Azura Harbor Bank vault at night, bags of marked bills', hour: 21.5, stars: 4 },
  { id: 'night', name: 'Night', scene: 'Midnight meet at the Coral Drive nightclub', hour: 21.5, stars: 1 },
];

// The 4 screenshots actually submitted (dossier cap).
export const SUBMITTED_SHOTS = ['cover', 'shootout', 'dusk', 'heist'];

export function shotById(id) {
  return SHOTS.find((s) => s.id === id) || null;
}
