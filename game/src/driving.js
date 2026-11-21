// AZURA BAY — driving (round 7 re-compose, written fresh under r7).
// SPEC.md Bab 16. Braking distance, stopping time, fuel/charging,
// Auto-Drive, Quick GPS. Vehicles have fuel (gas) or charge (electric).

export function brakingDistance(speed, handling) {
  // speed in km/h, handling 0-100. Higher handling = shorter stop.
  const v = speed / 3.6; // m/s
  const decel = 4 + (handling / 100) * 6; // m/s^2
  return Math.round((v * v) / (2 * decel));
}
export function stoppingTime(speed, handling) {
  const v = speed / 3.6;
  const decel = 4 + (handling / 100) * 6;
  return Math.round((v / decel) * 10) / 10;
}
export function fuelConsumption(speed, dt) {
  // litres per second at speed
  return (speed / 200) * 0.01 * dt;
}
export function chargeConsumption(speed, dt) {
  return (speed / 200) * 0.008 * dt;
}
export function newVehicleState(vehicle) {
  return {
    id: vehicle.id, name: vehicle.name, fuel: 100, charge: 100,
    engineHealth: 100, speed: 0, electric: vehicle.name.includes("Voltaic") || vehicle.name.includes("Cyclone") || vehicle.name.includes("Neon"),
    autoDrive: false, gpsTarget: null,
  };
}
export function refuel(vs, amount) {
  vs.fuel = Math.min(100, vs.fuel + amount);
  return vs.fuel;
}
export function recharge(vs, amount) {
  vs.charge = Math.min(100, vs.charge + amount);
  return vs.charge;
}
export function damageEngine(vs, amount) {
  vs.engineHealth = Math.max(0, vs.engineHealth - amount);
  return vs.engineHealth;
}
export function setAutoDrive(vs, on) { vs.autoDrive = on; return vs.autoDrive; }
export function setGpsTarget(vs, point) { vs.gpsTarget = point; return vs.gpsTarget; }
export function needsFuel(vs) { return !vs.electric && vs.fuel < 20; }
export function needsCharge(vs) { return vs.electric && vs.charge < 20; }
export function needsRepair(vs) { return vs.engineHealth < 30; }
