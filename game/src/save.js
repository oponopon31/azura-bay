// save.js — Save and load through localStorage: cash, mission progress, player
// position and health, time of day, stats, and the round-2 systems
// (collectibles, cheats, attributes, properties, phone, events, map fog).
// Autosave + safehouse save. Version 2; a version-1 save still loads.

import { SAVE_KEY, START_CASH } from './config.js';

export function createSave(G) {
  // Collect the round-2 systems' serialisable state, if they exist yet.
  function extraState() {
    const s = {};
    if (G.collectibles) s.collectibles = G.collectibles.serialize();
    if (G.cheats) s.cheats = G.cheats.serialize();
    if (G.attributes) s.attributes = G.attributes.serialize();
    if (G.properties) s.properties = G.properties.serialize();
    if (G.economy) s.economy = G.economy.serialize();
    if (G.achievements) s.achievements = G.achievements.serialize();
    if (G.fishing) s.fishing = G.fishing.serialize();
    if (G.leonidaMap) s.fog = G.leonidaMap.serializeFog();
    if (G.phone) s.phone = G.phone.serialize();
    if (G.weapons) s.weapons = G.weapons.serialize();
    if (G.settings) s.settings = { ...G.settings };
    if (G.radio) s.radioStation = G.radio.index;
    return s;
  }
  function restoreExtra(data) {
    if (!data) return;
    if (data.collectibles && G.collectibles) G.collectibles.restore(data.collectibles);
    if (data.cheats && G.cheats) G.cheats.restore(data.cheats);
    if (data.attributes && G.attributes) G.attributes.restore(data.attributes);
    if (data.properties && G.properties) G.properties.restore(data.properties);
    if (data.economy && G.economy) G.economy.restore(data.economy);
    if (data.achievements && G.achievements) G.achievements.restore(data.achievements);
    if (data.fishing && G.fishing) G.fishing.restore(data.fishing);
    if (data.fog && G.leonidaMap) G.leonidaMap.restoreFog(data.fog);
    if (data.phone && G.phone) G.phone.restore(data.phone);
    if (data.weapons && G.weapons) G.weapons.restore(data.weapons);
    if (data.settings && G.settings) Object.assign(G.settings, data.settings);
    if (typeof data.radioStation === 'number' && G.radio) G.radio.setStation(data.radioStation, true);
  }

  return {
    exists() {
      try { return !!localStorage.getItem(SAVE_KEY); } catch { return false; }
    },
    save() {
      const data = {
        version: 2,
        money: Math.floor(G.money),
        missionIndex: G.missions.index,
        completed: G.missions.completed,
        player: {
          x: G.player.pos.x, z: G.player.pos.z,
          heading: G.player.heading,
          health: G.player.health,
        },
        timeOfDay: G.timeOfDay,
        stats: G.stats,
        extra: extraState(),
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
      G.money = data.money ?? START_CASH;
      G.missions.index = Math.min(data.missionIndex ?? 0, 90);
      G.missions.completed = (data.completed && data.completed.length === 91) ? data.completed : new Array(91).fill(false);
      if (data.player) {
        G.player.pos.set(data.player.x, 0, data.player.z);
        G.player.heading = data.player.heading ?? Math.PI;
        G.player.health = data.player.health ?? 100;
      }
      if (data.timeOfDay) G.timeOfDay = data.timeOfDay;
      if (data.stats) Object.assign(G.stats, data.stats);
      if (data.extra) restoreExtra(data.extra);
      return true;
    },
    clear() {
      try { localStorage.removeItem(SAVE_KEY); } catch { /* private mode */ }
    },
  };
}
