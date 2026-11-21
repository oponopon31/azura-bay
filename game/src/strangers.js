// AZURA BAY — Strangers & Freaks (round 7 re-compose, written fresh under r7).
// 13 characters, SPEC.md Bab 4. Each has a chapter, contact, and objective.

export const STRANGERS = [
  { id: "shirley", name: "Shirley", ch: 1, zone: "Leonida Keys", x: -310, z: 745, obj: "Steal rum and a scooter.", desc: "Rum runner with a fast scooter." },
  { id: "cal", name: "Cal", ch: 1, zone: "Leonida Keys", x: -300, z: 760, obj: 'Catch a bigger fish.', desc: "Fisherman hunting the giant fish." },
  { id: "kirk", name: "Kirk", ch: 1, zone: "Grassrivers", x: -410, z: 534, obj: "Hunt the Skunk Ape / Bigfoot in the woods and swamp.", desc: "Skunk Ape hunter." },
  { id: "kyle", name: "Kyle", ch: 2, zone: "Port Gellhorn", x: -815, z: -530, obj: "Collect chemicals at McKittrick Farm.", desc: "GMO strawberry farm hand." },
  { id: "billy", name: "Billy", ch: 2, zone: "Port Gellhorn", x: -825, z: -520, obj: "5 trail-bike races and thefts for the Thrillbilly Mud Club.", desc: "Trail-bike gang leader." },
  { id: "bret", name: "Bret Vogel", ch: 2, zone: "Ambrosia", x: -380, z: -529, obj: "Special hunting challenges.", desc: "Veteran hunter." },
  { id: "moses", name: "Moses", ch: 2, zone: "Port Gellhorn", x: -815, z: -525, obj: "Steal the list of ordered cars.", desc: "Steals cars to order. Goes by Mo." },
  { id: "yago", name: "Yago", ch: 3, zone: "Vice City", x: -40, z: -85, obj: "4 street races and mentorship in Little Cuba.", desc: "Street racer and mentor." },
  { id: "andy", name: "Andy", ch: 3, zone: "Vice City", x: -35, z: -95, obj: "4 missions with Lucia and the mysterious Cellerica.", desc: "Cellerica contact." },
  { id: "yasmani", name: "Yasmani", ch: 3, zone: "Vice City", x: -45, z: -90, obj: "Fence stolen jewelry; robbery jobs.", desc: "Jewelry fence." },
  { id: "randy-crew", name: "Randy, Tyrone & Dunk", ch: 3, zone: "Vice City", x: -30, z: -100, obj: "Destroy the rival lab and special thefts.", desc: "Trio of specialists." },
  { id: "eddie", name: "Eddie Acosta", ch: 4, zone: "Vice Beach", x: 190, z: -112, obj: "Crypto fan met in Pool Day.", desc: "Crypto enthusiast." },
  { id: "pete", name: "Pilot Pete", ch: 4, zone: "VCIA", x: -265, z: 83, obj: "Fly smuggling packages by air.", desc: "Smuggler pilot." },
];

export function strangerById(id) { return STRANGERS.find((s) => s.id === id) || null; }
export function nextAvailable(state) {
  const done = new Set((state && state.strangersDone) || []);
  return STRANGERS.filter((s) => !done.has(s.id));
}
export function totalStrangers() { return STRANGERS.length; }
