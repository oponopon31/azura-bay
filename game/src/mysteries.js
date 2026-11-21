// AZURA BAY — mysteries & easter eggs (round 7 re-compose, fresh under r7).
// SPEC.md Bab 7. 20 entries. Skunk Ape / Bigfoot in Grassrivers, UFO +
// alien base after 02:00, comm-tower egg (secret cutscene), old-GTA
// references (Los Santos map in a boat GPS, Michael's Windchimes ringtone,
// Malibu Club logo, Phil Cassidy at Ammu-Nation), Fast & Furious / Dexter /
// Wonder Whale references.

export const MYSTERIES = [
  { id: "skunk-ape", name: "Skunk Ape / Bigfoot", zone: "Grassrivers", desc: "Ape-man in the woods and swamp.", time: "any" },
  { id: "ufo", name: "UFO", zone: "Mount Kalaga", desc: "UFO appears after 02:00.", time: "02:00-06:00" },
  { id: "alien-base", name: "Alien Base", zone: "Mount Kalaga", desc: "Alien base, open after the UFO.", time: "02:00-06:00" },
  { id: "comm-tower-egg", name: "Comm Tower Egg", zone: "Vice City", desc: "Secret cutscene at the comm tower.", time: "any" },
  { id: "ls-map", name: "Los Santos Map", zone: "Vice City Port", desc: "A Los Santos map in a boat GPS.", time: "any" },
  { id: "windchimes", name: "Windchimes Ringtone", zone: "Vice City", desc: "Michael's ringtone on a phone.", time: "any" },
  { id: "malibu-logo", name: "Malibu Club Logo", zone: "Vice Beach", desc: "Original Malibu Club logo.", time: "any" },
  { id: "phil-cassidy", name: "Phil Cassidy", zone: "Vice City", desc: "Phil Cassidy at Ammu-Nation.", time: "any" },
  { id: "fast-furious", name: "Fast & Furious", zone: "Vice City", desc: "A street race homage.", time: "any" },
  { id: "dexter", name: "Dexter", zone: "Vice City", desc: "A kill-room reference.", time: "any" },
  { id: "wonder-whale", name: "Wonder Whale", zone: "Vice Beach", desc: "A whale statue reference.", time: "any" },
  { id: "ghost-ship", name: "Ghost Ship", zone: "Leonida Keys", desc: "A wreck that appears at night.", time: "night" },
  { id: "mermaid", name: "Mermaid", zone: "Vice Beach", desc: "A mermaid sighting offshore.", time: "night" },
  { id: "crop-circles", name: "Crop Circles", zone: "Ambrosia", desc: "Crop circles in the fields.", time: "night" },
  { id: "abandoned-bunker", name: "Abandoned Bunker", zone: "Mount Kalaga", desc: "A Cold War bunker.", time: "any" },
  { id: "sunken-treasure", name: "Sunken Treasure", zone: "Leonida Keys", desc: "Treasure under the Keys.", time: "any" },
  { id: "haunted-mansion", name: "Haunted Mansion", zone: "Waning Sands", desc: "A mansion with ghosts.", time: "night" },
  { id: "time-capsule", name: "Time Capsule", zone: "Vice City", desc: "A capsule from 1986.", time: "any" },
  { id: "jetpack", name: "Jetpack", zone: "VCIA", desc: "A jetpack in a hangar.", time: "any" },
  { id: "bigfoot-photo", name: "Bigfoot Photo", zone: "Grassrivers", desc: "Photograph the Skunk Ape.", time: "any" },
];

export function mysteryById(id) { return MYSTERIES.find((m) => m.id === id) || null; }
export function totalMysteries() { return MYSTERIES.length; }
// UFO only appears after 02:00 (and before 06:00).
export function ufoVisible(timeMinutes) {
  return timeMinutes >= 120 && timeMinutes < 360;
}
export function mysteriesAvailable(timeMinutes) {
  return MYSTERIES.filter((m) => {
    if (m.id === "ufo" || m.id === "alien-base") return ufoVisible(timeMinutes);
    if (m.time === "night") {
      const h = timeMinutes / 60;
      return h >= 20 || h < 6;
    }
    return true;
  });
}
