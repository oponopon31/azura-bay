// leonidamap.js — Leonida map, MAP-DATA.md.
// 27 points with verified gtabase coordinates (section g, live check 2026-11-21).
// Game coords: x = gx/8, z = -gy/8 (gtabase X east, Y north; game z is -Y).
// Breakwater Quarry uses the CORRECTED -4462/-922 (old -4600/+643 never used).
// Goose Key airfield is a DIFFERENT airfield from VCIA.
export const MAP_POINTS = [
  { id: 'keylento', name: 'Key Lento', kind: 'town', gx: -2366, gy: -5992, county: 'Mariana', region: 'Leonida Keys' },
  { id: 'hamlet', name: 'Hamlet', kind: 'town', gx: -2864, gy: -3120, county: 'Vice-Dale', region: 'Vice City' },
  { id: 'watsonbay', name: 'Watson Bay', kind: 'town', gx: -4862, gy: -3404, county: 'Mariana', region: 'Leonida Keys' },
  { id: 'capri', name: 'Capri', kind: 'town', gx: -7088, gy: 202, county: 'Mariana', region: 'Leonida Keys' },
  { id: 'glorianakey', name: 'Gloriana Key', kind: 'town', gx: 722, gy: -1398, county: 'Vice-Dale', region: 'Vice City' },
  { id: 'vicecity', name: 'Vice City', kind: 'city', gx: -220, gy: 756, county: 'Vice-Dale', region: 'Vice City' },
  { id: 'vicebeach', name: 'Vice Beach', kind: 'town', gx: 1530, gy: 896, county: 'Vice-Dale', region: 'Vice City' },
  { id: 'waningsands', name: 'Waning Sands', kind: 'town', gx: -244, gy: 4028, county: 'Leonard', region: 'Vice City' },
  { id: 'ambrosia', name: 'Ambrosia', kind: 'town', gx: -3040, gy: 4234, county: 'Kelly', region: 'Ambrosia' },
  { id: 'portgellhorn', name: 'Port Gellhorn', kind: 'town', gx: -6560, gy: 4264, county: 'Kelly', region: 'Port Gellhorn' },
  { id: 'millport', name: 'Millport', kind: 'town', gx: -712, gy: 6244, county: 'Lummox', region: 'Mount Kalaga National Park' },
  { id: 'emeraldsprings', name: 'Emerald Springs', kind: 'place', gx: -3960, gy: 2164, county: 'Kelly', region: 'Ambrosia' },
  { id: 'laperle', name: 'La Perle', kind: 'district', gx: -762, gy: 1776, county: 'Vice-Dale', region: 'Vice City' },
  { id: 'bayside', name: 'Bayside', kind: 'district', gx: -440, gy: 1298, county: 'Vice-Dale', region: 'Vice City' },
  { id: 'salton', name: 'Salton', kind: 'district', gx: -1414, gy: -536, county: 'Vice-Dale', region: 'Vice City' },
  { id: 'southside', name: 'Southside', kind: 'district', gx: -1632, gy: -2122, county: 'Vice-Dale', region: 'Vice City' },
  { id: 'balsero', name: 'Balsero', kind: 'district', gx: -2218, gy: 460, county: 'Vice-Dale', region: 'Vice City' },
  { id: 'decordistrict', name: 'Decor District', kind: 'district', gx: -296, gy: 2168, county: 'Vice-Dale', region: 'Vice City' },
  { id: 'goosekey', name: 'Goose Key', kind: 'island', gx: -6226, gy: -6470, county: 'Mariana', region: 'Leonida Keys', note: 'has its own airfield, separate from VCIA' },
  { id: 'raceway', name: 'Gellhorn International Raceway', kind: 'landmark', gx: -6718, gy: 2376, county: 'Kelly', region: 'Port Gellhorn' },
  { id: 'leonidakeys', name: 'Leonida Keys', kind: 'landmark', gx: -4166, gy: -6422, county: 'Mariana', region: 'Leonida Keys' },
  { id: 'grassrivers', name: 'Grassrivers', kind: 'landmark', gx: -3280, gy: -4270, county: 'Mariana', region: 'Grassrivers' },
  { id: 'mountkalaga', name: 'Mount Kalaga National Park', kind: 'landmark', gx: -3396, gy: 6440, county: 'Lummox', region: 'Mount Kalaga National Park' },
  { id: 'lakeleonida', name: 'Lake Leonida', kind: 'landmark', gx: -1948, gy: 4794, county: 'Kelly', region: 'Ambrosia' },
  { id: 'vcia', name: 'Vice City International Airport', kind: 'airport', gx: -2118, gy: -662, county: 'Vice-Dale', region: 'Vice City' },
  { id: 'vcport', name: 'Vice City Port', kind: 'landmark', gx: 854, gy: -390, county: 'Vice-Dale', region: 'Vice City' },
  { id: 'breakwater', name: 'Breakwater Quarry', kind: 'landmark', gx: -4462, gy: -922, county: 'Kelly', region: 'Port Gellhorn', note: 'corrected coords; old -4600/+643 never used' },
];

// Game-space position for a map point (x = gx/8, z = -gy/8).
export function gamePos(p) {
  return { x: p.gx / 8, z: -p.gy / 8 };
}

export const REGIONS = [
  'Vice City', 'Leonida Keys', 'Grassrivers', 'Port Gellhorn', 'Ambrosia', 'Mount Kalaga National Park',
];

export const COUNTIES = [
  { name: 'Vice-Dale', area: 'southeast' },
  { name: 'Leonard', area: 'northeast' },
  { name: 'Kelly', area: 'west' },
  { name: 'Mariana', area: 'south' },
  { name: 'Lummox', area: 'north' },
];

// 23 in-game map icons (MAP-DATA.md section c).
export const MAP_ICONS = [
  'Destination', 'New', 'Safehouse', 'Wardrobe', 'Gym', 'Grocery store', 'Ammu-Nation',
  'Weapon locker', 'Clothing store', 'Electronics store', 'Salon / barber', 'ATM',
  "Pay 'n' Spray", 'Mod shop (cars)', 'Mod shop (bikes)', 'Specialty mod shop',
  'Gas station', 'Electric charging station', 'Shooting range', 'Golf', 'Pool',
  'Fishing', 'CCTV camera',
];

// Map mechanics (MAP-DATA.md section d): 1 active waypoint, many markers,
// Map Index (D-Pad Right), quick navigation (hold D-Pad Down), Fog of War
// (map starts covered in fog, opens as the player travels — SPEC Bab 25).
export const MAP_MECHANICS = {
  maxWaypoints: 1,
  mapIndexKey: 'D-Pad Right',
  quickNavKey: 'Hold D-Pad Down',
  fogOfWar: true,
};

export function waypointName(id) {
  const p = MAP_POINTS.find((q) => q.id === id);
  return p ? p.name : null;
}

export function pointById(id) {
  return MAP_POINTS.find((p) => p.id === id) || null;
}

// Goose Key airfield vs VCIA: two different airfields, ~7100 gtabase units apart.
export function gooseKeyVsVciaDistance() {
  const g = pointById('goosekey');
  const v = pointById('vcia');
  return Math.round(Math.hypot(g.gx - v.gx, g.gy - v.gy));
}
