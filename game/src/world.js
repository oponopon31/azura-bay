// AZURA BAY — world (round 7 re-compose, written fresh under r7).
// World state: clock, weather, day/night, and the player position in the
// Leonida map. Game coords: x = gx/8, z = -gy/8 (SPEC.md Bab 28).

import { WORLD } from "./config.js";

export const WEATHERS = ["clear", "cloudy", "rain", "storm", "fog", "sunset"];

export function newWorldState() {
  return {
    time: 8 * 60, // 08:00 in minutes
    day: 1,
    weather: "clear",
    weatherIndex: 0,
    player: { x: -296, z: 749 }, // Key Lento
    waypoint: null,
    mapRevealed: ["Key Lento"],
  };
}

export function advanceTime(world, minutes) {
  world.time += minutes;
  while (world.time >= 1440) {
    world.time -= 1440;
    world.day += 1;
  }
  return world;
}
export function timeString(world) {
  const h = Math.floor(world.time / 60);
  const m = Math.floor(world.time % 60);
  return String(h).padStart(2, "0") + ":" + String(m).padStart(2, "0");
}
export function isNight(world) {
  const h = world.time / 60;
  return h >= 20 || h < 6;
}
export function isDusk(world) {
  const h = world.time / 60;
  return (h >= 17 && h < 20) || (h >= 5 && h < 7);
}
export function cycleWeather(world) {
  world.weatherIndex = (world.weatherIndex + 1) % WEATHERS.length;
  world.weather = WEATHERS[world.weatherIndex];
  return world.weather;
}
export function setWeather(world, weather) {
  if (WEATHERS.includes(weather)) {
    world.weather = weather;
    world.weatherIndex = WEATHERS.indexOf(weather);
  }
  return world.weather;
}
export function movePlayer(world, dx, dz) {
  world.player.x = Math.max(WORLD.xMin, Math.min(WORLD.xMax, world.player.x + dx));
  world.player.z = Math.max(WORLD.zMin, Math.min(WORLD.zMax, world.player.z + dz));
  return world.player;
}
export function setWaypoint(world, point) {
  world.waypoint = point;
  return world.waypoint;
}
export function clearWaypoint(world) { world.waypoint = null; return null; }
export function distanceTo(world, point) {
  const dx = world.player.x - point.x;
  const dz = world.player.z - point.z;
  return Math.round(Math.hypot(dx, dz));
}
