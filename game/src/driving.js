// driving.js — Driving mechanics, SPEC §18 + §24.
// Auto-Drive (hold D-Pad Down in a car, pick Cinematic Camera: the car drives
// itself to the GPS destination, obeying traffic lights). Quick GPS without
// opening the map (hold D-Pad Down while driving). Push Mechanic (a stuck car
// / beached boat: walk into it and hold the prompt to push it back).
// Hide in Car (hold Circle / B in a car to duck lower while hiding from police).
// Road Rage Shortcut (R3 in a vehicle to shout at other drivers).
// Heavy car physics: a flipped car CANNOT be flipped back by steering; the
// body dents from bare-hand hits / slamming enemies into doors.
export const DRIVING_FEATURES = [
  { id: 'autodrive', name: 'Auto-Drive', desc: 'Hold D-Pad Down in a car, pick Cinematic Camera — car drives itself to the GPS destination, obeying traffic lights.' },
  { id: 'quickgps', name: 'Quick GPS', desc: 'Hold D-Pad Down while driving to pick a destination on screen, no map needed.' },
  { id: 'push', name: 'Push Mechanic', desc: 'Stuck car / beached boat: walk into it and hold the prompt to push it back to the road or water.' },
  { id: 'hideincar', name: 'Hide in Car', desc: 'Hold Circle / B in a car to duck lower while hiding from police.' },
  { id: 'roadrage', name: 'Road Rage Shortcut', desc: 'Press R3 in a vehicle to shout / swear at other drivers.' },
  { id: 'heavyphysics', name: 'Heavy Car Physics', desc: 'A flipped car cannot be flipped back by steering; body dents from bare-hand hits and slamming enemies into doors.' },
];

// Braking distance (m) from speed (km/h) and road grip (0-1).
export function brakingDistance(speedKmh, grip) {
  const v = speedKmh / 3.6; // m/s
  const decel = 8 * Math.max(0.3, grip); // m/s^2
  return Math.round((v * v) / (2 * decel) * 10) / 10;
}

// Time (s) to stop from speed (km/h) at the given grip.
export function stoppingTime(speedKmh, grip) {
  const v = speedKmh / 3.6;
  const decel = 8 * Math.max(0.3, grip);
  return Math.round((v / decel) * 10) / 10;
}

// Engine on/off: press Triangle/Y once = engine off when exiting;
// double-tap = exit with the engine still running (fast getaway).
export const EXIT_ENGINE = {
  singleTap: 'engine off on exit',
  doubleTap: 'exit with engine still running',
};
