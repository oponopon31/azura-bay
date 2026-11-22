// police.js — Wanted & Heat system, SPEC §12.
// Heat = police memory: they remember face, outfit, plate, weapon and whether
// Cole & Mara acted as a duo. Even after the stars fade, police can recognise
// you again if you wear the same clothes / drive the same car.
// Star states: Hollow (reported by a witness, suspect unknown — walk past
// police unnoticed), White Solid (seen directly), White Blinking (out of
// police sight), Red (police lost your exact location, sweeping the area),
// 6 Stars (total manhunt across all of Solmaris).
export const STAR_STATES = [
  { stars: 0, name: 'Clear', desc: 'No wanted level.' },
  { stars: 1, name: 'Hollow', desc: 'Crime reported by a witness; suspect unknown — walk past police unnoticed.' },
  { stars: 2, name: 'White Solid', desc: 'Police saw you directly.' },
  { stars: 3, name: 'White Blinking', desc: 'Out of police sight.' },
  { stars: 4, name: 'Red', desc: 'Police lost your exact location; sweeping the area of the incident.' },
  { stars: 5, name: 'Red', desc: 'Police lost your exact location; sweeping a wider radius.' },
  { stars: 6, name: 'Six Stars', desc: 'Total manhunt across all of Solmaris.' },
];

// What the police remember about you (Heat). Each clue can be cleared.
export function freshMemory() {
  return { face: false, outfit: false, vehicle: false, weapon: false, duo: false, cctv: false };
}

// Escape methods (SPEC §12).
export const ESCAPE_METHODS = [
  'Destroy CCTV footage at the robbery location before police arrive',
  'Change clothes (via personal car trunk)',
  'Mask / hat',
  'Split Cole & Mara up',
  'Change car, repaint at Quick Spray, or call Joey for a clean personal car',
  'Loot police car trunks (Body Armor + Shotgun / Assault Rifle)',
];

// Heat per star: how much police attention each wanted star adds.
export function heatPerStar(stars) {
  return Math.min(6, Math.max(0, stars)) * 20;
}

// Police hit chance at a distance (used directly by police shooting code).
// Closer + higher wanted = more accurate.
export function hitChanceAt(distance, stars) {
  const base = 0.55 - distance / 400 + stars * 0.04;
  return Math.max(0.05, Math.min(0.9, base));
}

// Surrender (Bab 21): at 1–2 stars police give a verbal order first instead
// of shooting immediately; the player can surrender.
export function canSurrender(stars) {
  return stars >= 1 && stars <= 2;
}
