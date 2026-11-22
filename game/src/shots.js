// shots.js — Screenshot poses for the dossier (round 7).
// 5 poses in shots.json; the 4 submitted screenshots are cover / shootout /
// dusk / heist (dossier cap is 4). The 5th pose, night, is a midnight meet
// at the Coral Drive nightclub, 21:30, 1 star.
export const SHOTS = [
  { id: 'cover', name: 'Cover', scene: 'Mara & Cole in a police pursuit on Coral Drive at sunset, Azura Bay skyline', hour: 18.5, stars: 3 },
  { id: 'shootout', name: 'Shootout', scene: 'Street shootout outside Ammu-Nation, police responding', hour: 14, stars: 3 },
  { id: 'dusk', name: 'Dusk', scene: 'Coral Strand at dusk, neon signs lighting up', hour: 18.5, stars: 0 },
  { id: 'heist', name: 'Heist', scene: 'Azura Harbor Bank vault, bags of marked bills', hour: 11, stars: 4 },
  { id: 'night', name: 'Night', scene: 'Midnight meet at the Coral Drive nightclub', hour: 21.5, stars: 1 },
];

// The 4 screenshots actually submitted (dossier cap).
export const SUBMITTED_SHOTS = ['cover', 'shootout', 'dusk', 'heist'];

export function shotById(id) {
  return SHOTS.find((s) => s.id === id) || null;
}
