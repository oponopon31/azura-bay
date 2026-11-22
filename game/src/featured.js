// featured.js — The 8 deep featured story missions.
// The 91-mission data in missions.js stays under the hood; these 8 are the
// playable spine the player actually experiences: objectives with stages,
// timers, crew abilities, and NPC dialogue with portraits. Each mission maps
// to a chapter and to missions in the 91-mission list (missionIds).
export const FEATURED_MISSIONS = [
  {
    id: 'f1', title: 'Salt Air Run', chapter: 1, missionIds: [1, 2, 6],
    area: 'Solmaris Keys', timer: 240,
    objective: 'Run the Keys smuggling route — reach the Pelican Key dock before the Coast Guard closes in.',
    stages: ['Meet Gus at the Key Lento dock', 'Load the boat and cast off', 'Outrun the Coast Guard cutter', 'Deliver the cargo at Pelican Key'],
    crew: [{ name: 'Gus Marlowe', ability: 'Smuggler — cuts heat in half after any delivery' }],
    dialogue: [
      { speaker: 'Gus Marlowe', initials: 'GM', color: '#8a6d3b', line: 'Keys water is ours tonight, Cole. Keep her under forty knots till the point.' },
      { speaker: 'Mara Solano', initials: 'MS', color: '#c94f7c', line: 'Coast Guard cutter on the radio. Gus, tell me you have a way around it.' },
      { speaker: 'Gus Marlowe', initials: 'GM', color: '#8a6d3b', line: 'Through the Reedmarsh, low and quiet. They never follow us in there.' },
    ],
    reward: 5000,
  },
  {
    id: 'f2', title: 'Day Release', chapter: 1, missionIds: [11, 16, 22],
    area: 'Azura Bay', timer: 300,
    objective: 'Pick Mara up on day release and get her back before the ankle monitor pings.',
    stages: ['Reach the penitentiary gate', 'Lose the tail on Coral Drive', 'Make the check-in before the monitor pings'],
    crew: [{ name: 'Mara Solano', ability: 'Planner — marks every escape route on the map' }],
    dialogue: [
      { speaker: 'Mara Solano', initials: 'MS', color: '#c94f7c', line: 'Two years in there, Cole. Drive like you mean it — I am not going back.' },
      { speaker: 'Cole Reyes', initials: 'CR', color: '#2a6db0', line: 'Monitor gives us forty minutes. Coral Drive, then the back streets.' },
    ],
    reward: 4000,
  },
  {
    id: 'f3', title: 'Marlowe Motel', chapter: 2, missionIds: [23, 25, 33],
    area: 'Port Marlowe', timer: 300,
    objective: 'Open the bag Mara smuggled out, then move the crew into the Port Marlowe motel.',
    stages: ['Open the bag — what did she bring out?', 'Sweep the motel for watchers', 'Set up the new base'],
    crew: [{ name: 'Cal Hampton', ability: 'Watcher — hears police radio before dispatch airs it' }],
    dialogue: [
      { speaker: 'Cal Hampton', initials: 'CH', color: '#5b8c5a', line: 'Motel has ears, Cole. I swept three rooms already. We are clean.' },
      { speaker: 'Mara Solano', initials: 'MS', color: '#c94f7c', line: 'The bag is the whole plan. Open it slow — it took me two years to fill.' },
    ],
    reward: 8000,
  },
  {
    id: 'f4', title: 'First Impressions', chapter: 3, missionIds: [45, 44, 42],
    area: 'Azura Bay', timer: 360,
    objective: 'Impress Dario Quinn — steal the target car off Coral Drive in under six minutes.',
    stages: ['Scout the target car on Coral Drive', 'Lift it without tripping the alarm', 'Deliver it to the Coral Strand garage'],
    crew: [{ name: 'Dario Quinn', ability: 'Fixer — every car delivered clean pays double' }],
    dialogue: [
      { speaker: 'Dario Quinn', initials: 'DQ', color: '#7a5fb0', line: 'Six minutes, Cole. That car is worth more than this whole street.' },
      { speaker: 'Cole Reyes', initials: 'CR', color: '#2a6db0', line: 'Alarm, tracker, and a valet with a radio. I will take the valet first.' },
    ],
    reward: 12000,
  },
  {
    id: 'f5', title: 'Harbor Bank', chapter: 3, missionIds: [55, 56, 57],
    area: 'Azura Bay', timer: 420,
    objective: 'Hit the Azura Harbor bank with Rico — crack the vault, load the bags, reach the getaway car.',
    stages: ['Rico cracks the vault door', 'Load four bags of marked bills', 'Hold the lobby while Mara drives the getaway car around', 'Escape through the Mural Yard'],
    crew: [
      { name: 'Rico Vega', ability: 'Cracker — vault doors open twice as fast' },
      { name: 'Mara Solano', ability: 'Planner — marks every escape route on the map' },
    ],
    dialogue: [
      { speaker: 'Rico Vega', initials: 'RV', color: '#b03a2e', line: 'Vault door is old. Ninety seconds and it is ours. Nobody moves till I say.' },
      { speaker: 'Mara Solano', initials: 'MS', color: '#c94f7c', line: 'Getaway car is on Coral Drive. Four bags, then we are gone.' },
      { speaker: 'Rico Vega', initials: 'RV', color: '#b03a2e', line: 'ABPD is already rolling. When the sirens get loud, we go through the Mural Yard.' },
    ],
    reward: 35000,
  },
  {
    id: 'f6', title: 'Neon Nights', chapter: 4, missionIds: [60, 61, 62],
    area: 'Coral Strand', timer: 300,
    objective: 'Get top billing at the Marlin Club — win the street race down Coral Drive first.',
    stages: ['Enter the Coral Drive street race', 'Win the race — three laps, no shortcuts', 'Take the stage at the Marlin Club'],
    crew: [{ name: 'Luxe', ability: 'Hype — race winnings pay 25% more after a win' }],
    dialogue: [
      { speaker: 'Luxe', initials: 'LX', color: '#d4a017', line: 'Whole bay is watching this race, Cole. Win it and the club is ours tonight.' },
      { speaker: 'Cole Reyes', initials: 'CR', color: '#2a6db0', line: 'Three laps of Coral Drive. I have done this road a hundred times.' },
    ],
    reward: 15000,
  },
  {
    id: 'f7', title: 'The Long Con', chapter: 4, missionIds: [70, 71, 72],
    area: 'Azura Bay', timer: 360,
    objective: 'Run the crew business out of the Coral Strand garage while ABPD surveillance closes in.',
    stages: ['Move the product through the garage', 'Spot the ABPD surveillance van', 'Burn the van tail without starting a war'],
    crew: [{ name: 'Marlon Keene', ability: 'Kingpin — garage income doubles while he runs the books' }],
    dialogue: [
      { speaker: 'Marlon Keene', initials: 'MK', color: '#2e86ab', line: 'Garage pays for itself if we stay quiet. Quiet, Cole. That is the whole job.' },
      { speaker: 'Mara Solano', initials: 'MS', color: '#c94f7c', line: 'Surveillance van, third night running. We burn it tonight or we move.' },
    ],
    reward: 20000,
  },
  {
    id: 'f8', title: 'Top of the Bay', chapter: 5, missionIds: [85, 88, 91],
    area: 'Azura Bay', timer: 480,
    objective: 'The endgame — one last run across the bay, outrun the full ABPD manhunt, and get out clean.',
    stages: ['Reach the Azura Harbor bridge', 'Break through the roadblock', 'Outrun the air unit', 'Reach the boat at Pelican Key'],
    crew: [
      { name: 'Mara Solano', ability: 'Planner — marks every escape route on the map' },
      { name: 'Rico Vega', ability: 'Cracker — vault doors open twice as fast' },
      { name: 'Gus Marlowe', ability: 'Smuggler — cuts heat in half after any delivery' },
    ],
    dialogue: [
      { speaker: 'Mara Solano', initials: 'MS', color: '#c94f7c', line: 'This is it, Cole. Everything we built, one road, one bridge, one boat.' },
      { speaker: 'Cole Reyes', initials: 'CR', color: '#2a6db0', line: 'Then we drive. And whatever is on that bridge, we drive through it.' },
    ],
    reward: 50000,
  },
];

export function featuredById(id) {
  return FEATURED_MISSIONS.find((m) => m.id === id) || null;
}

// ABPD dispatch units: named, with a tactic each. Distances are computed live
// in main.js from unit positions; tactics follow the wanted level.
export const DISPATCH_UNITS = [
  { id: 'u7', name: 'Unit 7 "Harbor"', kind: 'patrol', tactic: 'RAMMING' },
  { id: 'u12', name: 'Unit 12 "Coral"', kind: 'patrol', tactic: 'RAMMING' },
  { id: 'u21', name: 'Unit 21 "Mural"', kind: 'patrol', tactic: 'ROADBLOCK' },
  { id: 'u33', name: 'Unit 33 "Strand"', kind: 'patrol', tactic: 'SPOTLIGHT' },
  { id: 'air1', name: 'Air 1 "Falcon"', kind: 'air', tactic: 'AIR UNIT' },
  { id: 'u40', name: 'Unit 40 "Bridge"', kind: 'patrol', tactic: 'ROADBLOCK' },
];
