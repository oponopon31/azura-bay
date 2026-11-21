// fishing.js — Fishing (35 species), SPEC §17 + §18.
// Mechanics: Focus (L3+R3) to see fish gathering points; cast (L2+R2);
// reel slowly with the right stick; when the stick vibrates and R2 glows
// white, press R2 to hook; fight the pull with the left stick opposite the
// fish's swim direction until it tires, reel in with the right stick.
// Fish can be kept or released (catch & release).
export const FISH = [
  { id: 'alligatorgar', name: 'Alligator Gar', water: 'river' },
  { id: 'amberjack', name: 'Amberjack', water: 'sea' },
  { id: 'blackcrappie', name: 'Black Crappie', water: 'lake' },
  { id: 'blackdrum', name: 'Black Drum', water: 'sea' },
  { id: 'blackgrouper', name: 'Black Grouper', water: 'sea' },
  { id: 'blackfintuna', name: 'Blackfin Tuna', water: 'sea' },
  { id: 'bluecatfish', name: 'Blue Catfish', water: 'river' },
  { id: 'bluemarlin', name: 'Blue Marlin', water: 'sea' },
  { id: 'bluegill', name: 'Bluegill', water: 'lake' },
  { id: 'bonefish', name: 'Bonefish', water: 'sea' },
  { id: 'bullshark', name: 'Bull Shark', water: 'sea' },
  { id: 'channelcatfish', name: 'Channel Catfish', water: 'river' },
  { id: 'cobia', name: 'Cobia', water: 'sea' },
  { id: 'commonsnook', name: 'Common Snook', water: 'sea' },
  { id: 'mahimahi', name: 'Dolphin Fish (Mahi-Mahi)', water: 'sea' },
  { id: 'floridagar', name: 'Florida Gar', water: 'swamp' },
  { id: 'floridapompano', name: 'Florida Pompano', water: 'sea' },
  { id: 'goliathgrouper', name: 'Goliath Grouper', water: 'sea' },
  { id: 'kingmackerel', name: 'King Mackerel', water: 'sea' },
  { id: 'largemouthbass', name: 'Largemouth Bass', water: 'lake' },
  { id: 'lionfish', name: 'Lionfish', water: 'sea' },
  { id: 'muttonsnapper', name: 'Mutton Snapper', water: 'sea' },
  { id: 'nurseshark', name: 'Nurse Shark', water: 'sea' },
  { id: 'peacockbass', name: 'Peacock Bass', water: 'river' },
  { id: 'permit', name: 'Permit', water: 'sea' },
  { id: 'reddrum', name: 'Red Drum (Redfish)', water: 'sea' },
  { id: 'redgrouper', name: 'Red Grouper', water: 'sea' },
  { id: 'redsnapper', name: 'Red Snapper', water: 'sea' },
  { id: 'sailfish', name: 'Sailfish', water: 'sea' },
  { id: 'sheepshead', name: 'Sheepshead', water: 'sea' },
  { id: 'spottedseatrout', name: 'Spotted Seatrout', water: 'sea' },
  { id: 'stripedbass', name: 'Striped Bass', water: 'river' },
  { id: 'tarpon', name: 'Tarpon', water: 'sea' },
  { id: 'wahoo', name: 'Wahoo', water: 'sea' },
  { id: 'yellowfintuna', name: 'Yellowfin Tuna', water: 'sea' },
];

export function hasCaught(caughtIds, fishId) {
  return (caughtIds || []).includes(fishId);
}

export function fishByWater(water) {
  return FISH.filter((f) => f.water === water);
}
