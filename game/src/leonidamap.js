// leonidamap.js — The 2D Leonida map (SPEC Bab 28 + MAP-DATA.md (g)).
// Built from the 26 gtabase coordinates measured live 2026-11-21
// (cursor reading, X east, Y north, tolerance ±40). Range:
// X −7,088 (Capri) .. +1,530 (Vice Beach); Y −6,470 (Goose Key Marina)
// .. +6,440 (Mount Kalaga). Breakwater Quarry uses the CORRECTED
// −4,462/−922 — never the old −4,600/+643. Goose Key's airfield is a
// DIFFERENT field from VCIA (~7,100 units apart).
// Layers: 6 regions + 5 counties + 10 Cities & Towns + Vice City district
// labels (La Perle, Bayside, Salton, Southside, Balsero, Decor District)
// + Millport + Emerald Springs clusters + Goose Key + Gellhorn
// International Raceway (Landmark) + Breakwater Quarry (Under the Bridge
// collectible, NOT a town) + Lake Leonida + VCIA + Vice City Port.
// Round 5: table rows re-expressed one field per line. Values unchanged.

export const MAP_POINTS = [
  // 10 Cities & Towns (gtabase)
  {
    name: 'Key Lento',
    x: -2366,
    y: -5992,
    kind: 'town',
    region: 'Leonida Keys',
  },
  {
    name: 'Hamlet',
    x: -2864,
    y: -3120,
    kind: 'town',
    region: 'Leonida Keys',
  },
  {
    name: 'Watson Bay',
    x: -4862,
    y: -3404,
    kind: 'town',
    region: 'Leonida Keys',
  },
  {
    name: 'Capri',
    x: -7088,
    y: 202,
    kind: 'town',
    region: 'Leonida Keys',
  },
  {
    name: 'Gloriana Key',
    x: 722,
    y: -1398,
    kind: 'town',
    region: 'Leonida Keys',
  },
  {
    name: 'Vice City',
    x: -220,
    y: 756,
    kind: 'town',
    region: 'Vice City',
  },
  {
    name: 'Vice Beach',
    x: 1530,
    y: 896,
    kind: 'town',
    region: 'Vice City',
  },
  {
    name: 'Waning Sands',
    x: -244,
    y: 4028,
    kind: 'town',
    region: 'Vice City',
  },
  {
    name: 'Ambrosia',
    x: -3040,
    y: 4234,
    kind: 'town',
    region: 'Leonida Keys',
  },
  {
    name: 'Port Gellhorn',
    x: -6560,
    y: 4264,
    kind: 'town',
    region: 'Port Gellhorn',
  },
  // Vice City district labels (NOT towns)
  {
    name: 'Millport',
    x: -712,
    y: 6244,
    kind: 'district',
    region: 'Vice City',
    note: 'Town label + 12 locations',
  },
  {
    name: 'Emerald Springs',
    x: -3960,
    y: 2164,
    kind: 'district',
    region: 'Leonida Keys',
    note: '5-location cluster',
  },
  {
    name: 'La Perle',
    x: -762,
    y: 1776,
    kind: 'district',
    region: 'Vice City',
  },
  {
    name: 'Bayside',
    x: -440,
    y: 1298,
    kind: 'district',
    region: 'Vice City',
  },
  {
    name: 'Salton',
    x: -1414,
    y: -536,
    kind: 'district',
    region: 'Vice City',
  },
  {
    name: 'Southside',
    x: -1632,
    y: -2122,
    kind: 'district',
    region: 'Vice City',
  },
  {
    name: 'Balsero',
    x: -2218,
    y: 460,
    kind: 'district',
    region: 'Vice City',
  },
  {
    name: 'Decor District',
    x: -296,
    y: 2168,
    kind: 'district',
    region: 'Vice City',
  },
  {
    name: 'Goose Key',
    x: -6226,
    y: -6470,
    kind: 'island',
    region: 'Leonida Keys',
    note: 'Island label; its own airfield, NOT VCIA',
  },
  // Landmarks
  {
    name: 'Gellhorn International Raceway',
    x: -6718,
    y: 2376,
    kind: 'landmark',
    region: 'Port Gellhorn',
  },
  {
    name: 'Leonida Keys',
    x: -4166,
    y: -6422,
    kind: 'region',
    region: 'Leonida Keys',
  },
  {
    name: 'Grassrivers',
    x: -3280,
    y: -4270,
    kind: 'region',
    region: 'Leonida Keys',
  },
  {
    name: 'Mount Kalaga',
    x: -3396,
    y: 6440,
    kind: 'landmark',
    region: 'Mount Kalaga',
  },
  {
    name: 'Lake Leonida',
    x: -1948,
    y: 4794,
    kind: 'lake',
    region: 'Leonida Keys',
  },
  {
    name: 'VCIA',
    x: -2118,
    y: -662,
    kind: 'airport',
    region: 'Vice City',
  },
  {
    name: 'Vice City Port',
    x: 854,
    y: -390,
    kind: 'port',
    region: 'Vice City',
  },
  // Collectible, NOT a town
  {
    name: 'Breakwater Quarry',
    x: -4462,
    y: -922,
    kind: 'collectible',
    region: 'Leonida Keys',
    note: 'Under the Bridge 177/202 — NOT a town',
  },
];

export const MAP_REGIONS = ['Vice City', 'Leonida Keys', 'Port Gellhorn', 'Mount Kalaga', 'Grassrivers', 'Ambrosia'];
export const MAP_COUNTIES = ['Vice-Dale', 'Leonard', 'Kelly', 'Mariana', 'Lummox'];

// 23 in-game map icons (gtabase Icons Guide).
export const MAP_ICONS = [
  'Safehouse', 'Gun Store', 'Garage', 'Hospital', 'Police Station', 'Clothing',
  'Barber', 'Tattoo', 'Nightclub', 'Bar', 'Restaurant', 'Gas Station',
  'Car Wash', 'Mod Shop', 'Pawn Shop', 'Fence', 'ATM', 'Taxi', 'Bus Stop',
  'Train Station', 'Airport', 'Marina', 'Collectible',
];

// gtabase X/Y -> game-map px. X range −7,088..+1,530, Y range −6,470..+6,440.
export const MAP_BOUNDS = { x0: -7088, x1: 1530, y0: -6470, y1: 6440 };

export function gtabaseToMap(x, y, w, h) {
  const px = ((x - MAP_BOUNDS.x0) / (MAP_BOUNDS.x1 - MAP_BOUNDS.x0)) * w;
  const py = (1 - (y - MAP_BOUNDS.y0) / (MAP_BOUNDS.y1 - MAP_BOUNDS.y0)) * h;
  return { px, py };
}

export function createLeonidaMap(Game) {
  const LM = {
    points: MAP_POINTS,
    regions: MAP_REGIONS,
    counties: MAP_COUNTIES,
    icons: MAP_ICONS,
    waypoint: null, // {x, y} gtabase coords
    fog: {},        // region -> true when explored (Fog of War)
    exploredPercent: 0,
    // Fog of War: a region is explored when the player spends time there.
    // Here the playable city maps to Vice City; the rest opens with story
    // progress (chapters) and with map travel.
    explore(region) {
      if (!this.fog[region]) {
        this.fog[region] = true;
        this.exploredPercent = Math.round((Object.keys(this.fog).length / MAP_REGIONS.length) * 100);
        Game.hud.toast(`Map explored: ${region} (${this.exploredPercent}% of Leonida).`);
        if (Game.stats) Game.stats.mapExplored = this.exploredPercent;
      }
    },
    setWaypoint(name) {
      const p = MAP_POINTS.find((q) => q.name === name);
      if (!p) return null;
      this.waypoint = { x: p.x, y: p.y, name: p.name };
      Game.hud.toast(`Waypoint set: ${p.name}.`);
      return this.waypoint;
    },
    clearWaypoint() { this.waypoint = null; },
    // ---- Save / load (Fog of War) ----
    serializeFog() { return { fog: this.fog, exploredPercent: this.exploredPercent }; },
    restoreFog(data) {
      if (data.fog) this.fog = data.fog;
      if (typeof data.exploredPercent === 'number') this.exploredPercent = data.exploredPercent;
    },
    // Render the 2D map into the overlay element (canvas + index panel).
    render(el) {
      const W = Math.min(900, window.innerWidth - 60);
      const H = Math.min(620, window.innerHeight - 60);
      const explored = Object.keys(this.fog);
      let html = `<div style="padding:16px;color:#eee;font:13px system-ui;max-width:960px;margin:0 auto;">
        <div style="display:flex;justify-content:space-between;align-items:center"><h2 style="color:#ffd23f;letter-spacing:2px">LEONIDA — 2D MAP</h2><button id="map-close" style="padding:6px 12px;background:#ffd23f;border:none;border-radius:6px;font-weight:700;cursor:pointer">Close (B)</button></div>
        <div style="color:#9fb8c8;margin:4px 0 10px">6 regions · 5 counties · 10 Cities &amp; Towns · Fog of War: ${explored.length}/6 regions explored (${this.exploredPercent}%)</div>
        <canvas id="leonida-canvas" width="${W}" height="${H}" style="background:#0e2a3a;border:1px solid rgba(255,255,255,0.2);border-radius:8px;width:100%"></canvas>
        <div style="display:flex;gap:16px;margin-top:10px;flex-wrap:wrap">
          <div style="flex:1;min-width:220px"><b style="color:#ffd23f">MAP INDEX</b><br>${MAP_POINTS.map((p) => `<span data-map-point="${p.name}" style="cursor:pointer;color:#c8d4de;display:inline-block;margin:2px 8px 2px 0">${p.kind === 'town' ? '●' : '○'} ${p.name}</span>`).join('')}</div>
          <div style="flex:1;min-width:220px"><b style="color:#ffd23f">QUICK NAV</b><br>${MAP_POINTS.filter((p) => p.kind === 'town').map((p) => `<button data-nav="${p.name}" style="margin:2px;padding:4px 8px;background:rgba(255,255,255,0.08);color:#eee;border:1px solid rgba(255,255,255,0.2);border-radius:6px;cursor:pointer">${p.name}</button>`).join('')}<br><br><b style="color:#ffd23f">COUNTIES</b><br>${MAP_COUNTIES.join(' · ')}<br><br><b style="color:#ffd23f">23 MAP ICONS</b><br><span style="color:#9fb8c8">${MAP_ICONS.join(', ')}</span></div>
        </div></div>`;
      el.innerHTML = html;
      const canvas = el.querySelector('#leonida-canvas');
      const ctx = canvas.getContext('2d');
      // Sea + land.
      ctx.fillStyle = '#0e2a3a';
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = '#2a4a2e';
      ctx.fillRect(0, 0, W, H * 0.82); // landmass (north), sea at the south
      // Lake Leonida.
      const lake = gtabaseToMap(-1948, 4794, W, H);
      ctx.fillStyle = '#1e6f8e';
      ctx.beginPath(); ctx.ellipse(lake.px, lake.py, 46, 30, 0, 0, Math.PI * 2); ctx.fill();
      // Fog of War: unexplored regions are dimmed.
      for (const p of MAP_POINTS) {
        const { px, py } = gtabaseToMap(p.x, p.y, W, H);
        const isExplored = this.fog[p.region] || p.region === 'Vice City';
        ctx.globalAlpha = isExplored ? 1 : 0.35;
        ctx.fillStyle = p.kind === 'town' ? '#ffd23f' : p.kind === 'district' ? '#7fd4ff' : p.kind === 'airport' ? '#ff7fa8' : p.kind === 'port' ? '#7dff9a' : '#e8e8e8';
        ctx.beginPath(); ctx.arc(px, py, p.kind === 'town' ? 6 : 4, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.font = '11px system-ui';
        ctx.fillText(p.name, px + 8, py + 4);
        ctx.globalAlpha = 1;
      }
      // Waypoint.
      if (this.waypoint) {
        const { px, py } = gtabaseToMap(this.waypoint.x, this.waypoint.y, W, H);
        ctx.strokeStyle = '#ff3b30';
        ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(px, py, 12, 0, Math.PI * 2); ctx.stroke();
        ctx.fillStyle = '#ff3b30';
        ctx.font = 'bold 12px system-ui';
        ctx.fillText('WAYPOINT: ' + this.waypoint.name, px + 16, py - 10);
      }
      // Player position (approx: the playable city maps to Vice City).
      const pp = gtabaseToMap(-220, 756, W, H);
      ctx.fillStyle = '#fff';
      ctx.beginPath(); ctx.arc(pp.px, pp.py, 5, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = '#111';
      ctx.stroke();
      el.querySelector('#map-close').addEventListener('click', () => Game.hud.showMap(false));
      el.querySelectorAll('[data-map-point]').forEach((s) => {
        s.addEventListener('click', () => this.setWaypoint(s.dataset.mapPoint));
      });
      el.querySelectorAll('[data-nav]').forEach((b) => {
        b.addEventListener('click', () => { this.setWaypoint(b.dataset.nav); this.render(el); });
      });
    },
    // Round 3: the current waypoint's name, or null when none is set.
    waypointName() {
      return this.waypoint ? this.waypoint.name : null;
    },
  };
  return LM;
}
