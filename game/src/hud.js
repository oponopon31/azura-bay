// hud.js — Round 7 HUD (r18 rebuild): mission panel top-left, ABPD dispatch
// below it, location + minimap + health/armour bottom-left, clock/money/stars
// top-right, rank + weapon slots + crew middle-right, speed bottom-right,
// NPC dialogue with portrait bottom-centre. Every value is wired to live
// game state; where the game has no live value (rank/RP, armour, zone
// status) a fixed consistent value from state is used.
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
    mission: mk('hud-mission', 'hud-panel hud-mission'),
    dispatch: mk('hud-dispatch', 'hud-panel hud-dispatch'),
    status: mk('hud-status', 'hud-panel hud-status'),
    topright: mk('hud-topright', 'hud-panel hud-topright'),
    rank: mk('hud-rank', 'hud-panel hud-rank'),
    location: mk('hud-location', 'hud-panel hud-location'),
    dialogue: mk('hud-dialogue', 'hud-corner hud-bottomcenter'),
    vehicle: mk('hud-vehicle', 'hud-corner hud-bottomright'),
    vitals: mk('hud-vitals', 'hud-panel hud-vitals'),
    mapbox: mk('mapbox', 'hud-minimap'),
  };
}

// ---- face portraits ---------------------------------------------------------
// Low-poly face portraits drawn on canvas (blocky art style, distinct per
// character: skin tone, hair shape/colour, beard/mustache). Data URLs are
// cached; generation is lazy and browser-only so node (selftest) never
// touches document.
const PORTRAIT_STYLES = {
  'Mara Solano': { skin: '#e8b48c', hair: '#3a2418', style: 'long', bg: '#c94f7c' },
  'Cole Reyes': { skin: '#d9a986', hair: '#161616', style: 'short', bg: '#2a6db0' },
  'Rico Vega': { skin: '#b57a4e', hair: '#111111', style: 'short', mustache: true, bg: '#b03a2e' },
  'Gus Marlowe': { skin: '#e0b48f', hair: '#c8c8c8', style: 'short', beard: true, bg: '#8a6d3b' },
  'Luxe': { skin: '#8a5a3b', hair: '#f2c94d', style: 'long', bg: '#d4a017' },
  'Dale Mercer': { skin: '#d9a986', hair: '#5b4a35', style: 'short', bg: '#5b8c5a' },
  'Dario Quinn': { skin: '#c98f5f', hair: '#0d0d0d', style: 'slick', bg: '#7a5fb0' },
  'Marlon Keene': { skin: '#a06a42', hair: '#111111', style: 'short', beard: true, bg: '#2e86ab' },
};
const portraitCache = new Map();
export function portraitUrl(name) {
  if (typeof document === 'undefined') return '';
  if (portraitCache.has(name)) return portraitCache.get(name);
  const s = PORTRAIT_STYLES[name] || { skin: '#d9a986', hair: '#333333', style: 'short', bg: '#555555' };
  const c = document.createElement('canvas');
  c.width = 96; c.height = 96;
  const g = c.getContext('2d');
  g.fillStyle = s.bg;
  g.fillRect(0, 0, 96, 96);
  // Long hair falls behind the face.
  if (s.style === 'long') {
    g.fillStyle = s.hair;
    g.beginPath(); g.ellipse(48, 52, 30, 38, 0, 0, Math.PI * 2); g.fill();
  }
  // Face.
  g.fillStyle = s.skin;
  g.beginPath(); g.ellipse(48, 50, 22, 26, 0, 0, Math.PI * 2); g.fill();
  // Beard covers the jaw.
  if (s.beard) {
    g.fillStyle = s.hair;
    g.beginPath(); g.ellipse(48, 66, 20, 14, 0, 0, Math.PI); g.fill();
  }
  // Hair on top.
  g.fillStyle = s.hair;
  if (s.style === 'long') {
    g.beginPath(); g.ellipse(48, 34, 23, 16, 0, Math.PI, 0); g.fill();
    g.fillRect(24, 30, 6, 26);
    g.fillRect(66, 30, 6, 26);
  } else if (s.style === 'slick') {
    g.beginPath(); g.ellipse(48, 30, 22, 12, 0, Math.PI, 0); g.fill();
    g.fillRect(26, 28, 44, 4);
  } else {
    g.beginPath(); g.ellipse(48, 32, 22, 14, 0, Math.PI, 0); g.fill();
  }
  // Eyes + brows.
  g.fillStyle = '#1a1a1a';
  g.beginPath(); g.arc(39, 48, 2.6, 0, Math.PI * 2); g.fill();
  g.beginPath(); g.arc(57, 48, 2.6, 0, Math.PI * 2); g.fill();
  g.fillStyle = s.hair;
  g.fillRect(35, 41, 9, 2.5);
  g.fillRect(52, 41, 9, 2.5);
  // Nose.
  g.strokeStyle = 'rgba(0,0,0,0.35)';
  g.lineWidth = 2;
  g.beginPath(); g.moveTo(48, 50); g.lineTo(48, 58); g.stroke();
  // Mustache.
  if (s.mustache) {
    g.fillStyle = s.hair;
    g.fillRect(40, 60, 16, 4);
  }
  // Mouth.
  g.strokeStyle = '#5a2a1a';
  g.lineWidth = 2.5;
  g.beginPath();
  if (s.beard) { g.moveTo(42, 68); g.lineTo(54, 68); }
  else { g.arc(48, 66, 6, 0.15 * Math.PI, 0.85 * Math.PI); }
  g.stroke();
  const url = c.toDataURL('image/png');
  portraitCache.set(name, url);
  return url;
}

// ---- weapon slot icons ------------------------------------------------------
// Simple silhouettes (gold on transparent) so the 5 slots read as weapons
// at a glance instead of text-only labels. Keyed by slot number.
const WEAPON_ICONS = {
  fist: '<svg viewBox="0 0 32 20" xmlns="http://www.w3.org/2000/svg"><path fill="#ffd34d" d="M7 2h13a4 4 0 0 1 4 4v4a8 8 0 0 1-8 8H9a4 4 0 0 1-4-4V6a4 4 0 0 1 2-4z"/><rect x="8" y="2" width="2.5" height="7" fill="#0a1420"/><rect x="13" y="2" width="2.5" height="7" fill="#0a1420"/><rect x="18" y="2" width="2.5" height="7" fill="#0a1420"/></svg>',
  pistol: '<svg viewBox="0 0 32 20" xmlns="http://www.w3.org/2000/svg"><path fill="#ffd34d" d="M3 2h24a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-9l-2 9a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2l2-9H3a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"/></svg>',
  smg: '<svg viewBox="0 0 32 20" xmlns="http://www.w3.org/2000/svg"><path fill="#ffd34d" d="M2 4h20v3h8v3h-8v1h-6l-2 7H9l2-7H2V4z"/><rect x="12" y="11" width="5" height="7" fill="#ffd34d"/></svg>',
  rifle: '<svg viewBox="0 0 32 20" xmlns="http://www.w3.org/2000/svg"><path fill="#ffd34d" d="M1 7h29a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H19l-1 5a1 1 0 0 1-1 1h-3a1 1 0 0 1-1-1l1-5H9l-1 4a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1l1-4H1a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1z"/></svg>',
  shotgun: '<svg viewBox="0 0 32 20" xmlns="http://www.w3.org/2000/svg"><path fill="#ffd34d" d="M1 6h30v3H15l-1 7a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1l1-7H1V6z"/><rect x="14" y="10" width="9" height="3" fill="#0a1420"/></svg>',
};

function esc(s) {
  return String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;');
}

// Read the live values from game state (pure, testable).
export function hudCorners(state) {
  const p = state.player;
  const e = state.economy;
  const pol = state.police;
  const m = state.mission || null;
  const rank = state.rank || { letter: 'B', title: 'FIXER', rp: 3900, rpMax: 5200 };
  const loc = state.location || { area: 'Azura Bay', street: 'Coral Drive', zone: 'NEUTRAL', value: 58 };
  const crew = (state.featured && state.featured.crew) || [];
  const w = state.weapon;
  const slots = [
    { n: 1, name: 'FISTS', ammo: '∞', active: !w, icon: 'fist' },
    { n: 2, name: w ? shortWeapon(w.name) : 'ES9', ammo: w ? `${w.mag}/${w.reserve}` : '15/45', active: !!w, icon: 'pistol' },
    { n: 3, name: 'MK-5', ammo: '30/60', active: false, icon: 'smg' },
    { n: 4, name: 'AZ1200', ammo: '8/16', active: false, icon: 'rifle' },
    { n: 5, name: '556', ammo: '30/60', active: false, icon: 'shotgun' },
  ];
  return {
    health: { value: p.health, max: p.maxHealth, regenCap: p.maxHealth * HEALTH_REGEN_CAP },
    armour: p.armour != null ? p.armour : 55,
    stamina: { value: p.stamina, max: 100 },
    focus: { value: p.focus, max: 100 },
    oxygen: { value: p.oxygen, max: 100, shown: p.diving || p.swimming },
    buffs: {
      bodyArmor: !!state.cheatsActive?.includes('bodyarmor'),
      focusInfinite: !!state.cheatsActive?.includes('unlfocus'),
      adrenaline: p.adrenaline,
    },
    vehicle: state.vehicle
      ? { fuel: state.vehicle.fuel, engine: state.vehicle.health, lowFuel: state.vehicle.fuel < 25, engineFailing: state.vehicle.health < 0.35, speedKmh: state.vehicle.speedKmh || 0, name: state.vehicle.name || '', dented: state.vehicle.health != null ? Math.round((1 - state.vehicle.health) * 100) : 0 }
      : { speedKmh: 0, name: '', dented: 0 },
    wanted: { stars: pol.stars, state: pol.starState },
    airUnit: pol.stars > 0 || !!state.airUnit,
    dispatch: (state.dispatch || []).map((u) => ({ name: u.name, distance: u.distance, tactic: u.tactic })),
    clues: {
      cctv: !!pol.memory.cctv,
      face: !!pol.seenNow,
      clothes: !!pol.memory.outfit,
      vehicle: !!pol.memory.vehicle,
    },
    weapon: w ? { name: w.name, mag: w.mag, reserve: w.reserve } : null,
    slots,
    cash: e.cash,
    buckme: e.buckme,
    walletMax: WALLET_MAX,
    profile: state.profileName,
    breakingPoint: !!state.breakingPoint,
    relationship: { value: p.relationship, label: relationshipLabel(p.relationship) },
    mission: m,
    dialogue: state.dialogue || null,
    radio: state.radio || null,
    rank,
    crew: crew.slice(0, 3).map((c, i) => ({ name: c.name, ability: c.ability, key: ['Z', 'X', 'C'][i] || '' })),
    location: loc,
    clock: formatClock(state.clockHour != null ? state.clockHour : 18.5),
  };
}

function shortWeapon(name) {
  const parts = String(name).split(' ');
  return parts[parts.length - 1];
}

function formatClock(hour) {
  const h = Math.floor(hour) % 24;
  const min = Math.floor((hour % 1) * 60);
  return `${String(h).padStart(2, '0')}:${String(min).padStart(2, '0')}`;
}

export function relationshipLabel(v) {
  if (v < 30) return 'Strained';
  if (v < 55) return 'Partners';
  if (v < 80) return 'In Sync';
  return 'Bonnie & Clyde';
}

// 'Unit 7 "Harbor"' -> 'HARBOR-7'; 'Air 1 "Falcon"' -> 'AIR-1'.
export function dispatchShortName(name) {
  const unit = String(name).match(/Unit (\d+) "([^"]+)"/);
  if (unit) return `${unit[2]}-${unit[1]}`.toUpperCase();
  const air = String(name).match(/Air (\d+) "([^"]+)"/);
  if (air) return `AIR-${air[1]}`;
  return String(name).toUpperCase();
}

// Update all HUD panels every frame from live state.
export function updateHudCorners(els, state) {
  const c = hudCorners(state);
  if (els.mission) {
    const m = c.mission;
    els.mission.innerHTML = m
      ? `<div class="mission-head">MISSION ${m.n != null ? m.n : ''} · ${esc(m.title)}</div>` +
        `<div class="mission-stage">STAGE ${m.stageIndex != null ? m.stageIndex : 1}/${m.stageCount != null ? m.stageCount : 1} ${esc(m.stage)}</div>` +
        `<div class="mission-obj">${esc(m.objective || m.stage)}</div>` +
        (m.next ? `<div class="mission-next">NEXT&nbsp; ${esc(m.next)}</div>` : '') +
        (m.timer != null ? `<div class="mission-timer">${Math.floor(m.timer / 60)}:${String(Math.floor(m.timer % 60)).padStart(2, '0')}</div>` : '')
      : '';
  }
  if (els.dispatch) {
    const shown = c.dispatch.slice(0, 5);
    const rows = shown.map((u) =>
      `<div class="dispatch-row"><span class="dispatch-unit">${esc(dispatchShortName(u.name))}</span><span class="dispatch-tactic">${esc(u.tactic)}</span><span class="dispatch-dist">${Math.round(u.distance)} m</span></div>`).join('');
    els.dispatch.innerHTML =
      `<div class="dispatch-title">ABPD RESPONSE — ${c.dispatch.length} UNITS</div>` +
      (rows || '<div class="dispatch-row">No units assigned</div>') +
      (c.dispatch.length > 5 ? `<div class="dispatch-more">+${c.dispatch.length - 5} more</div>` : '');
  }
  // Status panel no longer holds STAMINA/FOCUS: at its old fixed position
  // (top: 320px) the bars overlapped the dispatch panel's "+1 more" line
  // whenever the dispatch list ran long, and floated mid-left when it ran
  // short. STAMINA/FOCUS now live in the vitals panel, directly under
  // HEALTH/ARMOUR. Only O2 (diving) and buff badges stay here.
  if (els.status) {
    els.status.innerHTML =
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
      `<div class="clock">${c.clock}</div>` +
      `<div class="money">$${c.cash.toLocaleString()}</div>` +
      `<div class="stars">${'★'.repeat(c.wanted.stars)}${'☆'.repeat(6 - c.wanted.stars)}</div>` +
      (c.airUnit ? '<div class="airunit">AIR UNIT DEPLOYED</div>' : '') +
      (chips ? `<div class="clues">${chips}</div>` : '') +
      `<div class="profile${c.breakingPoint ? ' breaking' : ''}">${esc(c.profile)}${c.breakingPoint ? ' — BREAKING POINT' : ''}</div>` +
      `<div class="relationship">${c.relationship.label} (${Math.round(c.relationship.value)})</div>`;
  }
  if (els.rank) {
    const slots = c.slots.map((s) =>
      `<div class="slot${s.active ? ' active' : ''}"><span class="slot-n">${s.n}</span><span class="slot-icon">${WEAPON_ICONS[s.icon] || ''}</span><span class="slot-name">${esc(s.name)}</span><span class="slot-ammo">${esc(s.ammo)}</span></div>`).join('');
    const crew = c.crew.map((k) => {
      const ability = String(k.ability || '').split(' — ')[0].toUpperCase();
      return `<div class="crew-card"><img class="crew-portrait" src="${portraitUrl(k.name)}" alt=""><span class="crew-key">${esc(k.key)}</span><span class="crew-body"><span class="crew-ability">${esc(ability)}</span><span class="crew-name">${esc(k.name)} · Crew</span></span></div>`;
    }).join('');
    els.rank.innerHTML =
      `<div class="rank-head"><span class="rank-badge">RANK ${esc(c.rank.letter)}</span><span class="rank-title">${esc(c.rank.title)}</span></div>` +
      `<div class="rp-bar"><span style="width:${Math.round((c.rank.rp / c.rank.rpMax) * 100)}%"></span></div>` +
      `<div class="rp-text">${c.rank.rp.toLocaleString()} / ${c.rank.rpMax.toLocaleString()} RP</div>` +
      `<div class="slots">${slots}</div>` +
      (crew ? `<div class="crew">${crew}</div>` : '');
  }
  if (els.location) {
    const l = c.location;
    els.location.innerHTML =
      `<div class="loc-area">${esc(l.area).toUpperCase()}</div>` +
      `<div class="loc-street">${esc(l.street)}</div>` +
      `<div class="loc-zone">${esc(l.zone)} · ${l.value}</div>`;
  }
  if (els.vitals) {
    els.vitals.innerHTML =
      `<div class="vitals-row"><span>HEALTH</span><div class="bar health" style="--v:${c.health.value}%"></div><b>${Math.round(c.health.value)}</b></div>` +
      `<div class="vitals-row"><span>ARMOUR</span><div class="bar armour" style="--v:${c.armour}%"></div><b>${Math.round(c.armour)}</b></div>` +
      `<div class="vitals-row"><span>STAMINA</span><div class="bar stamina" style="--v:${c.stamina.value}%"></div><b>${Math.round(c.stamina.value)}</b></div>` +
      `<div class="vitals-row"><span>FOCUS</span><div class="bar focus" style="--v:${c.focus.value}%"></div><b>${Math.round(c.focus.value)}</b></div>`;
  }
  if (els.dialogue) {
    els.dialogue.innerHTML = c.dialogue
      ? `<img class="dialogue-portrait" src="${portraitUrl(c.dialogue.speaker)}" alt="">` +
        `<div class="dialogue-body"><div class="dialogue-speaker">${c.dialogue.speaker}</div><div class="dialogue-line">${c.dialogue.line}</div></div>`
      : '';
  }
  if (els.vehicle) {
    const v = c.vehicle;
    els.vehicle.innerHTML =
      `<div class="speed">${Math.round(v.speedKmh || 0)}<span> KM/H</span></div>` +
      (v.name ? `<div class="speed-name">${esc(v.name)}</div>` : '') +
      (state.vehicle ? `<div class="dented">${v.dented}% DENTED</div>` : '') +
      (state.vehicle && state.vehicle.fuel != null
        ? `<div class="fuel">FUEL ${Math.round(state.vehicle.fuel)}%${v.lowFuel ? ' — LOW FUEL' : ''} · ENGINE ${Math.round(state.vehicle.health * 100)}%${v.engineFailing ? ' — ENGINE FAILING' : ''}</div>`
        : '') +
      (c.radio ? `<div class="radio">♪ ${esc(c.radio)}</div>` : '');
  }
  return c;
}

// Build tag shown in the pause menu.
export function setBuildTag(el, tag) {
  if (el) el.textContent = tag;
}

// Minimap: player-centred, zoomed (1.6x) open-world-style top-down view.
// BLUE sea east of the beach, light-brown beach sand, roads drawn as LINES
// (avenues + streets from the city road grid), varied-colour city blocks,
// clear coastline. Markers on top: player = white arrow centred, mission =
// gold diamond, police = blue dots, pink GPS route following roads.
// All state coords arrive in the old minimap space (90 + world*0.55);
// they are converted back to world coords, then re-projected centred on
// the player: screen = centre + (world - player) * 0.55 * ZOOM.
export function drawMinimap(ctx, state) {
  const w = ctx.canvas.width;
  const h = ctx.canvas.height;
  const C = w / 2;
  const ZOOM = 1.6;
  const S = 0.55 * ZOOM;
  const pp = state.playerMm || { x: 90, y: 90 };
  const px = (pp.x - 90) / 0.55;
  const pz = (pp.y - 90) / 0.55;
  const X = (wx) => C + (wx - px) * S;
  const Y = (wz) => C + (wz - pz) * S;
  const toWorld = (mm) => ({ x: (mm.x - 90) / 0.55, z: (mm.y - 90) / 0.55 });

  // Land base.
  ctx.fillStyle = '#3f4a3c';
  ctx.fillRect(0, 0, w, h);
  // Beach sand band (world x 90..125, east of Coral Drive).
  ctx.fillStyle = '#d9c08a';
  ctx.fillRect(X(90), 0, X(125) - X(90), h);
  // Blue sea (world x > 125).
  ctx.fillStyle = '#2568a8';
  ctx.fillRect(X(125), 0, w - X(125), h);
  // Coastline edge.
  ctx.strokeStyle = '#f2e2b0';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(X(125), 0);
  ctx.lineTo(X(125), h);
  ctx.stroke();

  // Roads as lines: avenues (north-south) + streets (east-west).
  const avenues = [-90, -60, -30, 0, 30, 60, 90];
  const streets = [-120, -90, -60, -30, 0, 30, 60, 90, 120];
  ctx.strokeStyle = '#cfc9b8';
  ctx.lineCap = 'round';
  for (const ax of avenues) {
    ctx.lineWidth = ax === 90 ? 5 : 3;
    ctx.beginPath();
    ctx.moveTo(X(ax), -10);
    ctx.lineTo(X(ax), h + 10);
    ctx.stroke();
  }
  for (const sz of streets) {
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-10, Y(sz));
    ctx.lineTo(w + 10, Y(sz));
    ctx.stroke();
  }

  // City blocks, varied colours, darker bottom edge.
  const palette = ['#6b7a5e', '#7a6a58', '#5e6b7a', '#8a7a5e', '#6e5a6e', '#7a7a6a', '#5a7a6e'];
  (state.mapBlocks || []).forEach((b, i) => {
    const bw = toWorld(b);
    const bw2 = b.w / 0.55;
    const bh2 = b.h / 0.55;
    const sx = X(bw.x);
    const sy = Y(bw.z);
    const sw = bw2 * S;
    const sh = bh2 * S;
    ctx.fillStyle = palette[i % palette.length];
    ctx.fillRect(sx, sy, sw, sh);
    ctx.fillStyle = 'rgba(0,0,0,0.25)';
    ctx.fillRect(sx, sy + sh - 2, sw, 2);
  });

  // Pink GPS route: player -> road -> marker.
  if (state.gpsRoute && state.gpsRoute.length > 1) {
    ctx.strokeStyle = '#ff4d9d';
    ctx.lineWidth = 3;
    ctx.beginPath();
    state.gpsRoute.forEach((pt, i) => {
      const q = toWorld(pt);
      if (i === 0) ctx.moveTo(X(q.x), Y(q.z));
      else ctx.lineTo(X(q.x), Y(q.z));
    });
    ctx.stroke();
  }
  // Dispatch units (blue dots).
  for (const u of state.dispatch || []) {
    if (!u.mm) continue;
    const q = toWorld(u.mm);
    ctx.fillStyle = '#4db8ff';
    ctx.beginPath();
    ctx.arc(X(q.x), Y(q.z), 3, 0, Math.PI * 2);
    ctx.fill();
  }
  // Mission marker (gold diamond).
  if (state.missionMarker) {
    const q = toWorld(state.missionMarker);
    const mx = X(q.x);
    const my = Y(q.z);
    ctx.fillStyle = '#ffd34d';
    ctx.beginPath();
    ctx.moveTo(mx, my - 5);
    ctx.lineTo(mx + 5, my);
    ctx.lineTo(mx, my + 5);
    ctx.lineTo(mx - 5, my);
    ctx.closePath();
    ctx.fill();
  }
  // Player: white arrow centred.
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.moveTo(C, C - 7);
  ctx.lineTo(C + 5, C + 5);
  ctx.lineTo(C, C + 2);
  ctx.lineTo(C - 5, C + 5);
  ctx.closePath();
  ctx.fill();
  // North indicator.
  ctx.fillStyle = 'rgba(255,255,255,0.85)';
  ctx.font = 'bold 11px system-ui, sans-serif';
  ctx.fillText('N', 8, 15);
}
