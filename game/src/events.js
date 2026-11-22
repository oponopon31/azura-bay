// events.js — Random events & encounters (500+), SPEC §14.
// 14 named event types × ~40 spawn locations = 500+ combinations.
// Types: street crime, weird encounters, special locations.
export const EVENT_TYPES = [
  { id: 'copdancer', name: 'Crazy Cop Car Dancer', kind: 'weird', desc: 'A crazy dancer on top of a police car.' },
  { id: 'tiger', name: 'Tiger Attack', kind: 'weird', desc: 'An escaped tiger attacks.' },
  { id: 'skunkape-event', name: 'Swamp Ape Sighting', kind: 'weird', desc: 'A Swamp Ape / Bigfoot sighting.' },
  { id: 'planecrash', name: 'Plane Crash Site', kind: 'location', desc: 'A plane crash location in the forest.' },
  { id: 'drugdeal', name: 'Drug Deal', kind: 'crime', desc: 'A drug deal in an alley.' },
  { id: 'kidnap', name: 'Kidnapping Victim in Trunk', kind: 'crime', desc: 'A kidnapping victim in a car trunk.' },
  { id: 'bikerconvoy', name: 'Biker Gang Convoy', kind: 'crime', desc: 'A biker gang convoy.' },
  { id: 'npcrobbery', name: 'Robbery by Another NPC', kind: 'crime', desc: 'Another NPC robbing a store.' },
  { id: 'dui', name: 'DUI Test', kind: 'police', desc: 'A police drunk-driving test.' },
  { id: 'amusement', name: 'Amusement Park', kind: 'location', desc: 'An amusement park.' },
  { id: 'wrestling', name: 'Backyard Wrestling Ring', kind: 'location', desc: 'A backyard wrestling ring.' },
  { id: 'cartelhouse', name: 'Cartel House', kind: 'location', desc: 'A A movie-style cartel house..' },
  { id: 'hauntedhotel', name: 'Haunted Hotel', kind: 'location', desc: 'A haunted hotel in the backcountry.' },
  { id: 'gaspump', name: 'Crazy Man at Gas Station', kind: 'weird', desc: 'A crazy man at a gas station.' },
];

export const EVENT_LOCATIONS = [
  'Azura Bay', 'Coral Strand', 'Coral Drive', 'Salsa Quarter', 'Creole Quarter', 'Stockyard',
  'Downtown', 'Foxglove', 'Belville', 'Stonebridge', 'Palm Links', 'Coral Isles',
  'Cayo Verde', 'Waverly Bay', 'Capri', 'Solara Key', 'Reedmarsh', 'Port Marlowe',
  'Ambrosia', 'Allied Crystal', 'Lake Solmaris', 'Mount Corvina', 'Yorktown', 'Silver Sands',
  'Millhaven', 'Emerald Springs', 'La Perle', 'Bayview', 'Salton', 'Southside', 'Balsero',
  'Decor District', 'Pelican Key', 'Marlowe International Raceway', 'Solmaris Keys',
  'Azura Harbor', 'ABIA', 'Breakwater Quarry', 'Crosstown', 'Tequesta Retreat',
];

// Total combinations: 14 types × 40 locations = 560 (500+).
export function totalEventCombinations() {
  return EVENT_TYPES.length * EVENT_LOCATIONS.length;
}

// Cooldown (seconds) left before an event type can spawn again.
export function cooldownLeft(lastSpawnAt, now, cooldownSec) {
  return Math.max(0, cooldownSec - (now - lastSpawnAt));
}
