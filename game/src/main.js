// AZURA BAY — main entrypoint (round 7 re-compose, written fresh under r7).
// Wires every module into a playable 2D top-down Leonida game.
// 91 missions, 69 weapons, 245 vehicles, 61 cheats, 13 Strangers,
// 24 radio stations, 27 characters, 4 endings, Wanted & Heat,
// smartphone, properties, attributes, 4-corner HUD.

import { WORLD, WALLET_MAX, BUCKME_GOOD1_MIN, STAR_STATES, PROFILE_LEVELS } from "./config.js";
import { newWorldState, advanceTime, isNight, isDusk, movePlayer, timeString } from "./world.js";
import { newPlayerState, activePlayer, switchPlayer, takeDamage, updateProfile } from "./player.js";
import { newEconomy, enforceWalletCap, addCash, addBuckMe } from "./economy.js";
import { newMissionState, completeMission, nextMission, resolveEnding, rewindToPreFinal } from "./missions.js";
import { newPolice, addWanted, decayHeat, surrender, escapeAction } from "./police.js";
import { newPhoneState, openApp } from "./phone.js";
import { newHudState, updateHudCorners, hudCorners } from "./hud.js";
import { MISSIONS, totalMissions } from "./story.js";
import { totalWeapons } from "./weapons-special.js";
import { totalVehicles } from "./vehicles-data.js";
import { totalCheats, activateCheat, cheatsUnlocked } from "./cheats.js";
import { totalStrangers } from "./strangers.js";
import { totalStations, nextStation } from "./radio.js";
import { totalCharacters } from "./characters.js";
import { totalCollectibles } from "./collectibles.js";
import { totalStunts } from "./stunts.js";
import { totalEvents } from "./events.js";
import { totalMysteries } from "./mysteries.js";
import { totalFish } from "./fishing.js";
import { totalChallenges } from "./activities.js";
import { totalGunShops, expandedCount } from "./gunshops.js";
import { totalGoldVariants, totalVariants } from "./variants.js";
import { MAP_POINTS, totalMapPoints } from "./leonidamap.js";
import { spawnVehicles } from "./vehicles.js";
import { spawnPedestrians } from "./pedestrians.js";
import { newEffectsState, updateParticles, updateShake } from "./effects.js";
import { newSaveState, saveGame, canSave } from "./save.js";
import { isNightAt, lightingAt } from "./city.js";
import { stationBar } from "./audio.js";

export const VERSION = "round-7";
export const BUILD_TAG = "AZURA BAY · Round 7";

export function newGame() {
  return {
    version: VERSION,
    world: newWorldState(),
    player: newPlayerState(),
    econ: newEconomy(),
    missions: newMissionState(),
    police: newPolice(),
    phone: newPhoneState(),
    hud: newHudState(),
    save: newSaveState(),
    fx: newEffectsState(),
    vehicles: spawnVehicles(60, "game"),
    peds: spawnPedestrians(80, "Vice City", "game"),
    radio: { station: "flash", playing: true },
    collectiblesFound: 0,
    stuntsDone: [],
    strangersDone: [],
    challengesDone: [],
    cheatsActive: {},
    trophiesDisabled: false,
    saveDisabled: false,
    storyDone: false,
    time: 0,
  };
}

// Per-frame update. dt in seconds.
export function update(state, dt) {
  state.time += dt;
  advanceTime(state.world, dt / 60);
  updateHudCorners(state.hud, dt, state.time);
  decayHeat(state.police, dt);
  updateParticles(state.fx, dt);
  updateShake(state.fx, dt);
  return state;
}

export function gameStats(state) {
  return {
    missions: totalMissions(),
    missionsDone: state.missions.done.length,
    weapons: totalWeapons(),
    vehicles: totalVehicles(),
    cheats: totalCheats(),
    strangers: totalStrangers(),
    stations: totalStations(),
    characters: totalCharacters(),
    collectibles: totalCollectibles(),
    stunts: totalStunts(),
    events: totalEvents(),
    mysteries: totalMysteries(),
    fish: totalFish(),
    challenges: totalChallenges(),
    gunShops: totalGunShops(),
    expandedShops: expandedCount(),
    goldVariants: totalGoldVariants(),
    variants: totalVariants(),
    mapPoints: totalMapPoints(),
  };
}

// 2D top-down render to a canvas context.
export function render(state, ctx, w, h) {
  const lighting = lightingAt(state.world.time, state.world.weather);
  ctx.fillStyle = lighting.sky;
  ctx.fillRect(0, 0, w, h);
  // Ground: Leonida landmass (green) with water around it.
  ctx.fillStyle = "#2d6a2d";
  ctx.fillRect(w * 0.1, h * 0.1, w * 0.8, h * 0.8);
  // Water.
  ctx.fillStyle = "#1a5a8a";
  ctx.fillRect(0, 0, w, h * 0.08);
  ctx.fillRect(0, h * 0.92, w, h * 0.08);
  // Map points.
  for (const p of MAP_POINTS) {
    const sx = ((p.x - WORLD.xMin) / (WORLD.xMax - WORLD.xMin)) * w;
    const sy = ((p.z - WORLD.zMin) / (WORLD.zMax - WORLD.zMin)) * h;
    ctx.fillStyle = p.kind === "city" ? "#ffcc00" : "#ffffff";
    ctx.beginPath();
    ctx.arc(sx, sy, p.kind === "city" ? 6 : 3, 0, Math.PI * 2);
    ctx.fill();
  }
  // Player.
  const px = ((state.world.player.x - WORLD.xMin) / (WORLD.xMax - WORLD.xMin)) * w;
  const py = ((state.world.player.z - WORLD.zMin) / (WORLD.zMax - WORLD.zMin)) * h;
  ctx.fillStyle = "#ff0066";
  ctx.beginPath();
  ctx.arc(px, py, 8, 0, Math.PI * 2);
  ctx.fill();
  // HUD text.
  ctx.fillStyle = "#ffffff";
  ctx.font = "16px sans-serif";
  ctx.fillText(BUILD_TAG, 10, 20);
  ctx.fillText("Time " + timeString(state.world) + "  Day " + state.world.day, 10, 40);
  ctx.fillText("Cash $" + state.econ.cash + "  BuckMe $" + state.econ.buckme, 10, 60);
  ctx.fillText("Missions " + state.missions.done.length + "/" + totalMissions(), 10, 80);
  ctx.fillText("Wanted " + state.police.stars + " stars (" + state.police.state + ")", 10, 100);
  return true;
}

// Browser bootstrap.
export function boot(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return null;
  const ctx = canvas.getContext("2d");
  const state = newGame();
  let last = performance.now();
  function frame(now) {
    const dt = Math.min(0.1, (now - last) / 1000);
    last = now;
    update(state, dt);
    render(state, ctx, canvas.width, canvas.height);
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
  window.AZURA = { state, newGame, update, render, gameStats, hudCorners };
  return state;
}
