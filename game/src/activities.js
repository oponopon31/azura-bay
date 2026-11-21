// activities.js — Free-roam activities, mini-games & the 32 achievements
// (SPEC Bab 19 + Bab 18/20). Drone races (Top Fun), bowling (Kolt &
// Associates), arcade machines, VR mini-games, the shooting range
// (Bronze/Silver/Gold medals — the cheat unlocks), the workout counter,
// and the 32 named achievements with their unlock checks.
// Achievement names are the spec's exact list (Bab 19). The range gate:
// Gold in all 5 range challenges (rangeGold >= 5) is the 'shootist' check
// and the cheat unlock.
// Round 5: table rows re-expressed one field per line. Values unchanged.

export const ACHIEVEMENTS = [
  {
    id: 'viceprice',
    name: 'Vice Got a Price!',
    desc: 'Collect every trophy.',
    check: (Game) => (Game.stats.achievements || 0) >= 32,
  },
  {
    id: 'longroad',
    name: 'A Long Road',
    desc: 'Reach 100% Completion.',
    check: (Game) => Game.collectibles && Game.collectibles.percent() >= 100,
  },
  {
    id: 'cunning',
    name: 'Cunning Stunts',
    desc: 'Complete 250 Stunt challenges.',
    check: (Game) => Game.stunts && Game.stunts.stuntTotal() >= 250,
  },
  {
    id: 'shootist',
    name: 'The Shootist',
    desc: 'Gold medals in every Shooting Range challenge.',
    check: (Game) => (Game.stats.rangeGold || 0) >= 5,
  },
  {
    id: 'deck',
    name: "Don't Touch My Deck",
    desc: 'Complete 3 Card Collection sets.',
    check: (Game) => Game.collectibles && Game.collectibles.completedSets() >= 3,
  },
  {
    id: 'wainker',
    name: 'You WAiNKer!',
    desc: 'WAiNK activity at 100 locations.',
    check: (Game) => Game.collectibles && (Game.collectibles.foundCount('wainkLandmarks') + Game.collectibles.foundCount('wainkCuriosities') + Game.collectibles.foundCount('wainkSculptures')) >= 89,
  },
  {
    id: 'maxwithdrawal',
    name: 'Maximum Withdrawal',
    desc: 'Rob 5 big bank vaults in the open world and escape.',
    check: (Game) => (Game.stats.bigVaults || 0) >= 5,
  },
  {
    id: 'masternone',
    name: 'Master of None',
    desc: 'Try every activity / mini-game type at least once.',
    check: (Game) => (Game.stats.activitiesTried || 0) >= 8,
  },
  {
    id: 'topfun',
    name: 'Top Fun',
    desc: 'Win a drone race at every location.',
    check: (Game) => (Game.stats.droneWins || 0) >= 5,
  },
  {
    id: 'earncash',
    name: 'Earn Cash, Not Kudos',
    desc: 'Win 20 different races.',
    check: (Game) => (Game.stats.racesWon || 0) >= 20,
  },
  {
    id: 'stickfiddler',
    name: 'Stick Fiddler',
    desc: 'Finish one Arcade machine game.',
    check: (Game) => (Game.stats.arcadeWins || 0) >= 1,
  },
  {
    id: 'positivemental',
    name: 'Positive Mental Attitude',
    desc: 'Meditate at all 18 meditation spots.',
    check: (Game) => Game.collectibles && Game.collectibles.foundCount('meditation') >= 18,
  },
  {
    id: 'onelastthing',
    name: 'One Last Thing',
    desc: 'Complete 50 challenges.',
    check: (Game) => (Game.stats.challengesDone || 0) >= 50,
  },
  {
    id: 'hottogether',
    name: 'Hot Together',
    desc: 'Escape a 4-star police chase with your partner.',
    check: (Game) => (Game.stats.escaped4StarDuo || 0) >= 1,
  },
  {
    id: 'retailtherapy',
    name: 'Retail Therapy',
    desc: 'Rob 3 stores in a row with your partner without losing wanted stars.',
    check: (Game) => (Game.stats.retailStreak || 0) >= 3,
  },
  {
    id: 'whipitgood',
    name: 'Whip It Good',
    desc: 'Find / drive 100 different vehicle types.',
    check: (Game) => (Game.stats.vehiclesDriven || 0) >= 100,
  },
  {
    id: 'gunslinger',
    name: 'Gunslinger',
    desc: 'Incapacitate 5 enemies in one Combat Focus use.',
    check: (Game) => (Game.stats.focusStuns || 0) >= 5,
  },
  {
    id: 'catchme',
    name: 'Catch Me If You Can',
    desc: 'An unscheduled departure / escape at VCIA airport.',
    check: (Game) => (Game.stats.vciaEscape || 0) >= 1,
  },
  {
    id: 'tank',
    name: 'Challenging Tank',
    desc: 'Drive a battle tank (Rhino).',
    check: (Game) => (Game.stats.tankDriven || 0) >= 1,
  },
  {
    id: 'sneakthief',
    name: 'Sneakthief',
    desc: 'Rob a jewelry store without being seen.',
    check: (Game) => (Game.stats.sneakJewelry || 0) >= 1,
  },
  {
    id: 'blitz',
    name: 'A Classic Blitz Play',
    desc: 'Rob an armored truck and escape.',
    check: (Game) => (Game.stats.armoredRobbed || 0) >= 1,
  },
  {
    id: 'goodtime',
    name: 'The Goodtime State',
    desc: 'Explore the whole Leonida map.',
    check: (Game) => (Game.stats.mapExplored || 0) >= 100,
  },
  {
    id: 'pestcontrol',
    name: 'Pest Control',
    desc: 'Rob each gang\'s illegal operation HQ.',
    check: (Game) => (Game.stats.gangHQs || 0) >= 3,
  },
  {
    id: 'beginning',
    name: 'In The Beginning…',
    desc: 'Enjoy a drink with the view at Ocean Beach.',
    check: (Game) => (Game.stats.beachDrink || 0) >= 1,
  },
  {
    id: 'capital',
    name: 'Capital Offense',
    desc: 'Crash out of a vehicle showroom, classic style.',
    check: (Game) => (Game.stats.showroomCrash || 0) >= 1,
  },
  {
    id: 'bowling',
    name: "Let's Go Bowling",
    desc: 'Play bowling at Kolt & Associates.',
    check: (Game) => (Game.stats.bowlingGames || 0) >= 1,
  },
  {
    id: 'truth',
    name: 'The Truth Is Out There',
    desc: 'Find an unexplainable mystery event.',
    check: (Game) => (Game.stats.mysteries || 0) >= 1,
  },
  {
    id: 'tenpin',
    name: 'Ten Pin',
    desc: 'Knock an enemy down with a drive-by melee attack from a vehicle.',
    check: (Game) => (Game.stats.drivebyMelee || 0) >= 1,
  },
  {
    id: 'dime',
    name: 'Dime on the Dollar',
    desc: 'Earn $250,000 from trading Marked Bills through a fence.',
    check: (Game) => (Game.stats.markedWashed || 0) >= 250000,
  },
  {
    id: 'treatyoself',
    name: 'Treat Yo Self',
    desc: 'Spend $100,000 total across all stores.',
    check: (Game) => (Game.stats.spentAtGunshops || 0) >= 100000,
  },
  {
    id: 'littleboxes',
    name: 'Little Boxes',
    desc: 'Buy every available garage property.',
    check: (Game) => Game.properties && Game.properties.ownedGarages.length >= 8,
  },
  {
    id: 'onthespot',
    name: 'On the Spot',
    desc: 'Register 10 vehicles in the Scooter Bros app.',
    check: (Game) => Game.phone && Game.phone.scooters.length >= 10,
  },
];

export const DRONE_RACE_SPOTS = [
  {
    id: 'd1',
    name: 'Vice Beach Dunes',
    x: 300,
    z: 320,
  },
  {
    id: 'd2',
    name: 'Grassrivers Swamp',
    x: -280,
    z: -240,
  },
  {
    id: 'd3',
    name: 'Mount Kalaga Ridge',
    x: -200,
    z: 300,
  },
  {
    id: 'd4',
    name: 'Port Gellhorn Docks',
    x: 320,
    z: -80,
  },
  {
    id: 'd5',
    name: 'Vice City Rooftops',
    x: 0,
    z: 0,
  },
];

export function createActivities(Game) {
  const A = {
    achievements: ACHIEVEMENTS,
    unlocked: {}, // id -> true
    // ---- Shooting range: Bronze / Silver / Gold medals ----
    // A range session: 10 targets, scored by hits. Medals gate the
    // Max Ammo / Infinite Ammo / No Reload cheats (Bab 3).
    rangeSession(hits) {
      const medal = hits >= 9 ? 'gold' : hits >= 7 ? 'silver' : hits >= 5 ? 'bronze' : null;
      if (!medal) return { ok: false, medal: null, hits };
      Game.stats.rangeMedals = Game.stats.rangeMedals || { bronze: 0, silver: 0, gold: 0 };
      Game.stats.rangeMedals[medal]++;
      if (medal === 'gold') Game.stats.rangeGold = (Game.stats.rangeGold || 0) + 1;
      Game.stats.challengesDone = (Game.stats.challengesDone || 0) + 1;
      Game.hud.toast(`Shooting Range: ${hits}/10 — ${medal.toUpperCase()} medal!`);
      return { ok: true, medal, hits };
    },
    // ---- Drone races (Top Fun) ----
    droneRace(spotId, won) {
      if (won) {
        Game.stats.droneWins = (Game.stats.droneWins || 0) + 1;
        Game.stats.racesWon = (Game.stats.racesWon || 0) + 1;
        Game.money += 500;
        Game.hud.toast(`Drone race won at ${spotId}! +$500.`);
      }
      this.noteActivity('drone');
      return won;
    },
    // ---- Bowling (Kolt & Associates) ----
    bowling(score) {
      Game.stats.bowlingGames = (Game.stats.bowlingGames || 0) + 1;
      Game.money += Math.max(0, score);
      Game.hud.toast(`Bowling: ${score} pins — +$${Math.max(0, score)}.`);
      this.noteActivity('bowling');
      return score;
    },
    // ---- Arcade ----
    arcade(game) {
      Game.stats.arcadeWins = (Game.stats.arcadeWins || 0) + 1;
      Game.hud.toast(`Arcade: finished a game of ${game}.`);
      this.noteActivity('arcade');
      return true;
    },
    // ---- VR mini-game ----
    vrGame(game) {
      Game.hud.toast(`VR: played ${game}.`);
      this.noteActivity('vr');
      return true;
    },
    // ---- Workout counter (Bab 3: 100x Workout unlocks Body Armor) ----
    workout() {
      Game.stats.workouts = (Game.stats.workouts || 0) + 1;
      if (Game.attributes) Game.attributes.gymSession(Game.player.who, 'bench press');
      return Game.stats.workouts;
    },
    noteActivity(kind) {
      Game.stats.activitiesTriedSet = Game.stats.activitiesTriedSet || {};
      if (!Game.stats.activitiesTriedSet[kind]) {
        Game.stats.activitiesTriedSet[kind] = true;
        Game.stats.activitiesTried = (Game.stats.activitiesTried || 0) + 1;
      }
    },
    // ---- Achievement checks (run after any notable event) ----
    checkAchievements() {
      for (const a of ACHIEVEMENTS) {
        if (this.unlocked[a.id]) continue;
        let ok = false;
        try { ok = a.check(Game); } catch (e) { ok = false; }
        if (ok) {
          this.unlocked[a.id] = true;
          Game.stats.achievements = (Game.stats.achievements || 0) + 1;
          Game.hud.toast(`🏆 Achievement: ${a.name} — ${a.desc}`);
          Game.audio.pickup();
        }
      }
    },
    unlockedCount() { return Object.keys(this.unlocked).length; },
    // ---- Save / load (save.js reads this as Game.achievements) ----
    serialize() {
      return { unlocked: this.unlocked };
    },
    restore(data) {
      if (data.unlocked) this.unlocked = data.unlocked;
    },
  };
  return A;
}

// ---- Round 3: medal points (gold 3 / silver 2 / bronze 1) ----
// The shooting-range and minigame leaderboards rank on these.
export function medalPoints(medal) {
  return { gold: 3, silver: 2, bronze: 1 }[medal] || 0;
}
