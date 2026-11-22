// missions.js — 91 story missions in 5 chapters, SPEC §1 (exact names, in order).
// [n, chapter, name, objective]
const RAW = [
  // Chapter 1 — Keys, Cages and Currents (22). Solmaris Keys; Mara in prison, Cole's early action.
  [1, 1, 'Prologue', 'Mara in Solmaris Penitentiary; Cole runs a smuggling job in the Keys'],
  [2, 1, 'Gone Fishing', 'Take Gus\'s boat out; learn the Keys waterways'],
  [3, 1, 'Gear Up', 'Stock up at Phil\'s Ammu-Nation; first weapon unlock'],
  [4, 1, 'Just a Scratch', 'Deliver a package; scratch a car and learn repairs'],
  [5, 1, 'Lab Fees', 'Collect a debt from a lab contact'],
  [6, 1, 'Unwanted Attention', 'Shake a Coast Guard patrol tailing the boat'],
  [7, 1, 'Pipework', 'Fix the safehouse plumbing; meet Donnie'],
  [8, 1, 'Hey Arnold!', 'Help Arnold move a hot shipment'],
  [9, 1, 'Island Dreams', 'Scout a Keys island hideout'],
  [10, 1, 'Feng Shui', 'Rearrange the safehouse; learn the wardrobe'],
  [11, 1, 'Coming Home', 'Pick Mara up on day release'],
  [12, 1, 'Buck Me', 'Open the BuckMe joint savings account'],
  [13, 1, 'Clean Up After Donnie', 'Fix Donnie\'s botched job before Gus finds out'],
  [14, 1, 'Down to Earth', 'Land a smuggler plane on a Keys strip'],
  [15, 1, 'Clear Skies', 'Lose a police helicopter in the Reedmarsh'],
  [16, 1, 'Day Release', 'Mara\'s day release: a normal day that goes wrong'],
  [17, 1, 'Swamped', 'Airboat chase through the Reedmarsh'],
  [18, 1, 'Don Gone', 'Find Donnie after he vanishes mid-job'],
  [19, 1, 'Recalibration', 'Rebuild the smuggling route after a bust'],
  [20, 1, 'Tourist Trap', 'Rob tourists at a Keys marina'],
  [21, 1, 'Home Sweet Home', 'Set up the first real safehouse'],
  [22, 1, 'Discharge Time', 'Mara is discharged from prison — free at last'],
  // Chapter 2 — Cold Water (11). Port Marlowe; Mara free with an ankle monitor.
  [23, 2, "What's in the Bag?", 'Open the bag Mara smuggled out of prison'],
  [24, 2, 'Ambulance Chaser', 'Chase an ambulance carrying evidence'],
  [25, 2, 'Just Moved In', 'Move into the Port Marlowe motel'],
  [26, 2, "Girls' Trip", 'Mara takes a trip with the Real Dimez'],
  [27, 2, 'Moses', 'Meet Moses; steal a car to order'],
  [28, 2, 'Daily Driver', 'Win a daily driver in a street race'],
  [29, 2, 'Slam Dunk', 'Score at the Port Marlowe court'],
  [30, 2, 'Breakfast Run', 'Breakfast run that turns into a getaway'],
  [31, 2, 'Coffee Break', 'Meet a contact at a diner; the ankle monitor pings'],
  [32, 2, 'Afternoon Delight', 'A quiet afternoon; the monitor zone tightens'],
  [33, 2, 'Checking Out', 'Leave Port Marlowe for Azura Bay'],
  // Chapter 3 — Neon and Fast Money (26). Cole + Mara together in Azura Bay.
  [34, 3, 'Welcome to Azura Bay', 'Arrive in Azura Bay; first Azura Bay heist prep'],
  [35, 3, "Dealer's Choice", 'Choose a dealer to work with'],
  [36, 3, 'Meet the Marlowes', 'Meet Gus and Lori Marlowe in Azura Bay'],
  [37, 3, 'Dubious Provenance', 'Move goods with a dubious paper trail'],
  [38, 3, 'Mami Knows Best', 'Mara\'s mother figure gives a job'],
  [39, 3, 'South Solmaris Real Estate', 'Scout properties in South Solmaris'],
  [40, 3, 'Tyrone', 'Meet Tyrone, the drug fence'],
  [41, 3, 'Here, Kitty Kitty', 'A cat, a fence and a stolen necklace'],
  [42, 3, 'Car Service', 'Steal a luxury car for a client'],
  [43, 3, 'Top Billing', 'Get top billing at an Azura Bay club'],
  [44, 3, 'Boobie Time', 'Work for Boobie Ike at Jack of Hearts'],
  [45, 3, 'First Impressions', 'First impression on Dre\'Quan Priest'],
  [46, 3, 'Caught Slipping', 'Get caught slipping; escape a setup'],
  [47, 3, 'Crosstown Traffic', 'Crosstown getaway through Azura Bay'],
  [48, 3, 'Credit Check', 'Pass a credit check to rent a front business'],
  [49, 3, 'Steal the Zorruso for Randy', 'Steal the Pegassi Zorruso for Randy'],
  [50, 3, 'Azura Harbor Bank', 'Case the Azura Harbor Bank'],
  [51, 3, 'Security Expert', 'Hire a security expert for the bank job'],
  [52, 3, 'Ride or Die', 'A ride-or-die chase with Mara driving'],
  [53, 3, 'Company Property', 'Recover company property from a rival crew'],
  [54, 3, 'The Missing Link', 'Find the missing link in the cartel chain'],
  [55, 3, 'Safe Word', 'Learn the safe word for the cartel deal'],
  [56, 3, 'Cooties', 'A job with the Real Dimez goes sideways'],
  [57, 3, 'Bricked Up', 'A bricked-up stash house'],
  [58, 3, 'Hidden Charges', 'Hidden charges on a smuggled shipment'],
  [59, 3, 'The Cartel Heist', 'The big cartel heist — rob the cartel'],
  // Chapter 4 — Azura Bay, Baby (25). Build their own business around Coral Strand.
  [60, 4, 'Coral Strand', 'Set up around Coral Strand'],
  [61, 4, 'Another Life', 'Try a straight life for one day'],
  [62, 4, 'Company Cars', 'Build the company car fleet'],
  [63, 4, 'Lawyer Up', 'Hire a lawyer as the law closes in'],
  [64, 4, 'Party Hard', 'Party hard at NINE1NINE'],
  [65, 4, 'Heavy Lifting', 'Heavy lifting for the business'],
  [66, 4, 'Photo/Shoot', 'A photo shoot that is a front for a job'],
  [67, 4, 'Making Gainz', 'Gym session; strength training'],
  [68, 4, 'Watch It', 'Watch the business; surveillance on the crew'],
  [69, 4, 'Cash Injections', 'Cash injections to launder marked bills'],
  [70, 4, 'Amateur Hour', 'An amateur hour job with a new crew'],
  [71, 4, 'Dirty Work', 'Dirty work for an Azura Bay fixer'],
  [72, 4, 'Too Much Baggage', 'Too much baggage — literally'],
  [73, 4, 'Adventures in Babysitting', 'Babysit a contact\'s kid during a job'],
  [74, 4, 'Fresh Evidence', 'Fresh evidence surfaces; destroy it'],
  [75, 4, 'Power Play', 'A power play against a rival operation'],
  [76, 4, "Child's Play", 'A job that turns out to be child\'s play'],
  [77, 4, 'Headliners', 'Headline a show at The Vault'],
  [78, 4, 'Close Surveillance', 'Close surveillance by the authorities'],
  [79, 4, 'Delivery Method', 'Choose the delivery method for a big shipment'],
  [80, 4, 'Team Building', 'Team building with the crew'],
  [81, 4, 'Fully Catered', 'A fully catered event that hides a deal'],
  [82, 4, 'ABIA Takedown', 'Takedown at Azura Bay International Airport'],
  [83, 4, 'Sunset', 'Sunset on Coral Strand; the net closes'],
  [84, 4, 'Starting From Zero', 'Starting from zero after the fall'],
  // Chapter 5 — The Last Run (7). Endgame / climax.
  [85, 5, 'Bird in the Hand', 'A bird in the hand: secure the final score'],
  [86, 5, 'Taking Liberties', 'Take liberties with the plan'],
  [87, 5, 'AB Baby', 'AB Baby: the last big Azura Bay job'],
  [88, 5, 'Doggie Bag', 'Doggie bag: grab what you can on the way out'],
  [89, 5, 'Operation Savage Glory', 'Operation Savage Glory — the final operation'],
  [90, 5, 'Protective Custody', 'Protective custody: the choice is made'],
  [91, 5, 'The End of the Road', 'The End of the Road — the final mission'],
];

export const MISSIONS = RAW.map(([n, chapter, name, objective]) => ({
  id: 'm' + n, n, chapter, name, objective,
}));

export function missionsInChapter(chapter) {
  return MISSIONS.filter((m) => m.chapter === chapter);
}

export function missionById(id) {
  return MISSIONS.find((m) => m.id === id) || null;
}

export function completedCount(doneIds) {
  const done = new Set(doneIds || []);
  return MISSIONS.filter((m) => done.has(m.id)).length;
}

export function remainingCount(doneIds) {
  return MISSIONS.length - completedCount(doneIds);
}

// Story is done when all 91 missions are complete.
export function storyDone(doneIds) {
  return completedCount(doneIds) === MISSIONS.length;
}
