// save.js — Save and load through localStorage: cash, mission progress, player
// position and health, time of day, stats, and the round-2 systems
// (collectibles, cheats, attributes, properties, phone, events, map fog).
// Autosave + safehouse save. Version 2; a version-1 save still loads.
// The save format is version 2, but a version-1 save still loads — old
// saves are not wiped by the upgrade.
// Round 5: the extra-state helpers are renamed, Game replaces G.
// Behaviour unchanged.

import { SAVE_KEY, START_CASH } from './config.js';

export function createSave(Game) {
  // Collect the round-2 systems' serialisable state, if they exist yet.
  function gatherExtra() {
    const s = {};
    if (Game.collectibles) s.collectibles = Game.collectibles.serialize();
    if (Game.cheats) s.cheats = Game.cheats.serialize();
    if (Game.attributes) s.attributes = Game.attributes.serialize();
    if (Game.properties) s.properties = Game.properties.serialize();
    if (Game.economy) s.economy = Game.economy.serialize();
    if (Game.achievements) s.achievements = Game.achievements.serialize();
    if (Game.fishing) s.fishing = Game.fishing.serialize();
    if (Game.leonidaMap) s.fog = Game.leonidaMap.serializeFog();
    if (Game.phone) s.phone = Game.phone.serialize();
    if (Game.weapons) s.weapons = Game.weapons.serialize();
    if (Game.settings) s.settings = { ...Game.settings };
    if (Game.radio) s.radioStation = Game.radio.index;
    return s;
  }
  function applyExtra(data) {
    if (!data) return;
    if (data.collectibles && Game.collectibles) Game.collectibles.restore(data.collectibles);
    if (data.cheats && Game.cheats) Game.cheats.restore(data.cheats);
    if (data.attributes && Game.attributes) Game.attributes.restore(data.attributes);
    if (data.properties && Game.properties) Game.properties.restore(data.properties);
    if (data.economy && Game.economy) Game.economy.restore(data.economy);
    if (data.achievements && Game.achievements) Game.achievements.restore(data.achievements);
    if (data.fishing && Game.fishing) Game.fishing.restore(data.fishing);
    if (data.fog && Game.leonidaMap) Game.leonidaMap.restoreFog(data.fog);
    if (data.phone && Game.phone) Game.phone.restore(data.phone);
    if (data.weapons && Game.weapons) Game.weapons.restore(data.weapons);
    if (data.settings && Game.settings) Object.assign(Game.settings, data.settings);
    if (typeof data.radioStation === 'number' && Game.radio) Game.radio.setStation(data.radioStation, true);
  }

  return {
    exists() {
      try { return !!localStorage.getItem(SAVE_KEY); } catch { return false; }
    },
    save() {
      const data = {
        version: 2,
        money: Math.floor(Game.money),
        missionIndex: Game.missions.index,
        completed: Game.missions.completed,
        player: {
          x: Game.player.pos.x, z: Game.player.pos.z,
          heading: Game.player.heading,
          health: Game.player.health,
        },
        timeOfDay: Game.timeOfDay,
        stats: Game.stats,
        extra: gatherExtra(),
        savedAt: Date.now(),
      };
      try {
        localStorage.setItem(SAVE_KEY, JSON.stringify(data));
        return true;
      } catch {
        return false;
      }
    },
    load() {
      let data = null;
      try { data = JSON.parse(localStorage.getItem(SAVE_KEY) || 'null'); } catch { data = null; }
      if (!data || (data.version !== 1 && data.version !== 2)) return false;
      Game.money = data.money ?? START_CASH;
      Game.missions.index = Math.min(data.missionIndex ?? 0, 90);
      Game.missions.completed = (data.completed && data.completed.length === 91) ? data.completed : new Array(91).fill(false);
      if (data.player) {
        Game.player.pos.set(data.player.x, 0, data.player.z);
        Game.player.heading = data.player.heading ?? Math.PI;
        Game.player.health = data.player.health ?? 100;
      }
      if (data.timeOfDay) Game.timeOfDay = data.timeOfDay;
      if (data.stats) Object.assign(Game.stats, data.stats);
      if (data.extra) applyExtra(data.extra);
      return true;
    },
    // Round 3: is there a save to continue from (title screen decides
    // whether CONTINUE is offered)?
    hasSave() {
      try { return !!localStorage.getItem(SAVE_KEY); } catch { return false; }
    },
    clear() {
      try { localStorage.removeItem(SAVE_KEY); } catch { /* private mode */ }
    },
  };
}
