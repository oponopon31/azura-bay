// AZURA BAY — effects (round 7 re-compose, written fresh under r7).
// Visual effects: particles (muzzle flash, explosion, smoke, rain),
// screen shake, slow motion, damage vignette, and weather overlays.
// All effects are procedural (no assets).

export function newEffectsState() {
  return { particles: [], shake: 0, slowmo: 1, vignette: 0, weatherFx: null };
}

export function spawnParticles(fx, kind, x, z, count) {
  const colors = {
    muzzle: "#ffcc00", explosion: "#ff6600", smoke: "#888888",
    rain: "#aaccff", blood: "#cc0000", spark: "#ffff00", fire: "#ff4400",
  };
  for (let i = 0; i < count; i++) {
    fx.particles.push({
      kind, x, z, vx: (Math.random() - 0.5) * 10, vz: (Math.random() - 0.5) * 10,
      life: 0.5 + Math.random() * 0.5, color: colors[kind] || "#ffffff",
    });
  }
  return fx.particles.length;
}
export function updateParticles(fx, dt) {
  fx.particles = fx.particles.filter((p) => {
    p.x += p.vx * dt;
    p.z += p.vz * dt;
    p.life -= dt;
    return p.life > 0;
  });
  return fx.particles.length;
}
export function addShake(fx, amount) {
  fx.shake = Math.min(20, fx.shake + amount);
  return fx.shake;
}
export function updateShake(fx, dt) {
  fx.shake = Math.max(0, fx.shake - dt * 30);
  return fx.shake;
}
export function setSlowmo(fx, factor) { fx.slowmo = factor; return fx.slowmo; }
export function setVignette(fx, amount) { fx.vignette = Math.max(0, Math.min(1, amount)); return fx.vignette; }
export function setWeatherFx(fx, weather) { fx.weatherFx = weather; return fx.weatherFx; }
export function clearParticles(fx) { fx.particles = []; return fx; }
