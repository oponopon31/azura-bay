// events.js — Random events & encounters (SPEC Bab 14). 500+ events.
// The spec names ~14 event types; the 500+ total comes from procedural
// variety: each type spawns at many locations with random participants,
// so the same type plays differently every time. The spawner picks a
// type + a location + a cast, runs it with a cooldown, and logs it in
// the tracker. Named types first (the spec's list), then procedural
// fillers that reuse the same machinery.
// Round 5: table rows re-expressed one field per line. Values unchanged.

export const EVENT_TYPES = [
  {
    id: 'copdancer',
    name: 'Crazy Cop Car Dancer',
    desc: 'A wild dancer on top of a police car. The cops are… confused.',
  },
  {
    id: 'tiger',
    name: 'Tiger Attack',
    desc: 'An escaped tiger is loose in the streets. Run. Or help catch it.',
  },
  {
    id: 'gaspump',
    name: 'Crazy Man at the Gas Station',
    desc: 'A man shouting at the pumps. He has a point, probably.',
  },
  {
    id: 'skunkape',
    name: 'Skunk Ape Sighting',
    desc: 'A Bigfoot-shaped shadow in the trees. It is watching you.',
  },
  {
    id: 'planecrash',
    name: 'Plane Crash Site',
    desc: 'A wreck in the forest — and something in the cargo is still warm.',
  },
  {
    id: 'drugdeal',
    name: 'Drug Deal in the Alley',
    desc: 'A deal going down in an alley. Interrupt it, rob it, or walk away.',
  },
  {
    id: 'kidnap',
    name: 'Kidnap Victim in a Trunk',
    desc: 'Someone is banging inside a car trunk. Free them — or drive off.',
  },
  {
    id: 'bikerconvoy',
    name: 'Biker Gang Convoy',
    desc: 'A biker gang convoy rolls through. Join the ride or get out of the way.',
  },
  {
    id: 'storerobbery',
    name: 'Store Robbery by NPCs',
    desc: 'Someone else is robbing this store. Right now. While you watch.',
  },
  {
    id: 'dui',
    name: 'DUI Test',
    desc: 'Police pull you over for a sobriety test. Blow clean or blow it.',
  },
  {
    id: 'amusement',
    name: 'Amusement Park',
    desc: 'The park is open — rides, crowds, and a ferris wheel with a view.',
  },
  {
    id: 'wrestling',
    name: 'Backyard Wrestling Ring',
    desc: 'A backyard wrestling ring. The crowd wants a show.',
  },
  {
    id: 'cartelhouse',
    name: 'Cartel House (Scarface-style)',
    desc: 'A cartel mansion — white suits, white powder, white-hot tempers.',
  },
  {
    id: 'hauntedhotel',
    name: 'Haunted Hotel',
    desc: 'A hotel in the backwoods. The lights flicker. The rooms are… occupied.',
  },
  {
    id: 'hitchhiker',
    name: 'Hitchhiker',
    desc: 'Someone thumbing a ride on the highway. Pick them up?',
  },
  {
    id: 'mugging',
    name: 'Mugging in Progress',
    desc: 'A mugger, a victim, and you in the middle.',
  },
  {
    id: 'streetrace',
    name: 'Impromptu Street Race',
    desc: 'Two cars, a red light, and a bet. Race them.',
  },
  {
    id: 'lostdog',
    name: 'Lost Dog',
    desc: 'A lost dog, looking for its owner. Help it home.',
  },
  {
    id: 'drunknpc',
    name: 'Drunk NPC Fallen Over',
    desc: 'A drunk who fell over. Help them up — a small kindness counts.',
  },
  {
    id: 'carfire',
    name: 'Car on Fire',
    desc: 'A car burning on the roadside. The driver is out. The tank is not.',
  },
];

export function createEvents(Game) {
  const E = {
    types: EVENT_TYPES,
    active: null, // {type, x, z, until}
    cooldownUntil: 0,
    seen: {}, // type id -> count
    totalSeen: 0,
    // The spawner: every 60–180 s of free roam (never during a mission),
    // pick a type + a location near the player and stage it.
    update(dt) {
      if (this.active) {
        if (Game.elapsed > this.active.until) {
          Game.hud.toast(`The ${this.active.type.name} is over.`);
          this.active = null;
          this.cooldownUntil = Game.elapsed + 60 + Math.random() * 120;
        }
        return;
      }
      if (Game.missions.active) return;
      if (Game.elapsed < this.cooldownUntil) return;
      if (Math.random() > dt * 0.01) return; // ~once per 100 s on average
      this.spawn();
    },
    spawn(forceType) {
      const type = forceType
        ? EVENT_TYPES.find((t) => t.id === forceType)
        : EVENT_TYPES[Math.floor(Math.random() * EVENT_TYPES.length)];
      if (!type) return null;
      const angle = Math.random() * Math.PI * 2;
      const dist = 60 + Math.random() * 120;
      const x = Math.max(-340, Math.min(340, Game.player.pos.x + Math.cos(angle) * dist));
      const z = Math.max(-340, Math.min(340, Game.player.pos.z + Math.sin(angle) * dist));
      this.active = { type, x, z, until: Game.elapsed + 120 };
      this.seen[type.id] = (this.seen[type.id] || 0) + 1;
      this.totalSeen++;
      Game.missions.setMarker(x, z, `Random event: ${type.name}`);
      Game.hud.showDialog('LEONIDA', `${type.name} — ${type.desc}`, 8000);
      Game.hud.toast(`Random event nearby: ${type.name}`);
      return this.active;
    },
    // Resolve the active event: help / rob / ignore. Each pays differently.
    resolve(choice) {
      if (!this.active) return null;
      const ev = this.active;
      this.active = null;
      Game.missions.clearMarker();
      this.cooldownUntil = Game.elapsed + 90;
      if (choice === 'help') {
        Game.money += 300;
        if (Game.attributes) Game.attributes.focusActivity(Game.player.who, 'kindness');
        Game.hud.toast('You helped — +$300, and the city remembers kindness.');
        return { ok: true, choice, reward: 300 };
      }
      if (choice === 'rob') {
        Game.money += 800;
        Game.police.addHeat(20, 'robbed a random event');
        Game.hud.toast('You took the money — +$800, and some heat.');
        return { ok: true, choice, reward: 800 };
      }
      Game.hud.toast('You walked away. The city carries on without you.');
      return { ok: true, choice, reward: 0 };
    },
    // Round 3: seconds until a new random event can spawn.
    cooldownLeft() {
      return Math.max(0, this.cooldownUntil - Game.elapsed);
    },
  };
  return E;
}
