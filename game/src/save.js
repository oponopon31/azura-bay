// AZURA BAY — save system (round 7 re-compose, written fresh under r7).
// Save slots. Cheats disable saving (SPEC Bab 3): once any cheat is
// active, the save is disabled for that session. Autosave after each
// mission; manual save at safehouses.

export const SAVE_SLOTS = 3;

export function newSaveState() {
  return { slots: [null, null, null], autosave: true, disabled: false };
}
export function canSave(state) {
  return !state.disabled && !state.cheatsActive;
}
export function saveGame(save, slot, gameState) {
  if (slot < 0 || slot >= SAVE_SLOTS) return { ok: false, reason: "bad slot" };
  if (save.disabled) return { ok: false, reason: "save disabled (cheats active)" };
  save.slots[slot] = {
    savedAt: new Date().toISOString(),
    day: gameState.world ? gameState.world.day : 1,
    time: gameState.world ? gameState.world.time : 0,
    missionsDone: gameState.missions ? gameState.missions.done.length : 0,
    cash: gameState.econ ? gameState.econ.cash : 0,
    buckme: gameState.econ ? gameState.econ.buckme : 0,
  };
  return { ok: true, slot };
}
export function loadGame(save, slot) {
  if (slot < 0 || slot >= SAVE_SLOTS) return null;
  return save.slots[slot];
}
export function deleteSave(save, slot) {
  if (slot < 0 || slot >= SAVE_SLOTS) return false;
  save.slots[slot] = null;
  return true;
}
export function disableSave(save, reason) {
  save.disabled = true;
  save.disabledReason = reason || "cheats active";
  return save;
}
export function autosave(save, gameState) {
  if (!save.autosave) return { ok: false, reason: "autosave off" };
  return saveGame(save, 0, gameState);
}
