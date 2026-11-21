// AZURA BAY — Leonida map (round 7 re-compose, written fresh under r7).
// SPEC.md Bab 28 + MAP-DATA.md (g). 6 regions, 5 counties, 27 points with
// the EXACT gtabase coordinates (live check 2026-11-21; X east, Y north,
// tolerance +-40). Breakwater Quarry uses the CORRECTED -4462/-922
// (the old -4600/+643 is never used). Goose Key airfield is separate
// from VCIA. Game coords: x = gx/8, z = -gy/8.

export const REGIONS = [
  "Vice City", "Leonida Keys", "Grassrivers",
  "Port Gellhorn", "Ambrosia", "Mount Kalaga National Park",
];
export const COUNTIES = [
  { name: "Vice-Dale", area: "southeast" },
  { name: "Leonard", area: "northeast" },
  { name: "Kelly", area: "west" },
  { name: "Mariana", area: "south" },
  { name: "Lummox", area: "north" },
];

// gx, gy = gtabase coords; x, z = game coords (gx/8, -gy/8).
export const MAP_POINTS = [
  { name: "Key Lento", gx: -2366, gy: -5992, x: -296, z: 749, kind: "town" },
  { name: "Hamlet", gx: -2864, gy: -3120, x: -358, z: 390, kind: "town" },
  { name: "Watson Bay", gx: -4862, gy: -3404, x: -608, z: 426, kind: "town" },
  { name: "Capri", gx: -7088, gy: 202, x: -886, z: -25, kind: "town" },
  { name: "Gloriana Key", gx: 722, gy: -1398, x: 90, z: 175, kind: "town" },
  { name: "Vice City", gx: -220, gy: 756, x: -28, z: -95, kind: "city" },
  { name: "Vice Beach", gx: 1530, gy: 896, x: 191, z: -112, kind: "town" },
  { name: "Waning Sands", gx: -244, gy: 4028, x: -31, z: -504, kind: "town" },
  { name: "Ambrosia", gx: -3040, gy: 4234, x: -380, z: -529, kind: "town" },
  { name: "Port Gellhorn", gx: -6560, gy: 4264, x: -820, z: -533, kind: "town" },
  { name: "Millport", gx: -712, gy: 6244, x: -89, z: -781, kind: "town" },
  { name: "Emerald Springs", gx: -3960, gy: 2164, x: -495, z: -271, kind: "town" },
  { name: "La Perle", gx: -762, gy: 1776, x: -95, z: -222, kind: "district" },
  { name: "Bayside", gx: -440, gy: 1298, x: -55, z: -162, kind: "district" },
  { name: "Salton", gx: -1414, gy: -536, x: -177, z: 67, kind: "district" },
  { name: "Southside", gx: -1632, gy: -2122, x: -204, z: 265, kind: "district" },
  { name: "Balsero", gx: -2218, gy: 460, x: -277, z: -58, kind: "district" },
  { name: "Decor District", gx: -296, gy: 2168, x: -37, z: -271, kind: "district" },
  { name: "Goose Key", gx: -6226, gy: -6470, x: -778, z: 809, kind: "island" },
  { name: "Gellhorn International Raceway", gx: -6718, gy: 2376, x: -840, z: -297, kind: "landmark" },
  { name: "Leonida Keys", gx: -4166, gy: -6422, x: -521, z: 803, kind: "region" },
  { name: "Grassrivers", gx: -3280, gy: -4270, x: -410, z: 534, kind: "region" },
  { name: "Mount Kalaga National Park", gx: -3396, gy: 6440, x: -425, z: -805, kind: "region" },
  { name: "Lake Leonida", gx: -1948, gy: 4794, x: -244, z: -599, kind: "landmark" },
  { name: "Vice City International Airport (VCIA)", gx: -2118, gy: -662, x: -265, z: 83, kind: "landmark" },
  { name: "Vice City Port", gx: 854, gy: -390, x: 107, z: 49, kind: "landmark" },
  { name: "Breakwater Quarry", gx: -4462, gy: -922, x: -558, z: 115, kind: "landmark" },
];

export const MAP_ICONS = [
  "mission", "stranger", "shop", "garage", "safehouse", "ammunation",
  "collectible", "stunt", "robbery", "radio", "fishing", "gym",
  "barber", "tattoo", "clothing", "gas", "hospital", "police",
  "airport", "marina", "landmark", "mystery", "phone",
];

export function pointByName(name) { return MAP_POINTS.find((p) => p.name === name) || null; }
export function waypointName(state) {
  const wp = state && state.waypoint;
  return wp ? wp.name : null;
}
export function totalMapPoints() { return MAP_POINTS.length; }
export function totalMapIcons() { return MAP_ICONS.length; }
// Fog of war: a point is revealed once the player comes within 120 units.
export function isRevealed(state, point) {
  const revealed = (state && state.mapRevealed) || [];
  if (revealed.includes(point.name)) return true;
  if (!state || !state.player) return false;
  const dx = state.player.x - point.x, dz = state.player.z - point.z;
  return Math.hypot(dx, dz) < 120;
}
