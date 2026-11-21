// properties.js — Properties, safehouses & garages (SPEC Bab 9).
// Safehouses CANNOT be bought — they open automatically as the story
// progresses (one per chapter). Garages are the only buyable property:
// 12 in the base game (8 bought with cash + 4 free from the story) +
// 3 special-edition bonus garages (Paradise Garage in Watson Bay has a
// weapon locker + a place to sell stolen goods).
// Also: the Bab 9 venues (nightclubs, workshops, salons, shops) as
// visitable locations with a purpose each.
// Round 5: table rows re-expressed one field per line. Values unchanged.

export const SAFEHOUSES = [
  {
    id: 'keys',
    name: "Brian's Place — Leonida Keys",
    x: -160,
    z: -280,
    ch: 1,
    desc: 'Jason\'s free room at Brian\'s — the story starts here.',
  },
  {
    id: 'gellhorn',
    name: 'Port Gellhorn Home',
    x: 320,
    z: -80,
    ch: 2,
    desc: "Lucia's home in Port Gellhorn — inside the ankle-monitor zone.",
  },
  {
    id: 'vicecity',
    name: 'Vice City Apartment',
    x: -40,
    z: 120,
    ch: 3,
    desc: 'The duo\'s Vice City apartment — the crew\'s base for the big jobs.',
  },
  {
    id: 'oceanbeach',
    name: 'Ocean Beach Safehouse',
    x: 300,
    z: 300,
    ch: 4,
    desc: 'A beachfront safehouse — the view is the only thing that is free.',
  },
  {
    id: 'penthouse',
    name: 'Vice City Penthouse',
    x: 80,
    z: 200,
    ch: 5,
    desc: 'The endgame penthouse — Top of the World, Ma.',
  },
];

export const GARAGES = [
  {
    id: 'g1',
    name: 'Marina Row Garage',
    x: 120,
    z: 160,
    price: 15000,
    town: 'Vice City',
    free: false,
  },
  {
    id: 'g2',
    name: 'Ocean Beach Garage',
    x: 300,
    z: 280,
    price: 20000,
    town: 'Ocean Beach',
    free: false,
  },
  {
    id: 'g3',
    name: 'Hamlet Garage',
    x: -280,
    z: -200,
    price: 10000,
    town: 'Hamlet',
    free: false,
  },
  {
    id: 'g4',
    name: 'Port Gellhorn Garage',
    x: 320,
    z: -100,
    price: 12000,
    town: 'Port Gellhorn',
    free: false,
  },
  {
    id: 'g5',
    name: 'Watson Bay Garage',
    x: -320,
    z: -280,
    price: 18000,
    town: 'Watson Bay',
    free: false,
  },
  {
    id: 'g6',
    name: 'Ambrosia Garage',
    x: -200,
    z: 260,
    price: 14000,
    town: 'Ambrosia',
    free: false,
  },
  {
    id: 'g7',
    name: 'Vice Beach Garage',
    x: 320,
    z: 160,
    price: 22000,
    town: 'Vice Beach',
    free: false,
  },
  {
    id: 'g8',
    name: 'Millport Garage',
    x: -240,
    z: 240,
    price: 9000,
    town: 'Millport',
    free: false,
  },
  {
    id: 'g9',
    name: 'Keys Garage',
    x: -160,
    z: -260,
    price: 0,
    town: 'Leonida Keys',
    free: true,
    story: 'Chapter 1',
  },
  {
    id: 'g10',
    name: 'Gellhorn Story Garage',
    x: 300,
    z: -60,
    price: 0,
    town: 'Port Gellhorn',
    free: true,
    story: 'Chapter 2',
  },
  {
    id: 'g11',
    name: 'Vice City Story Garage',
    x: -60,
    z: 100,
    price: 0,
    town: 'Vice City',
    free: true,
    story: 'Chapter 3',
  },
  {
    id: 'g12',
    name: 'Penthouse Garage',
    x: 80,
    z: 180,
    price: 0,
    town: 'Vice City',
    free: true,
    story: 'Chapter 5',
  },
  // 3 special-edition bonus garages
  {
    id: 'gb1',
    name: 'Paradise Garage — Watson Bay',
    x: -300,
    z: -300,
    desc: 'Weapon locker + a place to sell stolen goods.',
    price: 0,
    town: 'Watson Bay',
    free: true,
    bonus: true,
  },
  {
    id: 'gb2',
    name: 'Collector Garage — Ambrosia',
    x: -180,
    z: 280,
    price: 0,
    town: 'Ambrosia',
    free: true,
    bonus: true,
  },
  {
    id: 'gb3',
    name: 'Sunset Garage — Ocean Beach',
    x: 320,
    z: 320,
    price: 0,
    town: 'Ocean Beach',
    free: true,
    bonus: true,
  },
];

export const VENUES = [
  {
    id: 'jackhearts',
    name: 'Jack of Hearts',
    kind: 'Nightclub',
    x: -80,
    z: 160,
    desc: "Boobie Ike's nightclub — the heart of Vice City nights.",
  },
  {
    id: 'nine1nine',
    name: 'NINE1NINE Nightclub',
    kind: 'Nightclub',
    x: -120,
    z: 200,
    desc: 'The NINE1NINE — dancers, lights, and bad decisions.',
  },
  {
    id: 'malibu',
    name: 'The Malibu Club',
    kind: 'Nightclub',
    x: 160,
    z: 280,
    desc: 'The Malibu Club — a Vice City institution since the 80s.',
  },
  {
    id: 'vault',
    name: 'The Vault Nightclub',
    kind: 'Nightclub',
    x: 40,
    z: -160,
    desc: 'The Vault — where the city\'s money goes to dance.',
  },
  {
    id: 'onlyraw',
    name: 'Only Raw Records',
    kind: 'Studio',
    x: -40,
    z: -120,
    desc: "Dre'Quan's studio — Real Dimez record here.",
  },
  {
    id: 'rideout',
    name: 'Rideout Customs',
    kind: 'Workshop',
    x: 200,
    z: -40,
    desc: 'The main vehicle-mod shop in Leonida.',
  },
  {
    id: 'sara',
    name: "Sara's Unisex Salon",
    kind: 'Salon',
    x: -160,
    z: 80,
    desc: 'Hair, Jason\'s beard, Lucia\'s makeup and nails.',
  },
  {
    id: 'barnacle',
    name: 'Barnacle Beauties',
    kind: 'Salon',
    x: 240,
    z: 240,
    desc: 'A beachfront salon.',
  },
  {
    id: 'kurts',
    name: "Kurt's Barber Shop",
    kind: 'Barber',
    x: 80,
    z: -80,
    desc: "Kurt's — a proper barber shop.",
  },
  {
    id: 'electricfang',
    name: 'Electric Fang Tattoo',
    kind: 'Tattoo',
    x: -200,
    z: -80,
    desc: '50+ tattoo designs.',
  },
  {
    id: 'stock305',
    name: 'Stock 305',
    kind: 'Clothing',
    x: 120,
    z: 80,
    desc: 'Clothing and streetwear.',
  },
  {
    id: 'goodtime',
    name: 'Goodtime Gear',
    kind: 'Clothing',
    x: -80,
    z: -200,
    desc: 'Streetwear and gear.',
  },
  {
    id: 'pawnshop',
    name: 'Vice City Pawn',
    kind: 'Pawn',
    x: 0,
    z: 120,
    desc: 'Sell card sets and stolen goods here.',
  },
  {
    id: 'pawnstash',
    name: 'Pawn Stash',
    kind: 'Pawn',
    x: -240,
    z: 40,
    desc: 'A second pawn shop for the discreet seller.',
  },
  {
    id: 'unclejack',
    name: "Uncle Jack's Liquor",
    kind: 'Liquor',
    x: 200,
    z: 200,
    desc: 'Liquor, late.',
  },
  {
    id: 'tishawocka',
    name: 'Tisha-Wocka Flea Market',
    kind: 'Market',
    x: -120,
    z: -240,
    desc: 'A flea market — everything is for sale, nothing is new.',
  },
];

export function createProperties(Game) {
  const P = {
    safehouses: SAFEHOUSES,
    garages: GARAGES,
    venues: VENUES,
    ownedGarages: [], // garage ids
    storedCars: {},   // garage id -> [model names]
    // Safehouses open automatically with the story chapter.
    unlockedSafehouses() {
      const ch = (Game.missions.current && Game.missions.current.ch) || 1;
      return SAFEHOUSES.filter((s) => s.ch <= ch);
    },
    // Free story garages unlock with their chapter; bought ones need cash.
    buyGarage(id) {
      const g = GARAGES.find((x) => x.id === id);
      if (!g) return { ok: false, reason: 'Unknown garage.' };
      if (this.ownedGarages.includes(id)) return { ok: false, reason: 'Already owned.' };
      if (g.free) {
        this.ownedGarages.push(id);
        Game.hud.toast(`Garage unlocked: ${g.name}.`);
        return { ok: true, garage: g };
      }
      if (Game.money < g.price) return { ok: false, reason: `That garage costs $${g.price.toLocaleString()}.` };
      Game.money -= g.price;
      this.ownedGarages.push(id);
      Game.audio.cash();
      Game.hud.toast(`Bought ${g.name} for $${g.price.toLocaleString()}.`);
      Game.saveGame();
      return { ok: true, garage: g };
    },
    // Store the current car in an owned garage (removes the GPS tracker
    // first — a tracked car cannot be stored, per Bab 17).
    storeCar(garageId) {
      const car = Game.player.car;
      if (!car) return { ok: false, reason: 'You are not in a car.' };
      if (!this.ownedGarages.includes(garageId)) return { ok: false, reason: 'You do not own that garage.' };
      if (car.tracker) return { ok: false, reason: 'This car has a GPS tracker — remove it at a workshop or fence first.' };
      this.storedCars[garageId] = this.storedCars[garageId] || [];
      this.storedCars[garageId].push(car.model || car.kind);
      Game.hud.toast(`Stored ${car.model || car.kind} in ${garageId}.`);
      return { ok: true };
    },
    nearestVenue() {
      let best = null, bestD = 1e9;
      for (const v of VENUES) {
        const d = Math.hypot(Game.player.pos.x - v.x, Game.player.pos.z - v.z);
        if (d < bestD) { bestD = d; best = v; }
      }
      return bestD < 20 ? best : null;
    },
    // Round 3: cars in storage across all owned garages (storedCars may be
    // an object keyed by garage or a flat list — count either shape).
    storedCarCount() {
      const stored = this.storedCars || {};
      let n = 0;
      for (const k of Object.keys(stored)) {
        const v = stored[k];
        n += Array.isArray(v) ? v.length : 1;
      }
      return n;
    },
    // ---- Save / load ----
    serialize() {
      return { ownedGarages: this.ownedGarages, storedCars: this.storedCars };
    },
    restore(data) {
      if (data.ownedGarages) this.ownedGarages = data.ownedGarages;
      if (data.storedCars) this.storedCars = data.storedCars;
    },
  };
  return P;
}
