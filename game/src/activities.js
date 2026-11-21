// activities.js — Free-roam activities, mini-games & the 32 achievements
// (SPEC Bab 19 + Bab 18/20). Drone races (Top Fun), bowling (Kolt &
// Associates), arcade machines, VR mini-games, the shooting range
// (Bronze/Silver/Gold medals — the cheat unlocks), the workout counter,
// and the 32 named achievements with their unlock checks.
// Achievement names are the spec's exact list (Bab 19).

export const ACHIEVEMENTS = [
  { id: 'viceprice', name: 'Vice Got a Price!', desc: 'Collect every trophy.', check: (G) => (G.stats.achievements || 0) >= 32 },
  { id: 'longroad', name: 'A Long Road', desc: 'Reach 100% Completion.', check: (G) => G.collectibles && G.collectibles.percent() >= 100 },
  { id: 'cunning', name: 'Cunning Stunts', desc: 'Complete 250 Stunt challenges.', check: (G) => G.stunts && G.stunts.stuntTotal() >= 250 },
  { id: 'shootist', name: 'The Shootist', desc: 'Gold medals in every Shooting Range challenge.', check: (G) => (G.stats.rangeGold || 0) >= 5 },
  { id: 'deck', name: "Don't Touch My Deck", desc: 'Complete 3 Card Collection sets.', check: (G) => G.collectibles && G.collectibles.completedSets() >= 3 },
  { id: 'wainker', name: 'You WAiNKer!', desc: 'WAiNK activity at 100 locations.', check: (G) => G.collectibles && (G.collectibles.foundCount('wainkLandmarks') + G.collectibles.foundCount('wainkCuriosities') + G.collectibles.foundCount('wainkSculptures')) >= 89 },
  { id: 'maxwithdrawal', name: 'Maximum Withdrawal', desc: 'Rob 5 big bank vaults in the open world and escape.', check: (G) => (G.stats.bigVaults || 0) >= 5 },
  { id: 'masternone', name: 'Master of None', desc: 'Try every activity / mini-game type at least once.', check: (G) => (G.stats.activitiesTried || 0) >= 8 },
  { id: 'topfun', name: 'Top Fun', desc: 'Win a drone race at every location.', check: (G) => (G.stats.droneWins || 0) >= 5 },
  { id: 'earncash', name: 'Earn Cash, Not Kudos', desc: 'Win 20 different races.', check: (G) => (G.stats.racesWon || 0) >= 20 },
  { id: 'stickfiddler', name: 'Stick Fiddler', desc: 'Finish one Arcade machine game.', check: (G) => (G.stats.arcadeWins || 0) >= 1 },
  { id: 'positivemental', name: 'Positive Mental Attitude', desc: 'Meditate at all 18 meditation spots.', check: (G) => G.collectibles && G.collectibles.foundCount('meditation') >= 18 },
  { id: 'onelastthing', name: 'One Last Thing', desc: 'Complete 50 challenges.', check: (G) => (G.stats.challengesDone || 0) >= 50 },
  { id: 'hottogether', name: 'Hot Together', desc: 'Escape a 4-star police chase with your partner.', check: (G) => (G.stats.escaped4StarDuo || 0) >= 1 },
  { id: 'retailtherapy', name: 'Retail Therapy', desc: 'Rob 3 stores in a row with your partner without losing wanted stars.', check: (G) => (G.stats.retailStreak || 0) >= 3 },
  { id: 'whipitgood', name: 'Whip It Good', desc: 'Find / drive 100 different vehicle types.', check: (G) => (G.stats.vehiclesDriven || 0) >= 100 },
  { id: 'gunslinger', name: 'Gunslinger', desc: 'Incapacitate 5 enemies in one Combat Focus use.', check: (G) => (G.stats.focusStuns || 0) >= 5 },
  { id: 'catchme', name: 'Catch Me If You Can', desc: 'An unscheduled departure / escape at VCIA airport.', check: (G) => (G.stats.vciaEscape || 0) >= 1 },
  { id: 'tank', name: 'Challenging Tank', desc: 'Drive a battle tank (Rhino).', check: (G) => (G.stats.tankDriven || 0) >= 1 },
  { id: 'sneakthief', name: 'Sneakthief', desc: 'Rob a jewelry store without being seen.', check: (G) => (G.stats.sneakJewelry || 0) >= 1 },
  { id: 'blitz', name: 'A Classic Blitz Play', desc: 'Rob an armored truck and escape.', check: (G) => (G.stats.armoredRobbed || 0) >= 1 },
  { id: 'goodtime', name: 'The Goodtime State', desc: 'Explore the whole Leonida map.', check: (G) => (G.stats.mapExplored || 0) >= 100 },
  { id: 'pestcontrol', name: 'Pest Control', desc: 'Rob each gang\'s illegal operation HQ.', check: (G) => (G.stats.gangHQs || 0) >= 3 },
  { id: 'beginning', name: 'In The Beginning…', desc: 'Enjoy a drink with the view at Ocean Beach.', check: (G) => (G.stats.beachDrink || 0) >= 1 },
  { id: 'capital', name: 'Capital Offense', desc: 'Crash out of a vehicle showroom, classic style.', check: (G) => (G.stats.showroomCrash || 0) >= 1 },
  { id: 'bowling', name: "Let's Go Bowling", desc: 'Play bowling at Kolt & Associates.', check: (G) => (G.stats.bowlingGames || 0) >= 1 },
  { id: 'truth', name: 'The Truth Is Out There', desc: 'Find an unexplainable mystery event.', check: (G) => (G.stats.mysteries || 0) >= 1 },
  { id: 'tenpin', name: 'Ten Pin', desc: 'Knock an enemy down with a drive-by melee attack from a vehicle.', check: (G) => (G.stats.drivebyMelee || 0) >= 1 },
  { id: 'dime', name: 'Dime on the Dollar', desc: 'Earn $250,000 from trading Marked Bills through a fence.', check: (G) => (G.stats.markedWashed || 0) >= 250000 },
  { id: 'treatyoself', name: 'Treat Yo Self', desc: 'Spend $100,000 total across all stores.', check: (G) => (G.stats.spentAtGunshops || 0) >= 100000 },
  { id: 'littleboxes', name: 'Little Boxes', desc: 'Buy every available garage property.', check: (G) => G.properties && G.properties.ownedGarages.length >= 8 },
  { id: 'onthespot', name: 'On the Spot', desc: 'Register 10 vehicles in the Scooter Bros app.', check: (G) => G.phone && G.phone.scooters.length >= 10 },
];

export const DRONE_RACE_SPOTS = [
  { id: 'd1', name: 'Vice Beach Dunes', x: 300, z: 320 },
  { id: 'd2', name: 'Grassrivers Swamp', x: -280, z: -240 },
  { id: 'd3', name: 'Mount Kalaga Ridge', x: -200, z: 300 },
  { id: 'd4', name: 'Port Gellhorn Docks', x: 320, z: -80 },
  { id: 'd5', name: 'Vice City Rooftops', x: 0, z: 0 },
];

export function createActivities(G) {
  const A = {
    achievements: ACHIEVEMENTS,
    unlocked: {}, // id -> true
    // ---- Shooting range: Bronze / Silver / Gold medals ----
    // A range session: 10 targets, scored by hits. Medals gate the
    // Max Ammo / Infinite Ammo / No Reload cheats (Bab 3).
    rangeSession(hits) {
      const medal = hits >= 9 ? 'gold' : hits >= 7 ? 'silver' : hits >= 5 ? 'bronze' : null;
      if (!medal) return { ok: false, medal: null, hits };
      G.stats.rangeMedals = G.stats.rangeMedals || { bronze: 0, silver: 0, gold: 0 };
      G.stats.rangeMedals[medal]++;
      if (medal === 'gold') G.stats.rangeGold = (G.stats.rangeGold || 0) + 1;
      G.stats.challengesDone = (G.stats.challengesDone || 0) + 1;
      G.hud.toast(`Shooting Range: ${hits}/10 — ${medal.toUpperCase()} medal!`);
      return { ok: true, medal, hits };
    },
    // ---- Drone races (Top Fun) ----
    droneRace(spotId, won) {
      if (won) {
        G.stats.droneWins = (G.stats.droneWins || 0) + 1;
        G.stats.racesWon = (G.stats.racesWon || 0) + 1;
        G.money += 500;
        G.hud.toast(`Drone race won at ${spotId}! +$500.`);
      }
      this.noteActivity('drone');
      return won;
    },
    // ---- Bowling (Kolt & Associates) ----
    bowling(score) {
      G.stats.bowlingGames = (G.stats.bowlingGames || 0) + 1;
      G.money += Math.max(0, score);
      G.hud.toast(`Bowling: ${score} pins — +$${Math.max(0, score)}.`);
      this.noteActivity('bowling');
      return score;
    },
    // ---- Arcade ----
    arcade(game) {
      G.stats.arcadeWins = (G.stats.arcadeWins || 0) + 1;
      G.hud.toast(`Arcade: finished a game of ${game}.`);
      this.noteActivity('arcade');
      return true;
    },
    // ---- VR mini-game ----
    vrGame(game) {
      G.hud.toast(`VR: played ${game}.`);
      this.noteActivity('vr');
      return true;
    },
    // ---- Workout counter (Bab 3: 100x Workout unlocks Body Armor) ----
    workout() {
      G.stats.workouts = (G.stats.workouts || 0) + 1;
      if (G.attributes) G.attributes.gymSession(G.player.who, 'bench press');
      return G.stats.workouts;
    },
    noteActivity(kind) {
      G.stats.activitiesTriedSet = G.stats.activitiesTriedSet || {};
      if (!G.stats.activitiesTriedSet[kind]) {
        G.stats.activitiesTriedSet[kind] = true;
        G.stats.activitiesTried = (G.stats.activitiesTried || 0) + 1;
      }
    },
    // ---- Achievement checks (run after any notable event) ----
    checkAchievements() {
      for (const a of ACHIEVEMENTS) {
        if (this.unlocked[a.id]) continue;
        let ok = false;
        try { ok = a.check(G); } catch (e) { ok = false; }
        if (ok) {
          this.unlocked[a.id] = true;
          G.stats.achievements = (G.stats.achievements || 0) + 1;
          G.hud.toast(`🏆 Achievement: ${a.name} — ${a.desc}`);
          G.audio.pickup();
        }
      }
    },
    unlockedCount() { return Object.keys(this.unlocked).length; },
    // ---- Save / load (save.js reads this as G.achievements) ----
    serialize() {
      return { unlocked: this.unlocked };
    },
    restore(data) {
      if (data.unlocked) this.unlocked = data.unlocked;
    },
  };
  return A;
}
