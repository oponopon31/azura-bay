// hud.js — Four-corner HUD, SPEC §29 (user spec 2026-11-21 15:40 WIB).
// Four panels wired to REAL game state — no fake / hardcoded values.
// All bars update every frame via updateHudCorners(); hudCorners() is the
// helper the selftest reads.
// Criminal Profile levels follow Bab 10 (Professional / Hardened /
// Violent & Dangerous / Psycho, + Irredeemable at the breaking point) —
// NOT the "Good / Neutral" wording from the HUD spec text (that was wrong).
import { WALLET_MAX, HEALTH_REGEN_CAP } from './config.js';

// Build the four HUD panels into a container element. Returns the element refs.
export function buildHud(container) {
  container.innerHTML = '';
  const mk = (id, cls) => {
    const el = document.createElement('div');
    el.id = id;
    el.className = cls;
    container.appendChild(el);
    return el;
  };
  return {
    status: mk('hud-status', 'hud-corner hud-topleft'),
    topright: mk('hud-topright', 'hud-corner hud-topright'),
    vehicle: mk('hud-vehicle', 'hud-corner hud-bottomleft'),
    profile: mk('hud-profile', 'hud-corner hud-bottomright'),
    mapbox: mk('mapbox', 'hud-minimap'),
  };
}

// Read the four corners' live values from game state (pure, testable).
export function hudCorners(state) {
  const p = state.player;
  const e = state.economy;
  const pol = state.police;
  return {
    // Top-left: Health (pink heart), Stamina (lime lightning), Focus (purple
    // eye, slow-mo aiming), Oxygen (O2, diving), Buff & Adrenaline badges.
    health: { value: p.health, max: p.maxHealth, regenCap: p.maxHealth * HEALTH_REGEN_CAP },
    stamina: { value: p.stamina, max: 100 },
    focus: { value: p.focus, max: 100 },
    oxygen: { value: p.oxygen, max: 100, shown: p.diving || p.swimming },
    buffs: {
      bodyArmor: !!state.cheatsActive?.includes('bodyarmor'),
      focusInfinite: !!state.cheatsActive?.includes('unlfocus'),
      adrenaline: p.adrenaline,
    },
    // Bottom-left: minimap + vehicle warnings (fuel / engine).
    vehicle: state.vehicle
      ? { fuel: state.vehicle.fuel, engine: state.vehicle.health, lowFuel: state.vehicle.fuel < 25, engineFailing: state.vehicle.health < 0.35 }
      : null,
    // Top-right: Wanted & Heat + clue chips, weapon/ammo, cash + BuckMe.
    wanted: { stars: pol.stars, state: pol.starState },
    clues: {
      cctv: !!pol.memory.cctv,
      face: !!pol.seenNow,
      clothes: !!pol.memory.outfit,
      vehicle: !!pol.memory.vehicle,
    },
    weapon: state.weapon ? { name: state.weapon.name, mag: state.weapon.mag, reserve: state.weapon.reserve } : null,
    cash: e.cash,
    buckme: e.buckme,
    walletMax: WALLET_MAX,
    // Bottom-right: Criminal Profile + Relationship Status.
    profile: state.profileName,
    breakingPoint: !!state.breakingPoint,
    relationship: { value: p.relationship, label: relationshipLabel(p.relationship) },
  };
}

export function relationshipLabel(v) {
  if (v < 30) return 'Strained';
  if (v < 55) return 'Partners';
  if (v < 80) return 'In Sync';
  return 'Bonnie & Clyde';
}

// Update all four corners every frame from live state.
export function updateHudCorners(els, state) {
  const c = hudCorners(state);
  if (els.status) {
    els.status.innerHTML =
      `<div class="bar health" style="--v:${c.health.value}%"><span>♥</span></div>` +
      `<div class="bar stamina" style="--v:${c.stamina.value}%"><span>⚡</span></div>` +
      `<div class="bar focus" style="--v:${c.focus.value}%"><span>◉</span></div>` +
      (c.oxygen.shown ? `<div class="bar oxygen" style="--v:${c.oxygen.value}%"><span>O₂</span></div>` : '') +
      (c.buffs.bodyArmor ? '<span class="badge">BODY ARMOR</span>' : '') +
      (c.buffs.focusInfinite ? '<span class="badge">FOCUS ∞</span>' : '') +
      (c.buffs.adrenaline >= 0.5 ? '<span class="badge">ADRENALINE</span>' : '');
  }
  if (els.topright) {
    const chips = [
      c.clues.cctv ? 'CCTV' : '', c.clues.face ? 'FACE' : '',
      c.clues.clothes ? 'CLOTHES' : '', c.clues.vehicle ? 'VEHICLE' : '',
    ].filter(Boolean).join(' ');
    els.topright.innerHTML =
      `<div class="stars">${'★'.repeat(c.wanted.stars)}${'☆'.repeat(6 - c.wanted.stars)}</div>` +
      (chips ? `<div class="clues">${chips}</div>` : '') +
      (c.weapon ? `<div class="weapon">${c.weapon.name} ${c.weapon.mag}/${c.weapon.reserve}</div>` : '') +
      `<div class="money">$${c.cash.toLocaleString()} · BuckMe $${c.buckme.toLocaleString()}</div>`;
  }
  if (els.vehicle) {
    els.vehicle.innerHTML = c.vehicle
      ? `<div class="fuel">FUEL ${Math.round(c.vehicle.fuel)}%${c.vehicle.lowFuel ? ' — LOW FUEL' : ''}</div>` +
        `<div class="engine">ENGINE ${Math.round(c.vehicle.engine * 100)}%${c.vehicle.engineFailing ? ' — ENGINE FAILING' : ''}</div>`
      : '';
  }
  if (els.profile) {
    els.profile.innerHTML =
      `<div class="profile${c.breakingPoint ? ' breaking' : ''}">${c.profile}${c.breakingPoint ? ' — BREAKING POINT' : ''}</div>` +
      `<div class="relationship">${c.relationship.label} (${Math.round(c.relationship.value)})</div>`;
  }
  return c;
}

// Build tag shown in the pause menu.
export function setBuildTag(el, tag) {
  if (el) el.textContent = tag;
}

// Minimap: transparent, rounded corners (16px panel / 12px canvas),
// satellite top-down view. Blocks are drawn with a darker bottom edge so
// they read as raised (pseudo-3D — true 3D tilt is impossible on a 2D canvas,
// so this is the honest documentation: satellite top-down with block shadow).
// Pink GPS route from the player to the mission marker, following roads.
export function drawMinimap(ctx, state) {
  const w = ctx.canvas.width;
  const h = ctx.canvas.height;
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = 'rgba(20, 40, 30, 0.55)';
  ctx.fillRect(0, 0, w, h);
  // City blocks (pseudo-3D: darker bottom edge).
  for (const b of state.mapBlocks || []) {
    ctx.fillStyle = '#3a4a42';
    ctx.fillRect(b.x, b.y, b.w, b.h);
    ctx.fillStyle = '#223028';
    ctx.fillRect(b.x, b.y + b.h - 3, b.w, 3);
  }
  // Pink GPS route: player -> road -> marker.
  if (state.gpsRoute && state.gpsRoute.length > 1) {
    ctx.strokeStyle = '#ff4d9d';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(state.gpsRoute[0].x, state.gpsRoute[0].y);
    for (const pt of state.gpsRoute.slice(1)) ctx.lineTo(pt.x, pt.y);
    ctx.stroke();
  }
  // Player dot.
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(w / 2, h / 2, 4, 0, Math.PI * 2);
  ctx.fill();
}
