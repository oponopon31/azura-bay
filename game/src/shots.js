// AZURA BAY — screenshot poses (round 7 re-compose, fresh under r7).
// 5 poses for the dossier screenshots: cover, shootout, dusk, heist, night.
// Only 4 screenshots ship (night is a bonus pose). Each pose sets the
// camera, time, weather, and player/vehicle placement.

export const POSES = [
  { id: "cover", name: "Cover", desc: "Jason and Lucia on Vice Beach at sunset.", time: 17 * 60 + 30, weather: "clear", camera: "wide", x: 191, z: -112 },
  { id: "shootout", name: "Shootout", desc: "A shootout in Vice City.", time: 14 * 60, weather: "clear", camera: "action", x: -28, z: -95 },
  { id: "dusk", name: "Dusk", desc: "Dusk over the Leonida Keys.", time: 18 * 60 + 45, weather: "sunset", camera: "wide", x: -296, z: 749 },
  { id: "heist", name: "Heist", desc: "The big heist at the bank.", time: 10 * 60, weather: "clear", camera: "close", x: -28, z: -95 },
  { id: "night", name: "Night", desc: "Night in Vice City (bonus pose).", time: 22 * 60, weather: "clear", camera: "wide", x: -28, z: -95 },
];

export const SHIPPED_POSES = ["cover", "shootout", "dusk", "heist"];

export function poseById(id) { return POSES.find((p) => p.id === id) || null; }
export function totalPoses() { return POSES.length; }
export function shippedPoses() { return POSES.filter((p) => SHIPPED_POSES.includes(p.id)); }
export function isShipped(id) { return SHIPPED_POSES.includes(id); }
export function poseTime(id) {
  const p = poseById(id);
  return p ? p.time : null;
}
