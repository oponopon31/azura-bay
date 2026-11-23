// shots.js — Screenshot poses for the dossier (round 12).
// 5 poses in shots.json; the 4 submitted screenshots are cover / shootout /
// dusk / heist (dossier cap is 4). The 5th pose, night, is a midnight meet
// at the Coral Drive nightclub, 21:30, 1 star.
// Round 12 re-stage: cover is a 16:30 golden-hour beachfront drive (blue
// sky, low warm sun, ocean + palms); shootout is the busy market plaza at
// 14:00; dusk is the gold Zephyr steal at 17:30 golden hour; heist stays
// night (21:30) with neon + streetlights so it reads after dark.
export const SHOTS = [
  { id: 'cover', name: 'Cover', scene: 'Mara & Cole in a police pursuit on Coral Drive at golden hour, beach and ocean beside the chase', hour: 16.5, stars: 3 },
  { id: 'shootout', name: 'Shootout', scene: 'Street shootout in the busy market plaza, stalls and crowds, police responding', hour: 14, stars: 3 },
  { id: 'dusk', name: 'Steal', scene: 'Steal the Aurelion Zephyr off Coral Drive at golden hour — First Impressions', hour: 17.5, stars: 0 },
  { id: 'heist', name: 'Heist', scene: 'Azura Harbor Bank vault at night, neon and streetlights, bags of marked bills', hour: 21.5, stars: 4 },
  { id: 'night', name: 'Night', scene: 'Midnight meet at the Coral Drive nightclub', hour: 21.5, stars: 1 },
];

// The 4 screenshots actually submitted (dossier cap).
export const SUBMITTED_SHOTS = ['cover', 'shootout', 'dusk', 'heist'];

export function shotById(id) {
  return SHOTS.find((s) => s.id === id) || null;
}
