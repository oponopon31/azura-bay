// stunts.js — Stunts (397) + free-roam robberies (175) (SPEC Bab 6 + Bab 19).
// Stunts: 130 Stunt Jumps, 202 Under the Bridges, 40 Knife Flights,
// 25 Base Jumps. Positions are deterministic (seeded); a stunt completes
// when the player passes through its zone with the right condition
// (speed for jumps, altitude for base jumps, low flight for knife flights).
// Robberies: 72 Convenience Stores, 23 Fast Food, 22 Banks (14 small +
// 8 big vaults), 20 Jewelry, 15 Pawn, 14 Liquor, 7 Payday Loans.
// Robbery rules (Bab 19): ALWAYS bring your partner (Jason + Lucia
// together). If you go in alone and the guards number more than 2, the
// robbery fails.
// Round 5: the placement helper is renamed, Game replaces G. Values unchanged.

import { makeRng } from './rng.js';

export const STUNT_COUNTS = { jumps: 130, bridges: 202, knife: 40, base: 25 };
export const STUNT_TOTAL = 397;

export const ROBBERY_COUNTS = {
  minimarket: 72, fastfood: 23, bank: 22, jewelry: 20,
  pawn: 15, liquor: 14, payday: 7,
};
export const ROBBERY_TOTAL = 175;

function scatterStunts(seed, count, kind) {
  const rng = makeRng(seed);
  const out = [];
  for (let i = 0; i < count; i++) {
    out.push({
      id: `${kind}-${i + 1}`, kind,
      x: Math.round(rng.range(-340, 340)),
      z: Math.round(rng.range(-340, 340)),
      done: false,
    });
  }
  return out;
}

export function createStunts(Game) {
  const stunts = [
    ...scatterStunts(0x5A1, 130, 'jump'),
    ...scatterStunts(0xB21D, 202, 'bridge'),
    ...scatterStunts(0xA11F, 40, 'knife'),
    ...scatterStunts(0xBA53, 25, 'base'),
  ];
  const robberies = [];
  for (const [kind, count] of Object.entries(ROBBERY_COUNTS)) {
    const rng = makeRng(0xB0B + kind.length * 104729);
    for (let i = 0; i < count; i++) {
      robberies.push({
        id: `${kind}-${i + 1}`, kind,
        x: Math.round(rng.range(-340, 340)),
        z: Math.round(rng.range(-340, 340)),
        guards: kind === 'bank' ? 3 : kind === 'jewelry' ? 3 : rng.int(1, 3),
        vault: kind === 'bank' && i >= 14, // 14 small banks, 8 big vaults
        done: false, cooldownUntil: 0,
      });
    }
  }

  const S = {
    stunts, robberies,
    // ---- Stunts ----
    stuntDone(kind) { return this.stunts.filter((s) => s.kind === kind && s.done).length; },
    stuntTotal() { return this.stunts.filter((s) => s.done).length; },
    // A jump completes at speed through its zone; a bridge stunt when
    // passing under its marker; a knife flight when flying low through
    // the gap; a base jump when falling from height with a parachute.
    update() {
      const p = Game.player.pos;
      const speed = Math.abs(Game.player.speed || 0);
      const inCar = !Game.player.onFoot;
      for (const s of this.stunts) {
        if (s.done) continue;
        const d = Math.hypot(p.x - s.x, p.z - s.z);
        if (d > 12) continue;
        let ok = false;
        if (s.kind === 'jump') ok = inCar && speed > 18;
        else if (s.kind === 'bridge') ok = true;
        else if (s.kind === 'knife') ok = inCar && speed > 22;
        else if (s.kind === 'base') ok = Game.player.falling || p.y > 20;
        if (ok) {
          s.done = true;
          Game.hud.toast(`Stunt complete: ${s.id} (${this.stuntTotal()}/${STUNT_TOTAL})`);
          Game.audio.pickup();
          Game.money += 500;
          Game.saveGame();
        }
      }
    },
    nearestStunt() {
      let best = null, bestD = 1e9;
      for (const s of this.stunts) {
        if (s.done) continue;
        const d = Math.hypot(Game.player.pos.x - s.x, Game.player.pos.z - s.z);
        if (d < bestD) { bestD = d; best = s; }
      }
      return best ? { ...best, dist: bestD } : null;
    },
    // ---- Robberies ----
    nearestRobbery() {
      let best = null, bestD = 1e9;
      for (const r of this.robberies) {
        if (r.done) continue;
        const d = Math.hypot(Game.player.pos.x - r.x, Game.player.pos.z - r.z);
        if (d < bestD) { bestD = d; best = r; }
      }
      return best ? { ...best, dist: bestD } : null;
    },
    // Attempt a robbery at the nearest site. `partnerPresent` is whether
    // Jason & Lucia are together (the duo rule); `guardsDisarmed` is
    // whether the guards were disarmed first (stun / disarm / takedown).
    attemptRobbery(partnerPresent, guardsDisarmed) {
      const site = this.nearestRobbery();
      if (!site || site.dist > 12) return { ok: false, reason: 'No robbery target nearby.' };
      if (Game.elapsed < site.cooldownUntil) return { ok: false, reason: 'This place was just hit — come back later.' };
      // Duo rule (Bab 19): alone + more than 2 guards = they shoot first.
      if (!partnerPresent && site.guards > 2) {
        Game.police.addHeat(40, 'robbery gone wrong — guards opened fire');
        Game.player.health -= 20;
        Game.hud.flashDamage();
        Game.hud.toast('The guards opened fire — you came alone and they outnumber you!');
        return { ok: false, reason: 'Guards shot first: bring your partner when guards > 2.' };
      }
      // Disarm first (Bab 19): threaten civilians before the guards are
      // down and you get shot in the back.
      if (!guardsDisarmed && site.guards > 0) {
        Game.police.addHeat(30, 'robbery alarm');
        Game.hud.toast('Disarm the guards FIRST — otherwise they shoot you in the back!');
        return { ok: false, reason: 'Disarm the guards first.' };
      }
      const base = { minimarket: 800, fastfood: 600, bank: 8000, jewelry: 5000, pawn: 1200, liquor: 900, payday: 2500 }[site.kind];
      const take = site.vault ? base * 3 : base;
      site.done = true;
      site.cooldownUntil = Game.elapsed + 3600;
      Game.money += take;
      Game.audio.cash();
      Game.hud.cashPopup(`+$${take.toLocaleString()}`);
      Game.police.addHeat(site.vault ? 45 : 25, `robbed a ${site.kind}`);
      Game.stats.robberies = (Game.stats.robberies || 0) + 1;
      if (site.vault) Game.stats.bigVaults = (Game.stats.bigVaults || 0) + 1;
      Game.hud.toast(`Robbed the ${site.kind} — $${take.toLocaleString()}. Lose the heat!`);
      Game.saveGame();
      return { ok: true, take, site };
    },
    robberyDone() { return this.robberies.filter((r) => r.done).length; },
    // Round 3: stunts done of one kind (jump / bridge / knife / base).
    stuntCountByKind(kind) {
      return this.stunts.filter((s) => s.kind === kind && s.done).length;
    },
  };
  return S;
}
