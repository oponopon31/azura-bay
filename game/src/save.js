// save.js — Save system, SPEC §3.
// Saves live in localStorage. Activating any cheat disables saving (and
// trophies) — Bab 3. Save slots hold story progress, BuckMe, collections,
// attributes and settings.
export const SAVE_KEY = 'azura-bay-save-v1';
export const SAVE_SLOTS = 3;

export function hasSave() {
  try {
    return typeof localStorage !== 'undefined' && localStorage.getItem(SAVE_KEY) !== null;
  } catch {
    return false;
  }
}

export function saveGame(state) {
  if (state.cheatsActive && state.cheatsActive.length > 0) {
    return { ok: false, reason: 'saving disabled while a cheat is active' };
  }
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(state));
    return { ok: true };
  } catch (e) {
    return { ok: false, reason: String(e) };
  }
}

export function loadGame() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function clearSave() {
  try {
    localStorage.removeItem(SAVE_KEY);
    return true;
  } catch {
    return false;
  }
}
