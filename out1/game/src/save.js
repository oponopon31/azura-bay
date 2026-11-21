// save.js — Save and load through localStorage: cash, mission progress, player
// position and health, time of day and stats. Autosave + safehouse save.

import { SAVE_KEY, START_CASH } from './config.js';

export function createSave(G) {
  return {
    exists() {
      try { return !!localStorage.getItem(SAVE_KEY); } catch { return false; }
    },
    save() {
      const data = {
        version: 1,
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
      if (!data || data.version !== 1) return false;
      G.money = data.money ?? START_CASH;
      G.missions.index = Math.min(data.missionIndex ?? 0, 4);
      G.missions.completed = data.completed || [false, false, false, false, false];
      if (data.player) {
        G.player.pos.set(data.player.x, 0, data.player.z);
        G.player.heading = data.player.heading ?? Math.PI;
        G.player.health = data.player.health ?? 100;
      }
      if (data.timeOfDay) G.timeOfDay = data.timeOfDay;
      if (data.stats) Object.assign(G.stats, data.stats);
      return true;
    },
    clear() {
      try { localStorage.removeItem(SAVE_KEY); } catch { /* private mode */ }
    },
  };
}
