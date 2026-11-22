// strangers.js — Strangers & Freaks (13), SPEC §4.
// Randy, Tyrone & Dunk count as one entry (a trio), giving 13 entries total.
export const STRANGERS = [
  { id: 'shirley', name: 'Shirley', chapter: 1, jobs: 3, desc: 'Steal rum and a scooter.' },
  { id: 'cal-sf', name: 'Cal', chapter: 1, jobs: 2, desc: 'Fish for a giant fish ("Catch A Bigger Fish").' },
  { id: 'kirk', name: 'Kirk', chapter: 1, jobs: 4, desc: 'Skunk Ape / Bigfoot hunter in the forest and swamp.' },
  { id: 'kyle', name: 'Kyle', chapter: 2, jobs: 3, desc: 'McKittrick Farm — collect chemicals (GMO strawberry "Hulk" parody).' },
  { id: 'billy-sf', name: 'Billy', chapter: 2, jobs: 5, desc: 'Thrillbilly Mud Club trail-bike gang leader (5 race & theft missions).' },
  { id: 'bret-sf', name: 'Bret Vogel', chapter: 2, jobs: 3, desc: 'Veteran hunter with special hunting challenges.' },
  { id: 'moses-sf', name: 'Moses', chapter: 2, jobs: 4, desc: 'Steal a list of special-order cars.' },
  { id: 'yago', name: 'Yago', chapter: 3, jobs: 4, desc: 'Little Cuba street racer (4 race & mentor missions).' },
  { id: 'andy-sf', name: 'Andy', chapter: 3, jobs: 4, desc: 'Mara + the mysterious Cellerica group (4 missions).' },
  { id: 'yasmani', name: 'Yasmani', chapter: 3, jobs: 3, desc: 'Stolen-jewellery fence; robbery jobs.' },
  { id: 'randy-trio', name: 'Randy, Tyrone & Dunk', chapter: 3, jobs: 3, desc: 'Destroy a rival lab and special thefts.' },
  { id: 'eddie', name: 'Eddie Acosta', chapter: 4, jobs: 2, desc: 'Crypto fan, met in the Pool Day mission.' },
  { id: 'pete-sf', name: 'Pilot Pete', chapter: 4, jobs: 3, desc: 'Smuggler pilot; Cole flies air packages.' },
];

// Next stranger available given the missions completed so far.
export function nextAvailable(doneMissionCount) {
  const chapter = doneMissionCount < 22 ? 1 : doneMissionCount < 33 ? 2 : doneMissionCount < 59 ? 3 : 4;
  return STRANGERS.filter((s) => s.chapter <= chapter);
}

export function strangerById(id) {
  return STRANGERS.find((s) => s.id === id) || null;
}
