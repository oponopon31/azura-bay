// mysteries.js — Mysteries & easter eggs, SPEC §7 + §20 + §21.
// Skunk Ape, UFO, comm-tower egg, GTA references, film references,
// 8 secret exploration locations, Kraken wreck, underground lab, Stonehenge.
export const MYSTERIES = [
  { id: 'skunkape', name: 'Skunk Ape / Bigfoot', area: 'Grassrivers', desc: 'Runs between trees near a deer carcass; chase too close and Jason gets dizzy, then faints.' },
  { id: 'ufo', name: 'UFO & Alien Base', area: 'Kelly County & Mount Kalaga', desc: 'Appears after 02:00 at night; a floating van and a secret bunker hatch in the Grassrivers.' },
  { id: 'tower-egg', name: 'Comm Tower Egg', area: 'Comms Tower', desc: 'Climb the tallest tower (~7 minutes); a nest holds a giant colourful egg — throw it in the street for a secret cutscene.' },
  { id: 'los-santos-map', name: 'Los Santos Map', area: "Jason's boat", desc: "Jason's boat GPS shows a Los Santos map (GTA 5 reference)." },
  { id: 'windchimes', name: 'Windchimes Ringtone', area: 'Phone', desc: 'Ringtone "Windchimes" — Michael De Santa\'s ringtone (GTA 5).' },
  { id: 'malibu-tv', name: 'Malibu Club TV', area: 'Donnie\'s trailer', desc: 'An analogue TV on a tower near Donnie\'s trailer shows the Malibu Club logo (GTA: Vice City).' },
  { id: 'phil-cassidy', name: "Phil Cassidy", area: "Phil's Ammu-Nation", desc: "Phil Cassidy owns Phil's Ammu-Nation (GTA: Vice City)." },
  { id: 'eclipse', name: '1995 Mitsubishi Eclipse', area: 'Vespucci Island', desc: 'Brian O\'Conner-style Eclipse (Fast & Furious).' },
  { id: 'dexter', name: 'Dexter Reference', area: 'Washington Island', desc: 'Dexter reference in an apartment.' },
  { id: 'wonder-whale', name: 'Wonder Whale', area: 'Leonida', desc: 'Giant crab statue Wonder Whale.' },
  { id: 'kraken', name: 'Giant Kraken Wreck', area: 'Ocean floor', desc: 'A giant Kraken carcass on the sea floor — scuba diving only.' },
  { id: 'underground-lab', name: 'Abandoned Underground Lab', area: 'Underground', desc: 'A random 4-digit coded door (different per player — the code is scratched on a basement wall near a red light); a lift leads to a mysterious lab tunnel.' },
  { id: 'stonehenge', name: 'Stonehenge & Purple Meteor', area: 'Mount Kalaga', desc: 'Mysterious stone formation on the mountain peak + a smoking purple meteor crater.' },
  { id: 'cool-dog', name: 'Cool Dog & Buried Treasure', area: 'Gambit Bay', desc: 'Swim to Gambit Bay waters — a unique dog appears and digs up hidden money (~$1,200) on the beach.' },
  { id: 'cj-house', name: 'CJ / Grove Street House', area: 'Belville', desc: 'A house with a yard + garage layout like the Johnson family house (GTA San Andreas).' },
  { id: 'crab-lab', name: 'Giant Crab Research Facility', area: 'Pelican Valley', desc: 'A giant broken aquarium; flip the power switch behind the building + check the computer inside for a monster-crab jump scare.' },
  { id: 'michael-boat', name: "Michael De Santa's Boat", area: 'Key Lento', desc: 'A sailboat identical to Michael\'s (GTA 5) near a coastal dock.' },
  { id: 'trevor-radio', name: 'Trevor Radio Cameo', area: 'Radio', desc: 'An iconic past character (e.g. Trevor, GTA 5) calls in on a local radio segment.' },
];

// 8 secret exploration locations (SPEC §20).
export const SECRET_LOCATIONS = [
  'Kraken wreck (ocean floor)', 'Abandoned underground lab', 'Stonehenge & purple meteor (Mount Kalaga)',
  'Cool Dog treasure (Gambit Bay)', 'Villa & iconic car (Vespucci Island)', 'Dexter apartment & rooftop HQ (Washington Island)',
  "Arthur Morgan's hat (Port Gellhorn yard sale)", 'New Austin cowboy novel (Jacob\'s Tavern, Millport)',
];

// UFO only appears after 02:00 (game time).
export function ufoVisible(hour) {
  return hour >= 2 && hour < 5;
}

export function undiscovered(foundIds) {
  const found = new Set(foundIds || []);
  return MYSTERIES.filter((m) => !found.has(m.id));
}
