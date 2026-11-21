// activities.js — Free activities, mini-games & challenges, SPEC §19.
// Mini-games: Top Fun Drone Races, Bowling (Kolt & Associates Bowling Alley),
// Arcade Games, Scooter Bros App (register & manage up to 10 scooters).
// 32 exploration challenges / achievements (no mission spoilers).
export const MINI_GAMES = [
  { id: 'drones', name: 'Top Fun Drone Races', desc: 'RC drone races at points across the Leonida map.' },
  { id: 'bowling', name: 'Bowling', desc: 'Play bowling with your partner / friends at Kolt & Associates Bowling Alley.' },
  { id: 'arcade', name: 'Arcade Games', desc: 'Fully playable retro arcade machines at entertainment locations.' },
  { id: 'scooterbros', name: 'Scooter Bros App', desc: 'Register & manage a collection of up to 10 scooters / light motorbikes.' },
];

export const ACHIEVEMENTS = [
  { id: 'vice-price', name: 'Vice Got a Price!', desc: 'Collect all trophies.' },
  { id: 'long-road', name: 'A Long Road', desc: 'Reach 100% Completion.' },
  { id: 'cunning-stunts', name: 'Cunning Stunts', desc: 'Complete 250 Stunt challenges.' },
  { id: 'shootist', name: 'The Shootist', desc: 'Gold medal in all Shooting Range challenges.' },
  { id: 'deck', name: "Don't Touch My Deck", desc: 'Complete 3 Collectible Card sets.' },
  { id: 'wainker', name: 'You WAiNKer!', desc: 'WAiNK activity at 100 locations.' },
  { id: 'max-withdrawal', name: 'Maximum Withdrawal', desc: 'Rob 5 big bank vaults in the open world and escape.' },
  { id: 'master-none', name: 'Master of None', desc: 'Try every activity / mini-game type at least once.' },
  { id: 'top-fun', name: 'Top Fun', desc: 'Win a drone race at every location.' },
  { id: 'earn-cash', name: 'Earn Cash, Not Kudos', desc: 'Win 20 different races.' },
  { id: 'stick-fiddler', name: 'Stick Fiddler', desc: 'Finish one Arcade machine game.' },
  { id: 'positive', name: 'Positive Mental Attitude', desc: 'Meditate at all 18 meditation spots.' },
  { id: 'one-last', name: 'One Last Thing', desc: 'Complete 50 challenges.' },
  { id: 'hot-together', name: 'Hot Together', desc: 'Escape a 4-star police chase with your partner.' },
  { id: 'retail', name: 'Retail Therapy', desc: 'Rob 3 stores in a row with your partner without losing wanted stars.' },
  { id: 'whip-good', name: 'Whip It Good', desc: 'Find / drive 100 different vehicle types.' },
  { id: 'gunslinger', name: 'Gunslinger', desc: 'Incapacitate 5 enemies in one Combat Focus use.' },
  { id: 'catch-me', name: 'Catch Me If You Can', desc: 'Unscheduled departure / escape at VCIA airport.' },
  { id: 'tank', name: 'Challenging Tank', desc: 'Drive a combat tank (Rhino).' },
  { id: 'sneakthief', name: 'Sneakthief', desc: 'Rob a jewelry store undetected.' },
  { id: 'blitz', name: 'A Classic Blitz Play', desc: 'Rob an armored truck (Armored Truck) and escape.' },
  { id: 'goodtime', name: 'The Goodtime State', desc: 'Explore the entire Leonida map.' },
  { id: 'pest-control', name: 'Pest Control', desc: 'Rob each gang\'s illegal operation HQ.' },
  { id: 'beginning', name: 'In The Beginning…', desc: 'Enjoy a drink with a view at Ocean Beach.' },
  { id: 'capital', name: 'Capital Offense', desc: 'Crash out of a vehicle showroom in classic style.' },
  { id: 'bowling-ach', name: "Let's Go Bowling", desc: 'Play bowling at Kolt & Associates.' },
  { id: 'truth', name: 'The Truth Is Out There', desc: 'Find an unexplainable mysterious event.' },
  { id: 'ten-pin', name: 'Ten Pin', desc: 'Knock down an opponent with a melee drive-by from a vehicle.' },
  { id: 'dime', name: 'Dime on the Dollar', desc: 'Earn $250,000 from exchanging Marked Bills via a fence.' },
  { id: 'treat', name: 'Treat Yo Self', desc: 'Spend $100,000 total across all stores.' },
  { id: 'little-boxes', name: 'Little Boxes', desc: 'Buy all available garage properties.' },
  { id: 'on-the-spot', name: 'On the Spot', desc: 'Register 10 vehicles in the Scooter Bros app.' },
];

// Shooting Range medal points (Bronze 1, Silver 2, Gold 3).
export function medalPoints(medals) {
  const pts = { bronze: 1, silver: 2, gold: 3 };
  return (medals || []).reduce((n, m) => n + (pts[m] || 0), 0);
}

export function achievementById(id) {
  return ACHIEVEMENTS.find((a) => a.id === id) || null;
}
