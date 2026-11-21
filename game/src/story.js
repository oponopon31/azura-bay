// AZURA BAY — story missions (round 7 re-compose, written fresh under r7).
// 91 missions, 5 chapters, exact titles from SPEC.md Bab 1. Types:
// drive 58, steal 5, fetch 8, escape 3, tail 3, chase 2, timed 2,
// delivery 4, combat 4, heist 2. Coordinates are game x/z (gtabase/8,
// north = -z). Playable as Lucia (43) and Jason (48) — see `protagonist`.

export const CHAPTERS = [
  { n: 1, name: 'Just Like Paradise', from: 1, to: 22, zone: 'Leonida Keys' },
  { n: 2, name: 'Paradise Lost', from: 23, to: 33, zone: 'Port Gellhorn' },
  { n: 3, name: 'Tits, Ass, Drug Money', from: 34, to: 59, zone: 'Vice City' },
  { n: 4, name: 'Vice City, Baby', from: 60, to: 84, zone: 'Vice City' },
  { n: 5, name: 'Top of the World, Ma', from: 85, to: 91, zone: 'Leonida' },
];

// id, ch, title, type, zone, x, z, reward, contact, objective, dialogue beat
export const MISSIONS = [
  // ---- Chapter 1: Just Like Paradise (Leonida Keys) ----
  { id: 1, ch: 1, title: 'Prologue', type: 'drive', zone: 'Leonida Keys', x: -296, z: 749, reward: 500, contact: 'Brian Heder', obj: 'Drive Jason to the Keys stash house.', line: 'Lucia is inside. We start tonight.' },
  { id: 2, ch: 1, title: 'Gone Fishing', type: 'delivery', zone: 'Leonida Keys', x: -320, z: 720, reward: 800, contact: 'Cal Hampton', obj: 'Deliver the catch to the buyer at the marina.', line: 'Fish first, questions later.' },
  { id: 3, ch: 1, title: 'Gear Up', type: 'fetch', zone: 'Leonida Keys', x: -280, z: 760, reward: 600, contact: 'Brian Heder', obj: 'Collect the smuggling gear from the lockup.', line: 'No gear, no job.' },
  { id: 4, ch: 1, title: 'Just a Scratch', type: 'combat', zone: 'Leonida Keys', x: -310, z: 740, reward: 1200, contact: 'Brian Heder', obj: 'Deal with the rival crew at the docks.', line: 'They scratched the boat. Scratch back.' },
  { id: 5, ch: 1, title: 'Lab Fees', type: 'fetch', zone: 'Leonida Keys', x: -270, z: 730, reward: 900, contact: 'Cal Hampton', obj: 'Pick up the lab payment from the chemist.', line: 'Chemistry pays, if you collect.' },
  { id: 6, ch: 1, title: 'Unwanted Attention', type: 'tail', zone: 'Leonida Keys', x: -300, z: 770, reward: 1000, contact: 'Brian Heder', obj: 'Tail the Coast Guard spotter without being seen.', line: 'Eyes on him. Do not get made.' },
  { id: 7, ch: 1, title: 'Pipework', type: 'fetch', zone: 'Leonida Keys', x: -290, z: 755, reward: 700, contact: 'Cal Hampton', obj: 'Fix the pipeline under the stilt house.', line: 'Plumbing with consequences.' },
  { id: 8, ch: 1, title: 'Hey Arnold!', type: 'drive', zone: 'Leonida Keys', x: -330, z: 710, reward: 1100, contact: 'Brian Heder', obj: 'Pick up Arnold and drive him to the meet.', line: 'Arnold talks. We drive.' },
  { id: 9, ch: 1, title: 'Island Dreams', type: 'drive', zone: 'Leonida Keys', x: -340, z: 780, reward: 1300, contact: 'Lucia Caminos', obj: 'Scout the island drop point with Lucia.', line: 'Dream big. Drive careful.' },
  { id: 10, ch: 1, title: 'Feng Shui', type: 'delivery', zone: 'Leonida Keys', x: -260, z: 745, reward: 850, contact: 'Lori Heder', obj: 'Deliver the furniture to the Heder house.', line: 'Even smugglers need a nice couch.' },
  { id: 11, ch: 1, title: 'Coming Home', type: 'drive', zone: 'Leonida Keys', x: -296, z: 749, reward: 1000, contact: 'Brian Heder', obj: 'Bring Jason home after the run.', line: 'Home is where the stash is.' },
  { id: 12, ch: 1, title: 'Buck Me', type: 'drive', zone: 'Leonida Keys', x: -305, z: 735, reward: 1500, contact: 'Brian Heder', obj: 'Open the BuckMe account and deposit the take.', line: 'Clean money is good money.' },
  { id: 13, ch: 1, title: 'Clean Up After Donnie', type: 'fetch', zone: 'Leonida Keys', x: -315, z: 765, reward: 900, contact: 'Donnie Carter', obj: 'Clean up Donnie’s mess at the trailer.', line: 'Donnie. Again. Always Donnie.' },
  { id: 14, ch: 1, title: 'Down to Earth', type: 'drive', zone: 'Leonida Keys', x: -285, z: 725, reward: 1100, contact: 'Cal Hampton', obj: 'Drive the package down to the airfield.', line: 'Feet on the ground, eyes on the sky.' },
  { id: 15, ch: 1, title: 'Clear Skies', type: 'drive', zone: 'Leonida Keys', x: -275, z: 775, reward: 1200, contact: 'Brian Heder', obj: 'Clear the route for the night flight.', line: 'No clouds, no cops, no problems.' },
  { id: 16, ch: 1, title: 'Day Release', type: 'timed', zone: 'Leonida Keys', x: -296, z: 749, reward: 1600, contact: 'Lucia Caminos', obj: 'Reach Lucia’s day-release window in time.', line: 'The clock is the real guard.' },
  { id: 17, ch: 1, title: 'Swamped', type: 'chase', zone: 'Grassrivers', x: -410, z: 534, reward: 1800, contact: 'Cal Hampton', obj: 'Chase the airboat through the Grassrivers.', line: 'The swamp hides everything. Including us.' },
  { id: 18, ch: 1, title: 'Don Gone', type: 'combat', zone: 'Leonida Keys', x: -325, z: 715, reward: 2000, contact: 'Brian Heder', obj: 'Settle the Donnie debt once and for all.', line: 'Don is gone. The debt stays.' },
  { id: 19, ch: 1, title: 'Recalibration', type: 'drive', zone: 'Leonida Keys', x: -295, z: 755, reward: 1000, contact: 'Cal Hampton', obj: 'Recalibrate the radio after the storm.', line: 'Static is a bad alibi.' },
  { id: 20, ch: 1, title: 'Tourist Trap', type: 'drive', zone: 'Leonida Keys', x: -350, z: 700, reward: 1400, contact: 'Brian Heder', obj: 'Run the tourist-trap pickup without a scene.', line: 'Tourists pay. Smugglers collect.' },
  { id: 21, ch: 1, title: 'Home Sweet Home', type: 'drive', zone: 'Leonida Keys', x: -296, z: 749, reward: 1300, contact: 'Lucia Caminos', obj: 'Bring Lucia’s things to the safehouse.', line: 'A home, not a hideout. Almost.' },
  { id: 22, ch: 1, title: 'Discharge Time', type: 'escape', zone: 'Leonida Keys', x: -300, z: 740, reward: 2500, contact: 'Lucia Caminos', obj: 'Get Lucia out on discharge day.', line: 'She walks out. We drive away.' },
  // ---- Chapter 2: Paradise Lost (Port Gellhorn) ----
  { id: 23, ch: 2, title: "What's in the Bag?", type: 'fetch', zone: 'Port Gellhorn', x: -820, z: -533, reward: 1500, contact: 'Lucia Caminos', obj: 'Find out what is in the bag.', line: 'Every bag has a price.' },
  { id: 24, ch: 2, title: 'Ambulance Chaser', type: 'drive', zone: 'Port Gellhorn', x: -800, z: -520, reward: 1800, contact: 'Jason Duval', obj: 'Follow the ambulance to the clinic.', line: 'Where there is blood, there is money.' },
  { id: 25, ch: 2, title: 'Just Moved In', type: 'drive', zone: 'Port Gellhorn', x: -810, z: -540, reward: 1600, contact: 'Lucia Caminos', obj: 'Move Lucia into the Gellhorn safehouse.', line: 'New place. Same ankle monitor.' },
  { id: 26, ch: 2, title: "Girls' Trip", type: 'drive', zone: 'Port Gellhorn', x: -830, z: -510, reward: 2000, contact: 'Lucia Caminos', obj: 'Drive Lucia and Roxy to the coast.', line: 'A trip. A cover. A job.' },
  { id: 27, ch: 2, title: 'Moses', type: 'steal', zone: 'Port Gellhorn', x: -815, z: -525, reward: 2500, contact: 'Moses Watkins', obj: 'Steal the ordered car for Moses.', line: 'Moses orders. We deliver.' },
  { id: 28, ch: 2, title: 'Daily Driver', type: 'steal', zone: 'Port Gellhorn', x: -825, z: -545, reward: 2200, contact: 'Moses Watkins', obj: 'Lift a clean daily driver off the street.', line: 'Nobody misses a daily driver.' },
  { id: 29, ch: 2, title: 'Slam Dunk', type: 'drive', zone: 'Port Gellhorn', x: -805, z: -515, reward: 1900, contact: 'Jason Duval', obj: 'Win the streetball game at the courts.', line: 'Ball is life. Cash is better.' },
  { id: 30, ch: 2, title: 'Breakfast Run', type: 'fetch', zone: 'Port Gellhorn', x: -835, z: -535, reward: 1200, contact: 'Lucia Caminos', obj: 'Fetch breakfast before the monitor check.', line: 'Pancakes before parole.' },
  { id: 31, ch: 2, title: 'Coffee Break', type: 'fetch', zone: 'Port Gellhorn', x: -812, z: -528, reward: 1100, contact: 'Cal Hampton', obj: 'Pick up the coffee order and the drop.', line: 'Coffee. And cargo.' },
  { id: 32, ch: 2, title: 'Afternoon Delight', type: 'drive', zone: 'Port Gellhorn', x: -818, z: -548, reward: 1700, contact: 'Lucia Caminos', obj: 'Drive the afternoon route together.', line: 'The monitor watches. We behave.' },
  { id: 33, ch: 2, title: 'Checking Out', type: 'tail', zone: 'Port Gellhorn', x: -808, z: -522, reward: 2100, contact: 'Brian Heder', obj: 'Tail the checker out of Gellhorn.', line: 'Check out. Do not check in.' },
  // ---- Chapter 3: Tits, Ass, Drug Money (Vice City) ----
  { id: 34, ch: 3, title: 'Welcome to Vice City', type: 'drive', zone: 'Vice City', x: -28, z: -95, reward: 2500, contact: 'Boobie Ike', obj: 'Arrive in Vice City and meet Boobie.', line: 'Vice City, baby.' },
  { id: 35, ch: 3, title: "Dealer's Choice", type: 'drive', zone: 'Vice City', x: -40, z: -80, reward: 2800, contact: 'Boobie Ike', obj: 'Choose the dealer and close the deal.', line: 'The dealer chooses. We profit.' },
  { id: 36, ch: 3, title: 'Meet the Heders', type: 'drive', zone: 'Vice City', x: -20, z: -110, reward: 2400, contact: 'Brian Heder', obj: 'Meet the Heders at the club.', line: 'Family business. Literally.' },
  { id: 37, ch: 3, title: 'Dubious Provenance', type: 'drive', zone: 'Vice City', x: -50, z: -70, reward: 3000, contact: "Dre'Quan Priest", obj: 'Move the dubious goods to the studio.', line: 'Provenance is a story. Tell it well.' },
  { id: 38, ch: 3, title: 'Mami Knows Best', type: 'drive', zone: 'Vice City', x: -35, z: -100, reward: 2600, contact: 'Lucia Caminos', obj: 'Help Lucia’s mother with the move.', line: 'Mami always knows.' },
  { id: 39, ch: 3, title: 'South Leonida Real Estate', type: 'drive', zone: 'Vice City', x: -60, z: -90, reward: 3200, contact: 'Boobie Ike', obj: 'Scout the South Leonida property.', line: 'Location, location, larceny.' },
  { id: 40, ch: 3, title: 'Tyrone', type: 'drive', zone: 'Vice City', x: -45, z: -85, reward: 3500, contact: 'Tyrone', obj: 'Meet Tyrone, the top fence.', line: 'Tyrone pays best. Remember that.' },
  { id: 41, ch: 3, title: 'Here, Kitty Kitty', type: 'drive', zone: 'Vice City', x: -30, z: -105, reward: 2200, contact: 'Lucia Caminos', obj: 'Find the cat at the apartment.', line: 'Here, kitty kitty.' },
  { id: 42, ch: 3, title: 'Car Service', type: 'steal', zone: 'Vice City', x: -55, z: -75, reward: 4000, contact: 'Moses Watkins', obj: 'Steal the serviced car from the lot.', line: 'Serviced, detailed, stolen.' },
  { id: 43, ch: 3, title: 'Top Billing', type: 'delivery', zone: 'Vice City', x: -25, z: -90, reward: 3800, contact: 'Boobie Ike', obj: 'Deliver the headliner to the Jack of Hearts.', line: 'Top billing. Top dollar.' },
  { id: 44, ch: 3, title: 'Boobie Time', type: 'drive', zone: 'Vice City', x: -28, z: -95, reward: 3000, contact: 'Boobie Ike', obj: 'Spend the night on Boobie’s business.', line: 'Boobie time is money time.' },
  { id: 45, ch: 3, title: 'First Impressions', type: 'drive', zone: 'Vice City', x: -38, z: -98, reward: 2700, contact: "Dre'Quan Priest", obj: 'Make a first impression at Only Raw.', line: 'First impressions stick.' },
  { id: 46, ch: 3, title: 'Caught Slipping', type: 'drive', zone: 'Vice City', x: -48, z: -88, reward: 3300, contact: 'Jason Duval', obj: 'Get out before the crew catches you slipping.', line: 'Slip once, pay twice.' },
  { id: 47, ch: 3, title: 'Crosstown Traffic', type: 'chase', zone: 'Vice City', x: -15, z: -120, reward: 4200, contact: 'Raul Bautista', obj: 'Chase the mark across town.', line: 'Crosstown. Full throttle.' },
  { id: 48, ch: 3, title: 'Credit Check', type: 'drive', zone: 'Vice City', x: -33, z: -82, reward: 2900, contact: 'Boobie Ike', obj: 'Run a credit check on the buyer.', line: 'Credit is a kind of trust.' },
  { id: 49, ch: 3, title: 'Steal the Zorruso for Randy', type: 'steal', zone: 'Vice City', x: -42, z: -92, reward: 8000, contact: 'Randy', obj: 'Steal the Pegassi Zorrusso for Randy.', line: 'A Zorrusso. Mint condition. Randy pays.' },
  { id: 50, ch: 3, title: 'Sinfrontera National Bank', type: 'heist', zone: 'Vice City', x: -30, z: -100, reward: 15000, contact: 'Raul Bautista', obj: 'Rob the Sinfrontera National Bank.', line: 'The big one. No mistakes.' },
  { id: 51, ch: 3, title: 'Security Expert', type: 'drive', zone: 'Vice City', x: -36, z: -86, reward: 3600, contact: 'Raul Bautista', obj: 'Bring in the security expert.', line: 'Every vault has a weakness.' },
  { id: 52, ch: 3, title: 'Ride or Die', type: 'escape', zone: 'Vice City', x: -22, z: -108, reward: 5000, contact: 'Lucia Caminos', obj: 'Escape the police cordon together.', line: 'Ride or die. Together.' },
  { id: 53, ch: 3, title: 'Company Property', type: 'drive', zone: 'Vice City', x: -52, z: -78, reward: 3100, contact: 'Boobie Ike', obj: 'Recover the company property.', line: 'It belongs to the company. Us.' },
  { id: 54, ch: 3, title: 'The Missing Link', type: 'drive', zone: 'Vice City', x: -44, z: -94, reward: 3400, contact: "Dre'Quan Priest", obj: 'Find the missing link in the chain.', line: 'One link missing. Find it.' },
  { id: 55, ch: 3, title: 'Safe Word', type: 'drive', zone: 'Vice City', x: -26, z: -102, reward: 2800, contact: 'Lucia Caminos', obj: 'Learn the safe word for the job.', line: 'Say the word. Or else.' },
  { id: 56, ch: 3, title: 'Cooties', type: 'drive', zone: 'Vice City', x: -46, z: -80, reward: 2600, contact: 'Jason Duval', obj: 'Deal with the cooties at the motel.', line: 'Cooties. Seriously.' },
  { id: 57, ch: 3, title: 'Bricked Up', type: 'drive', zone: 'Vice City', x: -32, z: -96, reward: 3700, contact: 'Raul Bautista', obj: 'Move the bricked-up product.', line: 'Bricked up and ready.' },
  { id: 58, ch: 3, title: 'Hidden Charges', type: 'drive', zone: 'Vice City', x: -50, z: -84, reward: 3900, contact: 'Boobie Ike', obj: 'Find the hidden charges on the deal.', line: 'Read the fine print.' },
  { id: 59, ch: 3, title: 'The Cartel Heist', type: 'heist', zone: 'Vice City', x: -28, z: -95, reward: 20000, contact: 'Raul Bautista', obj: 'Rob the cartel stash house.', line: 'The cartel. The heist. The end of Chapter 3.' },
  // ---- Chapter 4: Vice City, Baby (Ocean Beach / Vice City) ----
  { id: 60, ch: 4, title: 'Ocean Beach', type: 'drive', zone: 'Vice Beach', x: 191, z: -112, reward: 4000, contact: 'Lucia Caminos', obj: 'Set up the Ocean Beach operation.', line: 'Ocean Beach. Our beach now.' },
  { id: 61, ch: 4, title: 'Another Life', type: 'drive', zone: 'Vice Beach', x: 180, z: -120, reward: 4200, contact: 'Jason Duval', obj: 'Start the new life at the beach.', line: 'Another life. Same us.' },
  { id: 62, ch: 4, title: 'Company Cars', type: 'steal', zone: 'Vice Beach', x: 200, z: -100, reward: 6000, contact: 'Moses Watkins', obj: 'Steal the company cars for the fleet.', line: 'Company cars. Company rules.' },
  { id: 63, ch: 4, title: 'Lawyer Up', type: 'drive', zone: 'Vice City', x: -28, z: -95, reward: 4500, contact: 'Boobie Ike', obj: 'Get a lawyer before the hearing.', line: 'Lawyer up. Talk later.' },
  { id: 64, ch: 4, title: 'Party Hard', type: 'drive', zone: 'Vice Beach', x: 195, z: -115, reward: 4800, contact: 'Boobie Ike', obj: 'Party hard at the Vault.', line: 'Party hard. Work harder.' },
  { id: 65, ch: 4, title: 'Heavy Lifting', type: 'drive', zone: 'Vice City', x: -40, z: -80, reward: 5200, contact: 'Raul Bautista', obj: 'Move the heavy product.', line: 'Heavy lifting. Heavy pay.' },
  { id: 66, ch: 4, title: 'Photo/Shoot', type: 'drive', zone: 'Vice Beach', x: 185, z: -108, reward: 4400, contact: 'Lucia Caminos', obj: 'Do the photo shoot at the beach.', line: 'Smile. Then shoot.' },
  { id: 67, ch: 4, title: 'Making Gainz', type: 'drive', zone: 'Vice City', x: -35, z: -90, reward: 4600, contact: 'Jason Duval', obj: 'Hit the gym for the crew.', line: 'Gainz. All kinds.' },
  { id: 68, ch: 4, title: 'Watch It', type: 'drive', zone: 'Vice City', x: -45, z: -100, reward: 4900, contact: 'Cal Hampton', obj: 'Watch the surveillance team.', line: 'Watch it. Watch everything.' },
  { id: 69, ch: 4, title: 'Cash Injections', type: 'drive', zone: 'Vice City', x: -30, z: -85, reward: 5500, contact: 'Boobie Ike', obj: 'Inject cash into the business.', line: 'Cash in. Cash out. Cash everywhere.' },
  { id: 70, ch: 4, title: 'Amateur Hour', type: 'drive', zone: 'Vice Beach', x: 190, z: -118, reward: 4300, contact: 'Jason Duval', obj: 'Handle the amateurs at the beach.', line: 'Amateur hour is over.' },
  { id: 71, ch: 4, title: 'Dirty Work', type: 'drive', zone: 'Vice City', x: -38, z: -92, reward: 5800, contact: 'Raul Bautista', obj: 'Do the dirty work for the crew.', line: 'Dirty work. Clean pay.' },
  { id: 72, ch: 4, title: 'Too Much Baggage', type: 'drive', zone: 'Vice City', x: -42, z: -88, reward: 5100, contact: 'Lucia Caminos', obj: 'Move the baggage without a scene.', line: 'Too much baggage. Literally.' },
  { id: 73, ch: 4, title: 'Adventures in Babysitting', type: 'drive', zone: 'Vice Beach', x: 198, z: -105, reward: 4700, contact: 'Lucia Caminos', obj: 'Babysit the contact’s kid during the deal.', line: 'Babysitting. With a gun.' },
  { id: 74, ch: 4, title: 'Fresh Evidence', type: 'drive', zone: 'Vice City', x: -33, z: -97, reward: 6000, contact: 'Captain Aldo Méndez', obj: 'Deal with the fresh evidence.', line: 'Evidence is a problem. Solve it.' },
  { id: 75, ch: 4, title: 'Power Play', type: 'drive', zone: 'Vice City', x: -28, z: -95, reward: 6500, contact: 'Boobie Ike', obj: 'Make the power play for the club.', line: 'Power is a play. Make it.' },
  { id: 76, ch: 4, title: "Child's Play", type: 'drive', zone: 'Vice Beach', x: 188, z: -110, reward: 4900, contact: 'Jason Duval', obj: 'Handle the kid who saw too much.', line: 'Child’s play. Adult consequences.' },
  { id: 77, ch: 4, title: 'Headliners', type: 'drive', zone: 'Vice City', x: -36, z: -82, reward: 6200, contact: "Dre'Quan Priest", obj: 'Book the headliners for the show.', line: 'Headliners. Headlines. Headaches.' },
  { id: 78, ch: 4, title: 'Close Surveillance', type: 'tail', zone: 'Vice City', x: -44, z: -94, reward: 6800, contact: 'Cal Hampton', obj: 'Survive the close surveillance.', line: 'They watch. We watch back.' },
  { id: 79, ch: 4, title: 'Delivery Method', type: 'timed', zone: 'Vice City', x: -30, z: -100, reward: 7000, contact: 'Raul Bautista', obj: 'Deliver by the method, on time.', line: 'Method matters. Time matters more.' },
  { id: 80, ch: 4, title: 'Team Building', type: 'drive', zone: 'Vice Beach', x: 192, z: -116, reward: 5400, contact: 'Boobie Ike', obj: 'Build the team at the beach.', line: 'Team building. Trust building.' },
  { id: 81, ch: 4, title: 'Fully Catered', type: 'delivery', zone: 'Vice City', x: -34, z: -86, reward: 5900, contact: 'Lucia Caminos', obj: 'Cater the meet, fully.', line: 'Fully catered. Fully loaded.' },
  { id: 82, ch: 4, title: 'VCIA Takedown', type: 'combat', zone: 'VCIA', x: -265, z: 83, reward: 12000, contact: 'Raul Bautista', obj: 'Take down the VCIA shipment.', line: 'VCIA. No witnesses.' },
  { id: 83, ch: 4, title: 'Sunset', type: 'drive', zone: 'Vice Beach', x: 191, z: -112, reward: 6600, contact: 'Lucia Caminos', obj: 'Watch the sunset before the end.', line: 'Sunset. Then the storm.' },
  { id: 84, ch: 4, title: 'Starting From Zero', type: 'drive', zone: 'Vice City', x: -28, z: -95, reward: 7000, contact: 'Jason Duval', obj: 'Start from zero, together.', line: 'Zero. And everything after.' },
  // ---- Chapter 5: Top of the World, Ma (endgame) ----
  { id: 85, ch: 5, title: 'Bird in the Hand', type: 'drive', zone: 'Vice City', x: -28, z: -95, reward: 8000, contact: 'Raul Bautista', obj: 'Secure the bird in the hand.', line: 'A bird in the hand.' },
  { id: 86, ch: 5, title: 'Taking Liberties', type: 'drive', zone: 'Vice City', x: -35, z: -90, reward: 8500, contact: 'Boobie Ike', obj: 'Take liberties with the plan.', line: 'Liberties. Taken.' },
  { id: 87, ch: 5, title: 'VC Baby', type: 'drive', zone: 'Vice Beach', x: 191, z: -112, reward: 9000, contact: 'Lucia Caminos', obj: 'One last VC run, baby.', line: 'VC baby. One last time.' },
  { id: 88, ch: 5, title: 'Doggie Bag', type: 'fetch', zone: 'Vice City', x: -40, z: -85, reward: 9500, contact: 'Jason Duval', obj: 'Pack the doggie bag for the road.', line: 'Take it to go.' },
  { id: 89, ch: 5, title: 'Operation Savage Glory', type: 'combat', zone: 'Mount Kalaga', x: -425, z: -805, reward: 15000, contact: 'Raul Bautista', obj: 'Execute Operation Savage Glory.', line: 'Savage glory. No retreat.' },
  { id: 90, ch: 5, title: 'Protective Custody', type: 'drive', zone: 'Vice City', x: -28, z: -95, reward: 10000, contact: 'Captain Aldo Méndez', obj: 'Get into protective custody.', line: 'Custody. Or freedom. Choose.' },
  { id: 91, ch: 5, title: 'The End of the Road', type: 'escape', zone: 'Vice City', x: -28, z: -95, reward: 20000, contact: 'Lucia Caminos', obj: 'The end of the road. Choose the ending.', line: 'Top of the world, Ma.' },
];

// Protagonist per mission: Lucia 43, Jason 48 (SPEC: Lucia leads the plan,
// Jason executes; chapters alternate). Deterministic by id.
export function protagonist(m) {
  // Lucia leads odd chapters' planning beats and Ch2 (her release arc);
  // Jason leads the field beats. Fixed split: 43 Lucia / 48 Jason.
  const luciaIds = new Set([1, 3, 6, 9, 11, 12, 16, 21, 22, 23, 25, 26, 30, 31, 32, 38, 41, 43, 52, 55, 60, 61, 66, 72, 73, 81, 83, 87, 91, 2, 5, 10, 13, 15, 19, 24, 28, 35, 40, 48, 53, 58, 64]);
  return luciaIds.has(m.id) ? 'Lucia' : 'Jason';
}

export function missionsInChapter(n) {
  return MISSIONS.filter((m) => m.ch === n);
}
export function chapterReward(n) {
  return missionsInChapter(n).reduce((s, m) => s + m.reward, 0);
}
export function missionById(id) {
  return MISSIONS.find((m) => m.id === id) || null;
}
export function totalMissions() { return MISSIONS.length; }
