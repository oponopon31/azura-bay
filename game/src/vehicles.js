// AZURA BAY — vehicle instances (round 7 re-compose, fresh under r7).
// Spawned vehicle instances on the map. countByDriver groups by driver
// (player, npc, police, none). Uses vehicles-data.js for the catalog.

import { VEHICLES, vehicleById } from "./vehicles-data.js";
import { mulberry32, hashSeed } from "./rng.js";

export function spawnVehicles(count, seed) {
  const rand = mulberry32(hashSeed(seed || "vehicles"));
  const out = [];
  for (let i = 0; i < count; i++) {
    const v = VEHICLES[Math.floor(rand() * VEHICLES.length)];
    out.push({
      instanceId: "inst-" + (i + 1),
      vehicleId: v.id,
      name: v.name,
      cls: v.cls,
      x: Math.round(-880 + rand() * 1080),
      z: Math.round(-800 + rand() * 1600),
      driver: rand() < 0.6 ? "npc" : "none",
      color: Math.floor(rand() * 0xffffff),
    });
  }
  return out;
}

export function countByDriver(instances) {
  const counts = { player: 0, npc: 0, police: 0, none: 0 };
  for (const inst of instances) {
    if (counts[inst.driver] != null) counts[inst.driver]++;
    else counts.none++;
  }
  return counts;
}
export function countByClass(instances) {
  const counts = {};
  for (const inst of instances) {
    counts[inst.cls] = (counts[inst.cls] || 0) + 1;
  }
  return counts;
}
export function nearestVehicle(instances, x, z) {
  let best = null, bestD = Infinity;
  for (const inst of instances) {
    const d = Math.hypot(inst.x - x, inst.z - z);
    if (d < bestD) { bestD = d; best = inst; }
  }
  return best;
}
export function enterVehicle(instances, instanceId, driver) {
  const inst = instances.find((i) => i.instanceId === instanceId);
  if (!inst) return null;
  inst.driver = driver;
  return inst;
}
export function exitVehicle(instances, instanceId) {
  const inst = instances.find((i) => i.instanceId === instanceId);
  if (!inst) return null;
  inst.driver = "none";
  return inst;
}
