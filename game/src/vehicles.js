// Azura Bay — re-authored under recording r21
// vehicles.js — Vehicle systems, SPEC §17.
// Car Security Tiers: old/standard cars open with a slim jim or smashed
// window; luxury/modern cars need a Key-Cloner or Phone-Hacking Tool.
// GPS Tracker: expensive cars have a tracker that auto-calls police if stolen;
// remove it at a workshop/fence before storing or selling.
// Fuel & charging: fuel/battery indicator is live; conventional cars refuel
// at gas stations, EVs at charging stations.
// Partner driving commands: as a passenger in a chase, give your partner
// (Cole/Mara) driving directions.
export const SECURITY_TIERS = [
  { tier: 1, name: 'Standard', method: 'slim jim or smashed window', note: 'old / standard cars' },
  { tier: 2, name: 'Modern', method: 'Key-Cloner', note: 'modern cars' },
  { tier: 3, name: 'Luxury', method: 'Phone-Hacking Tool', note: 'luxury / modern cars' },
];

export const TRACKER_TYPES = ['none', 'standard', 'advanced'];

// Fuel: 0-100. EVs use battery (same 0-100 scale, charged at stations).
export function fuelStatus(fuel, isEV) {
  if (fuel <= 0) return isEV ? 'battery empty' : 'out of fuel';
  if (fuel < 25) return isEV ? 'low battery' : 'low fuel';
  return isEV ? 'battery ok' : 'fuel ok';
}

export function needsTrackerRemoval(vehicle) {
  return vehicle && vehicle.tracker && vehicle.tracker !== 'none' && !vehicle.trackerRemoved;
}

// Partner driving commands (as passenger in a chase).
export const PARTNER_COMMANDS = ['left', 'right', 'faster', 'slower', 'lose them', 'ram them'];

export function countByDriver(vehicles, driver) {
  return (vehicles || []).filter((v) => v.driver === driver).length;
}
