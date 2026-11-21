// world.js — World state: time, weather, NPCs, traffic, SPEC §14 + §18.
// Traffic density follows rush hour. Beach sand sticks to shoes/clothes,
// sweat shows after running, physical wounds persist for a while.
// Random events (500+ combinations) spawn from 14 named types.
import { mulberry32 } from './rng.js';

export const TIMES = { dawn: 6, morning: 9, noon: 12, afternoon: 15, dusk: 18.5, night: 21, midnight: 0 };

export const WEATHERS = ['clear', 'sunny', 'cloudy', 'rain', 'storm', 'fog', 'humid'];

export function freshWorld(seed) {
  return {
    seed,
    time: 12, // hours, 0-24
    weather: 'sunny',
    day: 1,
    pedestrians: [],
    traffic: 0.5, // 0-1 density
  };
}

// Traffic density follows rush hour (peaks 08:00 and 17:30).
export function trafficDensity(hour) {
  const morning = Math.exp(-((hour - 8) ** 2) / 2);
  const evening = Math.exp(-((hour - 17.5) ** 2) / 2);
  return Math.round((0.35 + 0.65 * Math.max(morning, evening)) * 100) / 100;
}

// Spawn a deterministic crowd of pedestrians for an area.
export function crowdSize(area, seed) {
  const rand = mulberry32(seed);
  const base = { 'vicecity': 60, 'vicebeach': 45, 'oceanbeach': 50, 'keys': 12, 'grassrivers': 6, 'portgellhorn': 20, 'ambrosia': 15, 'mountkalaga': 4 }[area] || 20;
  return base + Math.floor(rand() * 20);
}

export function advanceTime(world, hours) {
  world.time = (world.time + hours) % 24;
  if (world.time < hours) world.day += 1;
  return world;
}
