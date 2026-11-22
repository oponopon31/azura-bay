// city.js — Azura Bay districts & day/night, SPEC §28 + MAP-DATA.md.
// Building map colours: light blue = decoration outside only;
// DARK BLUE = has an enterable interior.
// District labels: La Perle, Bayview, Salton, Southside,
// Balsero, Decor District are Azura Bay district labels; Millhaven is a town;
// Emerald Springs has 5 named places and no map label.
export const DISTRICTS = [
  { name: 'Coral Strand', kind: 'beach', note: 'pastel art-deco hotels, white sand' },
  { name: 'Coral Drive', kind: 'beach', note: 'neon nightlife strip' },
  { name: 'Marlin Bay', kind: 'beach', note: 'beachfront district' },
  { name: 'Downtown', kind: 'downtown', note: 'glass towers' },
  { name: 'Salsa Quarter', kind: 'district', note: 'panaderías, Cuban shops' },
  { name: 'Creole Quarter', kind: 'district', note: 'Haitian district' },
  { name: 'Stockyard', kind: 'district', note: 'art / mural district' },
  { name: 'Crosstown', kind: 'district', note: 'Azura Bay district' },
  { name: 'La Perle', kind: 'district', note: 'district label (18 search results)' },
  { name: 'Bayview', kind: 'district', note: 'district label (12 results); safehouse 201 here' },
  { name: 'Salton', kind: 'district', note: 'district label (30 results)' },
  { name: 'Southside', kind: 'district', note: 'district label (17 results)' },
  { name: 'Balsero', kind: 'district', note: 'district label (12 results)' },
  { name: 'Decor District', kind: 'district', note: 'district label (8 results)' },
  { name: 'Coral Isles', kind: 'islands', note: 'island chain in the bay' },
  { name: 'Palm Links', kind: 'place', note: 'golf area' },
];

export const BUILDING_COLORS = {
  lightBlue: 'decoration outside only',
  darkBlue: 'has an enterable interior',
};

// Night is 20:00–06:00; dusk is 17:30–20:00 (drives the city lights).
export function isNightAt(hour) {
  return hour >= 20 || hour < 6;
}

export function isDuskAt(hour) {
  return hour >= 17.5 && hour < 20;
}

// City lights turn on at dusk.
export function lightsOn(hour) {
  return isNightAt(hour) || isDuskAt(hour);
}
