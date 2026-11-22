// solmarismap.js — Solmaris map.
// 27 points with verified coastatlas coordinates.
// Game coords: x = gx/8, z = -gy/8 (coastatlas X east, Y north; game z is -Y).
// Breakwater Quarry uses the CORRECTED -4462/-922 (old -4600/+643 never used).
// Pelican Key airfield is a DIFFERENT airfield from ABIA.
export const MAP_POINTS = [
  { id: 'keylento', name: 'Cayo Verde', kind: 'town', gx: -2366, gy: -5992, county: 'Key County', region: 'Solmaris Keys' },
  { id: 'hamlet', name: 'Foxglove', kind: 'town', gx: -2864, gy: -3120, county: 'Bay County', region: 'Azura Bay' },
  { id: 'watsonbay', name: 'Waverly Bay', kind: 'town', gx: -4862, gy: -3404, county: 'Key County', region: 'Solmaris Keys' },
  { id: 'capri', name: 'Capri', kind: 'town', gx: -7088, gy: 202, county: 'Key County', region: 'Solmaris Keys' },
  { id: 'glorianakey', name: 'Solara Key', kind: 'town', gx: 722, gy: -1398, county: 'Bay County', region: 'Azura Bay' },
  { id: 'azurabay', name: 'Azura Bay', kind: 'city', gx: -220, gy: 756, county: 'Bay County', region: 'Azura Bay' },
  { id: 'coralstrand', name: 'Coral Strand', kind: 'town', gx: 1530, gy: 896, county: 'Bay County', region: 'Azura Bay' },
  { id: 'waningsands', name: 'Silver Sands', kind: 'town', gx: -244, gy: 4028, county: 'North County', region: 'Azura Bay' },
  { id: 'ambrosia', name: 'Ambrosia', kind: 'town', gx: -3040, gy: 4234, county: 'West County', region: 'Ambrosia' },
  { id: 'portmarlowe', name: 'Port Marlowe', kind: 'town', gx: -6560, gy: 4264, county: 'West County', region: 'Port Marlowe' },
  { id: 'millport', name: 'Millhaven', kind: 'town', gx: -712, gy: 6244, county: 'Highland County', region: 'Mount Corvina National Park' },
  { id: 'emeraldsprings', name: 'Emerald Springs', kind: 'place', gx: -3960, gy: 2164, county: 'West County', region: 'Ambrosia' },
  { id: 'laperle', name: 'La Perle', kind: 'district', gx: -762, gy: 1776, county: 'Bay County', region: 'Azura Bay' },
  { id: 'bayside', name: 'Bayview', kind: 'district', gx: -440, gy: 1298, county: 'Bay County', region: 'Azura Bay' },
  { id: 'salton', name: 'Salton', kind: 'district', gx: -1414, gy: -536, county: 'Bay County', region: 'Azura Bay' },
  { id: 'southside', name: 'Southside', kind: 'district', gx: -1632, gy: -2122, county: 'Bay County', region: 'Azura Bay' },
  { id: 'balsero', name: 'Balsero', kind: 'district', gx: -2218, gy: 460, county: 'Bay County', region: 'Azura Bay' },
  { id: 'decordistrict', name: 'Decor District', kind: 'district', gx: -296, gy: 2168, county: 'Bay County', region: 'Azura Bay' },
  { id: 'pelicankey', name: 'Pelican Key', kind: 'island', gx: -6226, gy: -6470, county: 'Key County', region: 'Solmaris Keys', note: 'has its own airfield, separate from ABIA' },
  { id: 'raceway', name: 'Marlowe International Raceway', kind: 'landmark', gx: -6718, gy: 2376, county: 'West County', region: 'Port Marlowe' },
  { id: 'solmariskeys', name: 'Solmaris Keys', kind: 'landmark', gx: -4166, gy: -6422, county: 'Key County', region: 'Solmaris Keys' },
  { id: 'reedmarsh', name: 'Reedmarsh', kind: 'landmark', gx: -3280, gy: -4270, county: 'Key County', region: 'Reedmarsh' },
  { id: 'mountcorvina', name: 'Mount Corvina National Park', kind: 'landmark', gx: -3396, gy: 6440, county: 'Highland County', region: 'Mount Corvina National Park' },
  { id: 'lakesolmaris', name: 'Lake Solmaris', kind: 'landmark', gx: -1948, gy: 4794, county: 'West County', region: 'Ambrosia' },
  { id: 'abia', name: 'Azura Bay International Airport', kind: 'airport', gx: -2118, gy: -662, county: 'Bay County', region: 'Azura Bay' },
  { id: 'azuraharbor', name: 'Azura Harbor', kind: 'landmark', gx: 854, gy: -390, county: 'Bay County', region: 'Azura Bay' },
  { id: 'breakwater', name: 'Breakwater Quarry', kind: 'landmark', gx: -4462, gy: -922, county: 'West County', region: 'Port Marlowe', note: 'corrected coords; old -4600/+643 never used' },
];

// Game-space position for a map point (x = gx/8, z = -gy/8).
export function gamePos(p) {
  return { x: p.gx / 8, z: -p.gy / 8 };
}

export const REGIONS = [
  'Azura Bay', 'Solmaris Keys', 'Reedmarsh', 'Port Marlowe', 'Ambrosia', 'Mount Corvina National Park',
];

export const COUNTIES = [
  { name: 'Bay County', area: 'southeast' },
  { name: 'North County', area: 'northeast' },
  { name: 'West County', area: 'west' },
  { name: 'Key County', area: 'south' },
  { name: 'Highland County', area: 'north' },
];

// 23 in-game map icons.
export const MAP_ICONS = [
  'Destination', 'New', 'Safehouse', 'Wardrobe', 'Gym', 'Grocery store', 'Ironhold Arms',
  'Weapon locker', 'Clothing store', 'Electronics store', 'Salon / barber', 'ATM',
  "Quick Spray", 'Mod shop (cars)', 'Mod shop (bikes)', 'Specialty mod shop',
  'Gas station', 'Electric charging station', 'Shooting range', 'Golf', 'Pool',
  'Fishing', 'CCTV camera',
];

// Map mechanics: 1 active waypoint, many markers,
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

// Pelican Key airfield vs ABIA: two different airfields, ~7100 atlas units apart.
export function pelicanKeyVsAbiaDistance() {
  const g = pointById('pelicankey');
  const v = pointById('abia');
  return Math.round(Math.hypot(g.gx - v.gx, g.gy - v.gy));
}
