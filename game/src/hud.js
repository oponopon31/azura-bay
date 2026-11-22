// hud.js — Round 7 HUD: dispatch top-left, weapons top-right, minimap
// bottom-left, speed bottom-right, mission objective top-centre, NPC dialogue
// with portrait bottom-centre. Every value is wired to live game state.
// Health / stamina / focus / oxygen bars sit under the dispatch panel.
import { WALLET_MAX, HEALTH_REGEN_CAP } from './config.js';

// Build the HUD panels into a container element. Returns the element refs.
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
    dispatch: mk('hud-dispatch', 'hud-corner hud-topleft'),
    status: mk('hud-status', 'hud-corner hud-topleft2'),
    topright: mk('hud-topright', 'hud-corner hud-topright'),
    objective: mk('hud-objective', 'hud-corner hud-topcenter'),
    dialogue: mk('hud-dialogue', 'hud-corner hud-bottomcenter'),
    vehicle: mk('hud-vehicle', 'hud-corner hud-bottomright'),
    profile: mk('hud-profile', 'hud-corner hud-bottomright2'),
    mapbox: mk('mapbox', 'hud-minimap'),
  };
}

// Read the live values from game state (pure, testable).
export function hudCorners(state) {
  const p = state.player;
  const e = state.economy;
  const pol = state.police;
  return {
    health: { value: p.health, max: p.maxHealth, regenCap: p.maxHealth * HEALTH_REGEN_CAP },
    stamina: { value: p.stamina, max: 100 },
    focus: { value: p.focus, max: 100 },
    oxygen: { value: p.oxygen, max: 100, shown: p.diving || p.swimming },
    buffs: {
      bodyArmor: !!state.cheatsActive?.includes('bodyarmor'),
      focusInfinite: !!state.cheatsActive?.includes('unlfocus'),
      adrenaline: p.adrenaline,
    },
    vehicle: state.vehicle
      ? { fuel: state.vehicle.fuel, engine: state.vehicle.health, lowFuel: state.vehicle.fuel < 25, engineFailing: state.vehicle.health < 0.35, speedKmh: state.vehicle.speedKmh || 0, name: state.vehicle.name || '' }
      : { speedKmh: 0, name: '' },
    wanted: { stars: pol.stars, state: pol.starState },
    dispatch: (state.dispatch || []).map((u) => ({ name: u.name, distance: u.distance, tactic: u.tactic })),
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
    profile: state.profileName,
    breakingPoint: !!state.breakingPoint,
    relationship: { value: p.relationship, label: relationshipLabel(p.relationship) },
    mission: state.mission || null,
    dialogue: state.dialogue || null,
    radio: state.radio || null,
  };
}

export function relationshipLabel(v) {
  if (v < 30) return 'Strained';
  if (v < 55) return 'Partners';
  if (v < 80) return 'In Sync';
  return 'Bonnie & Clyde';
}

// Update all HUD panels every frame from live state.
export function updateHudCorners(els, state) {
  const c = hudCorners(state);
  if (els.dispatch) {
    const rows = c.dispatch.map((u) =>
      `<div class="dispatch-row"><span class="dispatch-unit">${u.name}</span><span class="dispatch-dist">${Math.round(u.distance)}m</span><span class="dispatch-tactic">${u.tactic}</span></div>`).join('');
    els.dispatch.innerHTML =
      `<div class="dispatch-title">ABPD DISPATCH ${c.wanted.stars > 0 ? '— PURSUIT' : '— CLEAR'}</div>` +
      (rows || '<div class="dispatch-row">No units assigned</div>');
  }
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
  if (els.objective) {
    els.objective.innerHTML = c.mission
      ? `<div class="objective-title">${c.mission.title}</div><div class="objective-text">${c.mission.stage}</div>` +
        (c.mission.timer != null ? `<div class="objective-timer">${Math.floor(c.mission.timer / 60)}:${String(Math.floor(c.mission.timer % 60)).padStart(2, '0')}</div>` : '')
      : '';
  }
  if (els.dialogue) {
    els.dialogue.innerHTML = c.dialogue
      ? `<div class="dialogue-portrait" style="background:${c.dialogue.color}">${c.dialogue.initials}</div>` +
        `<div class="dialogue-body"><div class="dialogue-speaker">${c.dialogue.speaker}</div><div class="dialogue-line">${c.dialogue.line}</div></div>`
      : '';
  }
  if (els.vehicle) {
    const v = c.vehicle;
    els.vehicle.innerHTML =
      (v.name ? `<div class="speed-name">${v.name}</div>` : '') +
      `<div class="speed">${Math.round(v.speedKmh || 0)}<span> km/h</span></div>` +
      (state.vehicle && state.vehicle.fuel != null
        ? `<div class="fuel">FUEL ${Math.round(state.vehicle.fuel)}%${v.lowFuel ? ' — LOW FUEL' : ''}</div>` +
          `<div class="engine">ENGINE ${Math.round(state.vehicle.health * 100)}%${v.engineFailing ? ' — ENGINE FAILING' : ''}</div>`
        : '');
  }
  if (els.profile) {
    els.profile.innerHTML =
      `<div class="profile${c.breakingPoint ? ' breaking' : ''}">${c.profile}${c.breakingPoint ? ' — BREAKING POINT' : ''}</div>` +
      `<div class="relationship">${c.relationship.label} (${Math.round(c.relationship.value)})</div>` +
      (c.radio ? `<div class="radio">♪ ${c.radio}</div>` : '');
  }
  return c;
}

// Build tag shown in the pause menu.
export function setBuildTag(el, tag) {
  if (el) el.textContent = tag;
}

// Minimap: transparent, rounded corners (16px panel / 12px canvas),
// satellite top-down view. Blocks are drawn with a darker bottom edge so
// they read as raised. Pink GPS route from the player to the mission marker,
// following roads. Dispatch units show as blue dots, the mission marker as
// a gold diamond, the player as a white dot.
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
  // Dispatch units (blue dots).
  for (const u of state.dispatch || []) {
    if (!u.mm) continue;
    ctx.fillStyle = '#4db8ff';
    ctx.beginPath();
    ctx.arc(u.mm.x, u.mm.y, 3, 0, Math.PI * 2);
    ctx.fill();
  }
  // Mission marker (gold diamond).
  if (state.missionMarker) {
    ctx.fillStyle = '#ffd34d';
    ctx.beginPath();
    ctx.moveTo(state.missionMarker.x, state.missionMarker.y - 5);
    ctx.lineTo(state.missionMarker.x + 5, state.missionMarker.y);
    ctx.lineTo(state.missionMarker.x, state.missionMarker.y + 5);
    ctx.lineTo(state.missionMarker.x - 5, state.missionMarker.y);
    ctx.closePath();
    ctx.fill();
  }
  // Player dot.
  const pp = state.playerMm || { x: w / 2, y: h / 2 };
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(pp.x, pp.y, 4, 0, Math.PI * 2);
  ctx.fill();
}
