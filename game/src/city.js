// city.js — Vice City districts & day/night, SPEC §28 + MAP-DATA.md.
// Building map colours: light blue = decoration outside only;
// DARK BLUE = has an enterable interior.
// District labels (verified on gtabase): La Perle, Bayside, Salton, Southside,
// Balsero, Decor District are Vice City district labels; Millport is a town;
// Emerald Springs has 5 named places and no map label.
export const DISTRICTS = [
  { name: 'Ocean Beach', kind: 'beach', note: 'pastel art-deco hotels, white sand' },
  { name: 'South Beach', kind: 'beach', note: 'neon nightlife strip' },
  { name: 'Washington Beach', kind: 'beach', note: 'beachfront district' },
  { name: 'Downtown', kind: 'downtown', note: 'glass towers' },
  { name: 'Little Havana', kind: 'district', note: 'panaderías, Cuban shops (also called Little Cuba)' },
  { name: 'Little Haiti', kind: 'district', note: 'Haitian district' },
  { name: 'Stockyard', kind: 'district', note: 'art / mural district' },
  { name: 'Crosstown', kind: 'district', note: 'Vice-Dale district' },
  { name: 'La Perle', kind: 'district', note: 'district label (18 search results)' },
  { name: 'Bayside', kind: 'district', note: 'district label (12 results); safehouse 201 here' },
  { name: 'Salton', kind: 'district', note: 'district label (30 results)' },
  { name: 'Southside', kind: 'district', note: 'district label (17 results)' },
  { name: 'Balsero', kind: 'district', note: 'district label (12 results)' },
  { name: 'Decor District', kind: 'district', note: 'district label (8 results)' },
  { name: 'Venetian Islands', kind: 'islands', note: 'island chain in Vice-Dale' },
  { name: 'Leaf Links', kind: 'place', note: 'golf area' },
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
