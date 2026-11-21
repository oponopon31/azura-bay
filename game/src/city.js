// AZURA BAY — city clock (round 7 re-compose, written fresh under r7).
// Day/night cycle and lighting. Night 20:00–06:00, dusk 17:00–20:00 and
// 05:00–07:00. Used by the renderer and by missions that only run at night
// (UFO after 02:00, base jumps, night races).

export function isNightAt(timeMinutes) {
  const h = timeMinutes / 60;
  return h >= 20 || h < 6;
}
export function isDuskAt(timeMinutes) {
  const h = timeMinutes / 60;
  return (h >= 17 && h < 20) || (h >= 5 && h < 7);
}
export function isDayAt(timeMinutes) {
  return !isNightAt(timeMinutes) && !isDuskAt(timeMinutes);
}
export function isAfter2am(timeMinutes) {
  return timeMinutes >= 120 && timeMinutes < 360; // 02:00–06:00
}
// Lighting preset for the renderer.
export function lightingAt(timeMinutes, weather) {
  if (isNightAt(timeMinutes)) return { sky: "#0a0e1a", sun: 0.15, fog: 0.35, weather };
  if (isDuskAt(timeMinutes)) return { sky: "#e88a4a", sun: 0.5, fog: 0.25, weather };
  if (weather === "rain" || weather === "storm") return { sky: "#5a6a7a", sun: 0.4, fog: 0.5, weather };
  if (weather === "fog") return { sky: "#9aa5a5", sun: 0.35, fog: 0.7, weather };
  return { sky: "#87ceeb", sun: 1.0, fog: 0.1, weather };
}
export function hourLabel(timeMinutes) {
  const h = Math.floor(timeMinutes / 60);
  const m = Math.floor(timeMinutes % 60);
  return String(h).padStart(2, "0") + ":" + String(m).padStart(2, "0");
}
