// hud.js — Every 2D layer: health, cash, wanted stars, objective, minimap,
// speed, dialogs, toasts, menus and the mission list. One job: the interface.
// Hit-markers (Bab 21, white/yellow/red), the 2D Leonida map overlay
// (B key, Bab 28), the smartphone overlay (U key, Bab 9/26), the Photo
// Studio overlay (O key, Bab 21), and a fixed weapon wheel that shows the
// real magazine + reserve ammo per weapon. Minimap: NO automatic red dots
// (Bab 26) — police dots only appear while the player is wanted (they are
// "known" then).
// Round 5: overlay element handles renamed (wheelBox, charTag, monitorBox,
// hitMark, mapBox, phoneBox, photoBox), timers renamed, Game replaces G.
// Behaviour unchanged.

import { CHAPTERS } from './story.js';
import { MISSIONS, PLACES, CITY_HALF, PITCH, GRID, nearestRoad } from './config.js';
import { WALLET_MAX } from './economy.js';

export function createHud(Game) {
  const $ = (id) => document.getElementById(id);
  // The weapon wheel + character badge + ankle monitor + hit-marker are
  // built here so index.html does not need new markup for them.
  const wheelBox = document.createElement('div');
  wheelBox.id = 'weapon-wheel';
  wheelBox.style.cssText = 'position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);width:340px;height:340px;border-radius:50%;background:rgba(10,14,24,0.82);border:2px solid rgba(255,210,63,0.5);display:none;z-index:40;pointer-events:auto;';
  document.body.appendChild(wheelBox);
  const charTag = document.createElement('div');
  charTag.id = 'char-badge';
  charTag.style.cssText = 'position:fixed;left:14px;top:64px;padding:4px 10px;background:rgba(10,14,24,0.7);border:1px solid rgba(255,255,255,0.25);border-radius:4px;color:#ffe9a8;font:600 13px system-ui;z-index:30;';
  charTag.textContent = 'JASON';
  document.body.appendChild(charTag);
  const monitorBox = document.createElement('div');
  monitorBox.id = 'ankle-monitor';
  monitorBox.style.cssText = 'position:fixed;right:14px;top:150px;padding:6px 10px;background:rgba(20,10,10,0.8);border:1px solid #e74c3c;border-radius:4px;color:#ffb0a0;font:600 13px system-ui;z-index:30;display:none;';
  document.body.appendChild(monitorBox);
  // Hit-marker: a small X at the crosshair, coloured white/yellow/red.
  const hitMark = document.createElement('div');
  hitMark.id = 'hit-marker';
  hitMark.style.cssText = 'position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);font:700 22px system-ui;color:#fff;opacity:0;pointer-events:none;z-index:35;text-shadow:0 0 4px #000;';
  hitMark.textContent = '✕';
  document.body.appendChild(hitMark);
  // Leonida map overlay (B key): a canvas + a side panel, built by leonidamap.js.
  const mapBox = document.createElement('div');
  mapBox.id = 'leonida-map';
  mapBox.style.cssText = 'position:fixed;inset:0;background:rgba(6,10,16,0.92);display:none;z-index:45;';
  document.body.appendChild(mapBox);
  // Smartphone overlay (U key): apps are rendered by phone.js into this.
  const phoneBox = document.createElement('div');
  phoneBox.id = 'phone';
  phoneBox.style.cssText = 'position:fixed;right:18px;top:60px;width:300px;max-height:70vh;overflow:auto;background:rgba(12,16,24,0.95);border:2px solid rgba(255,210,63,0.6);border-radius:14px;padding:12px;display:none;z-index:46;color:#eee;font:13px system-ui;';
  document.body.appendChild(phoneBox);
  // Photo Studio overlay (O key): 4 tabs, rendered by world.js.
  const photoBox = document.createElement('div');
  photoBox.id = 'photo-studio';
  photoBox.style.cssText = 'position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);width:520px;max-width:92vw;max-height:80vh;overflow:auto;background:rgba(12,16,24,0.95);border:2px solid rgba(255,210,63,0.6);border-radius:12px;padding:14px;display:none;z-index:46;color:#eee;font:13px system-ui;';
  document.body.appendChild(photoBox);
  // ---- Bab 29 HUD: the four corners (SPEC Bab 29) ----
  // Top-left: character status bars (health / stamina / focus / oxygen)
  // with a buff & adrenaline row. Built here; updateHudCorners() fills it.
  const statusBox = document.createElement('div');
  statusBox.id = 'hud-status';
  statusBox.style.cssText = 'position:fixed;left:14px;top:104px;width:250px;padding:8px 10px;background:rgba(8,14,22,0.72);border:1px solid rgba(255,255,255,0.14);border-radius:10px;color:#f2f2f2;font:12px system-ui;z-index:5;pointer-events:none;';
  statusBox.innerHTML = [
    '<div class="hud-bar-row"><span class="hud-bar-icon" style="color:#ff8fb0">♥</span><div class="hud-bar"><div id="hud-health-fill" style="background:#ff5c8a"></div><div id="hud-health-cap" class="hud-bar-cap"></div></div><span id="hud-health-num"></span></div>',
    '<div class="hud-bar-row"><span class="hud-bar-icon" style="color:#b8ff4d">⚡</span><div class="hud-bar"><div id="hud-stamina-fill" style="background:#b8ff4d"></div></div><span id="hud-stamina-num"></span></div>',
    '<div class="hud-bar-row"><span class="hud-bar-icon" style="color:#c77dff">◉</span><div class="hud-bar"><div id="hud-focus-fill" style="background:#c77dff"></div></div><span id="hud-focus-num"></span></div>',
    '<div class="hud-bar-row" id="hud-oxygen-row" style="display:none"><span class="hud-bar-icon" style="color:#7fd4ff">O₂</span><div class="hud-bar"><div id="hud-oxygen-fill" style="background:#7fd4ff"></div></div><span id="hud-oxygen-num"></span></div>',
    '<div id="hud-buffs" style="margin-top:5px;display:flex;gap:5px;flex-wrap:wrap"></div>',
  ].join('');
  document.body.appendChild(statusBox);
  // Top-right, under the stars: recognised-clue chips + BuckMe bank balance.
  const topRightBox = document.createElement('div');
  topRightBox.id = 'hud-topright';
  topRightBox.style.cssText = 'position:fixed;right:14px;top:70px;width:250px;padding:8px 10px;background:rgba(8,14,22,0.72);border:1px solid rgba(255,255,255,0.14);border-radius:10px;color:#f2f2f2;font:12px system-ui;z-index:5;pointer-events:none;text-align:right;';
  topRightBox.innerHTML = [
    '<div id="hud-clues" style="display:flex;gap:5px;justify-content:flex-end;flex-wrap:wrap"></div>',
    '<div id="hud-buckme" style="margin-top:5px;font-weight:700;color:#7dff9a"></div>',
  ].join('');
  document.body.appendChild(topRightBox);
  // Bottom-left, above the minimap: vehicle fuel + engine condition.
  const vehicleBox = document.createElement('div');
  vehicleBox.id = 'hud-vehicle';
  vehicleBox.style.cssText = 'position:fixed;left:14px;bottom:250px;width:206px;padding:8px 10px;background:rgba(8,14,22,0.72);border:1px solid rgba(255,255,255,0.14);border-radius:10px;color:#f2f2f2;font:12px system-ui;z-index:5;pointer-events:none;display:none;';
  vehicleBox.innerHTML = [
    '<div class="hud-bar-row"><span style="width:52px">⛽ Fuel</span><div class="hud-bar"><div id="hud-fuel-fill" style="background:#ffb03a"></div></div><span id="hud-fuel-num"></span></div>',
    '<div class="hud-bar-row"><span style="width:52px">Engine</span><div class="hud-bar"><div id="hud-engine-fill" style="background:#7fd4ff"></div></div><span id="hud-engine-num"></span></div>',
    '<div id="hud-vehicle-warn" style="margin-top:4px;font-weight:700;color:#ff6b5e"></div>',
  ].join('');
  document.body.appendChild(vehicleBox);
  // Bottom-right: criminal profile + Jason–Lucia relationship.
  const profileBox = document.createElement('div');
  profileBox.id = 'hud-profile';
  profileBox.style.cssText = 'position:fixed;right:14px;bottom:130px;width:250px;padding:8px 10px;background:rgba(8,14,22,0.72);border:1px solid rgba(255,255,255,0.14);border-radius:10px;color:#f2f2f2;font:12px system-ui;z-index:5;pointer-events:none;';
  profileBox.innerHTML = [
    '<div style="display:flex;justify-content:space-between"><span style="color:#9fb8c8">PROFILE</span><b id="hud-profile-name"></b></div>',
    '<div class="hud-bar-row" style="margin-top:5px"><span style="color:#ffb0c8">♥ J×L</span><div class="hud-bar"><div id="hud-rel-fill" style="background:#ff8fb0"></div></div><span id="hud-rel-num"></span></div>',
    '<div id="hud-rel-label" style="margin-top:3px;color:#c8d4de"></div>',
  ].join('');
  document.body.appendChild(profileBox);
  // Shared bar styling for the Bab 29 clusters (one <style> so the rows
  // stay identical in all four corners).
  const hudStyle = document.createElement('style');
  hudStyle.textContent = '.hud-bar-row{display:flex;align-items:center;gap:6px;margin-top:4px}.hud-bar-icon{width:18px;text-align:center;font-size:13px}.hud-bar{flex:1;height:10px;background:rgba(0,0,0,0.55);border-radius:5px;overflow:hidden;position:relative}.hud-bar>div{height:100%;width:100%}.hud-bar-cap{position:absolute;top:0;bottom:0;width:2px;background:#fff;opacity:0.85;pointer-events:none}.hud-chip{padding:2px 7px;border-radius:9px;font-size:11px;font-weight:700;background:rgba(255,255,255,0.08);color:rgba(255,255,255,0.35);border:1px solid rgba(255,255,255,0.12)}.hud-chip.on{background:rgba(255,80,60,0.25);color:#ffb0a0;border-color:#e74c3c}.hud-buff{padding:2px 7px;border-radius:9px;font-size:11px;font-weight:800;background:rgba(255,210,63,0.2);color:#ffd23f;border:1px solid rgba(255,210,63,0.5)}';
  document.head.appendChild(hudStyle);
  const els = {
    healthFill: $('health-fill'), healthText: $('health-text'),
    cash: $('cash'), stars: $('stars'), objective: $('objective'),
    objectiveDist: $('objective-dist'),
    speed: $('speed'), speedVal: $('speed-val'),
    ammo: $('ammo'),
    minimap: $('minimap'),
    toast: $('toast'), dialog: $('dialog'), dialogName: $('dialog-name'), dialogText: $('dialog-text'),
    cashPopup: $('cash-popup'),
    crosshair: $('crosshair'),
    interact: $('interact'),
    hint: $('hint'),
    damage: $('damage'),
    startMenu: $('start-menu'), pauseMenu: $('pause-menu'), castList: $('cast-list'),
    endCard: $('end-card'), endTitle: $('end-title'), endSub: $('end-sub'),
    missionPanel: $('mission-panel'), missionList: $('mission-list'),
    btnNew: $('btn-new'), btnContinue: $('btn-continue'),
    btnResume: $('btn-resume'), btnSave: $('btn-save'), btnQuit: $('btn-quit'),
    btnRespawn: $('btn-respawn'),
    muteBtn: $('btn-mute'), radioBtn: $('btn-radio'),
    titleCash: $('title-cash'),
  };
  const mm = els.minimap.getContext('2d');
  let dialogClock = null;
  let toastClock = null;
  let hitClock = null;

  const H = {
    toast(msg) {
      els.toast.textContent = msg;
      els.toast.classList.add('show');
      clearTimeout(toastClock);
      toastClock = setTimeout(() => els.toast.classList.remove('show'), 3600);
    },
    cashPopup(text) {
      els.cashPopup.textContent = text;
      els.cashPopup.classList.remove('pop');
      void els.cashPopup.offsetWidth; // restart the animation
      els.cashPopup.classList.add('pop');
      setTimeout(() => els.cashPopup.classList.remove('pop'), 2200);
    },
    showDialog(name, text, ms) {
      els.dialogName.textContent = name;
      els.dialogText.textContent = text;
      els.dialog.classList.add('show');
      clearTimeout(dialogClock);
      dialogClock = setTimeout(() => els.dialog.classList.remove('show'), ms || 6000);
    },
    flashDamage() {
      els.damage.classList.add('show');
      setTimeout(() => els.damage.classList.remove('show'), 220);
    },
    // Flashbang: a full-screen white flash that fades over ~1 s.
    flashbang() {
      const el = els.damage;
      el.style.background = 'radial-gradient(circle, rgba(255,255,255,0.95), rgba(255,255,255,0.55))';
      el.classList.add('show');
      setTimeout(() => {
        el.classList.remove('show');
        el.style.background = '';
      }, 1000);
    },
    // Bab 21 hit-marker: white = hit, yellow = incapacitated, red = killed.
    showHitMarker(color) {
      hitMark.style.color = color === 'red' ? '#ff3b30' : color === 'yellow' ? '#ffd23f' : '#ffffff';
      hitMark.style.opacity = '1';
      clearTimeout(hitClock);
      hitClock = setTimeout(() => { hitMark.style.opacity = '0'; }, 350);
    },
    // Character badge: which protagonist is on screen right now.
    setCharacter(who) {
      charTag.textContent = who === 'lucia' ? 'LUCIA' : 'JASON';
      charTag.style.color = who === 'lucia' ? '#ffb0c8' : '#ffe9a8';
    },
    // Ankle monitor (Chapter 2): null hides it; {inside:true} shows OK;
    // {inside:false, secondsLeft} shows the countdown in red.
    setMonitor(state) {
      if (!state) { monitorBox.style.display = 'none'; return; }
      monitorBox.style.display = 'block';
      if (state.inside) {
        monitorBox.textContent = 'ANKLE MONITOR — inside Port Gellhorn';
        monitorBox.style.borderColor = '#2ecc71';
        monitorBox.style.color = '#a8e6b0';
      } else {
        monitorBox.textContent = `ANKLE MONITOR — return to Port Gellhorn! ${state.secondsLeft}s`;
        monitorBox.style.borderColor = '#e74c3c';
        monitorBox.style.color = '#ffb0a0';
      }
    },
    // Weapon wheel (hold Tab): owned weapons in a ring, grouped by category.
    // Click a weapon to equip it; release Tab to close. Shows real ammo:
    // magazine for the equipped weapon, reserve for the rest.
    showWeaponWheel(open) {
      if (!open) { wheelBox.style.display = 'none'; return; }
      const W = Game.weapons;
      if (!W) return;
      const owned = W.ownedList();
      const active = W.active();
      let html = `<div style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);text-align:center;color:#ffe9a8;font:700 15px system-ui;">${active ? active.name : 'UNARMED'}<div style="font:400 11px system-ui;color:#c8c8c8;">hold TAB — click to equip, Q to cycle</div></div>`;
      const n = Math.min(owned.length, 12);
      owned.slice(0, n).forEach((id, i) => {
        const w = W.byId(id);
        const angle = (i / n) * Math.PI * 2 - Math.PI / 2;
        const x = 170 + Math.cos(angle) * 118 - 52;
        const y = 170 + Math.sin(angle) * 118 - 22;
        const isActive = active && active.id === id;
        const ammoTxt = isActive
          ? `${W.magAmmo}/${w.mag || '—'}`
          : (w.capped === false ? `${w.mag} · uncapped` : `${W.ammo[id] || 0} reserve`);
        html += `<button data-w="${id}" style="position:absolute;left:${x}px;top:${y}px;width:104px;padding:5px 4px;font:600 10px system-ui;color:${isActive ? '#111' : '#eee'};background:${isActive ? '#ffd23f' : 'rgba(40,48,64,0.92)'};border:1px solid ${isActive ? '#ffd23f' : 'rgba(255,255,255,0.3)'};border-radius:6px;cursor:pointer;">${w.name}<br><span style="font-weight:400;opacity:0.8;">${w.kind} · ${ammoTxt}</span></button>`;
      });
      wheelBox.innerHTML = html;
      wheelBox.style.display = 'block';
      wheelBox.querySelectorAll('button[data-w]').forEach((b) => {
        b.addEventListener('click', () => { W.equip(b.dataset.w); this.showWeaponWheel(false); });
      });
    },
    showEndCard(title, sub) {
      els.endTitle.textContent = title;
      els.endSub.textContent = sub;
      els.endCard.classList.add('show');
    },
    hideEndCard() { els.endCard.classList.remove('show'); },

    // ---- Leonida map overlay (B key) ----
    showMap(open) {
      mapBox.style.display = open ? 'block' : 'none';
      if (open && Game.leonidaMap) Game.leonidaMap.render(mapBox);
    },
    mapVisible() { return mapBox.style.display === 'block'; },
    // ---- Smartphone overlay (U key) ----
    showPhone(open) {
      phoneBox.style.display = open ? 'block' : 'none';
      if (open && Game.phone) Game.phone.render(phoneBox);
    },
    phoneVisible() { return phoneBox.style.display === 'block'; },
    phoneBox() { return phoneBox; },
    // ---- Photo Studio overlay (O key) ----
    showPhotoStudio(open) {
      photoBox.style.display = open ? 'block' : 'none';
      if (open && Game.world) Game.world.renderPhotoStudio(photoBox);
    },
    photoVisible() { return photoBox.style.display === 'block'; },
    photoBox() { return photoBox; },

    updateMissionList() {
      let html = '';
      for (const ch of CHAPTERS) {
        const doneCount = MISSIONS.slice(ch.from - 1, ch.to).filter((m, i) => Game.missions.completed[ch.from - 1 + i]).length;
        html += `<div class="mission-chapter"><b>CHAPTER ${ch.n} — ${ch.title}</b><span>${doneCount}/${ch.to - ch.from + 1} done</span><p>${ch.desc}</p></div>`;
        MISSIONS.slice(ch.from - 1, ch.to).forEach((m, k) => {
          const i = ch.from - 1 + k;
          const done = Game.missions.completed[i];
          const active = i === Game.missions.index && Game.missions.index < MISSIONS.length;
          const cls = done ? 'done' : active ? 'active' : 'locked';
          const tag = done ? '✓ DONE' : active ? '▶ ACTIVE' : 'LOCKED';
          html += `<div class="mission-row ${cls}"><b>${m.id}. ${m.title}</b><span>$${m.reward.toLocaleString()}</span><span class="tag">${tag}</span><p>${m.who === 'lucia' ? 'LUCIA' : 'JASON'} · ${m.type} · ${m.objective}</p></div>`;
        });
      }
      els.missionList.innerHTML = html;
    },
    toggleMissionPanel(show) {
      els.missionPanel.classList.toggle('show', show);
      if (show) this.updateMissionList();
    },

    // ---- Minimap: roads, beach, harbor, player, cars, police, marker ----
    // Bab 26: no automatic red dots — police only appear on the minimap
    // while the player is wanted (they are "known" then); on foot, unseen
    // cops stay invisible, so stealth still works.
    drawMinimap() {
      const S = 190;
      const worldMin = -380, worldSpan = 880;
      const toMap = (x) => ((x - worldMin) / worldSpan) * S;
      mm.clearRect(0, 0, S, S);
      mm.fillStyle = 'rgba(10, 18, 26, 0.85)';
      mm.fillRect(0, 0, S, S);
      // Sea (south + east).
      mm.fillStyle = '#1e6f8e';
      mm.fillRect(0, toMap(372), S, S - toMap(372));
      mm.fillRect(toMap(336), 0, S - toMap(336), S);
      // Sand strip.
      mm.fillStyle = '#e8cf9a';
      mm.fillRect(0, toMap(336), toMap(336), toMap(372) - toMap(336));
      // Blocks (satellite-style top-down, with a darker south edge so the
      // blocks read as raised — the pseudo-3D the HUD spec asks for).
      mm.fillStyle = '#3a4148';
      for (let i = 0; i < GRID - 1; i++) {
        for (let j = 0; j < GRID - 1; j++) {
          const bx = -CITY_HALF + PITCH / 2 + i * PITCH - 32;
          const bz = -CITY_HALF + PITCH / 2 + j * PITCH - 32;
          mm.fillRect(toMap(bx), toMap(bz), (64 / worldSpan) * S, (64 / worldSpan) * S);
          mm.fillStyle = '#262c33';
          mm.fillRect(toMap(bx), toMap(bz) + (64 / worldSpan) * S - 2, (64 / worldSpan) * S, 2);
          mm.fillStyle = '#3a4148';
        }
      }
      // Roads.
      mm.strokeStyle = '#5a636e';
      mm.lineWidth = 3;
      for (let i = 0; i < GRID; i++) {
        const c = -CITY_HALF + i * PITCH;
        mm.beginPath(); mm.moveTo(toMap(c), 0); mm.lineTo(toMap(c), S); mm.stroke();
        mm.beginPath(); mm.moveTo(0, toMap(c)); mm.lineTo(S, toMap(c)); mm.stroke();
      }
      // Safehouse.
      mm.fillStyle = '#2ecc71';
      mm.fillRect(toMap(PLACES.safehouse.x) - 4, toMap(PLACES.safehouse.z) - 4, 8, 8);
      // Mission marker (pulsing).
      if (Game.missions.marker) {
        const pulse = 5 + Math.sin(Game.elapsed * 5) * 2;
        mm.fillStyle = '#ffd23f';
        mm.beginPath();
        mm.arc(toMap(Game.missions.marker.x), toMap(Game.missions.marker.z), pulse, 0, Math.PI * 2);
        mm.fill();
        mm.strokeStyle = '#fff';
        mm.lineWidth = 1.5;
        mm.stroke();
        // Bab 29 GPS route: pink, road-following (player's road, then the
        // marker's road, then the marker itself) — the pink GPS line.
        const mk = Game.missions.marker;
        const rx = nearestRoad(mk.x), rz = nearestRoad(mk.z);
        const px = Game.player.pos.x, pz = Game.player.pos.z;
        mm.strokeStyle = '#ff6fa5';
        mm.lineWidth = 3;
        mm.lineJoin = 'round';
        mm.beginPath();
        mm.moveTo(toMap(px), toMap(pz));
        mm.lineTo(toMap(px), toMap(rz));
        mm.lineTo(toMap(rx), toMap(rz));
        mm.lineTo(toMap(mk.x), toMap(mk.z));
        mm.stroke();
        mm.lineWidth = 1;
      }
      // Cars (white), police (flashing blue/red, only while wanted), target (orange).
      for (const car of Game.cars) {
        let col = '#e8e8e8';
        if (car.driver === 'police') {
          if (Game.police.stars < 1) continue; // no auto red dots
          col = Math.sin(Game.elapsed * 9) > 0 ? '#ff3333' : '#3388ff';
        }
        else if (car.driver === 'target') col = '#ff7a1a';
        else if (car.driver === 'player') continue; // player arrow covers it
        mm.fillStyle = col;
        mm.fillRect(toMap(car.pos.x) - 2, toMap(car.pos.z) - 2, 4, 4);
      }
      // Foot cops — only while wanted (Bab 26: no auto red dots).
      if (Game.police.stars >= 1) {
        mm.fillStyle = '#3388ff';
        for (const cop of Game.police.cops) {
          if (!cop.alive) continue;
          mm.fillRect(toMap(cop.pos.x) - 2, toMap(cop.pos.z) - 2, 4, 4);
        }
      }
      // Player arrow.
      const px = toMap(Game.player.pos.x), pz = toMap(Game.player.pos.z);
      mm.save();
      mm.translate(px, pz);
      mm.rotate(Math.atan2(Math.sin(Game.player.heading), Math.cos(Game.player.heading)) * -1 + Math.PI);
      mm.fillStyle = '#ffffff';
      mm.strokeStyle = '#111';
      mm.lineWidth = 1;
      mm.beginPath();
      mm.moveTo(0, -7); mm.lineTo(5, 6); mm.lineTo(-5, 6); mm.closePath();
      mm.fill(); mm.stroke();
      mm.restore();
    },

    update(dt) {
      // Health.
      const hp = Math.max(0, Math.round(Game.player.health));
      els.healthFill.style.width = hp + '%';
      els.healthFill.style.background = hp > 50 ? '#2ecc71' : hp > 25 ? '#f1c40f' : '#e74c3c';
      els.healthText.textContent = hp;
      els.cash.textContent = '$' + Math.floor(Game.money).toLocaleString();
      // Stars.
      let starsHtml = '';
      for (let i = 0; i < 5; i++) {
        starsHtml += `<span class="star ${i < Game.police.stars ? 'on' : ''}">★</span>`;
      }
      els.stars.innerHTML = starsHtml;
      els.stars.classList.toggle('hot', Game.police.stars >= 3);
      // Objective + distance.
      els.objective.textContent = Game.missions.objectiveText();
      if (Game.missions.marker) {
        const d = Math.round(Math.hypot(
          Game.player.pos.x - Game.missions.marker.x, Game.player.pos.z - Game.missions.marker.z));
        els.objectiveDist.textContent = `${Game.missions.marker.label} — ${d}m`;
      } else {
        els.objectiveDist.textContent = '';
      }
      // Speed + ammo (from the weapons system: active weapon + magazine).
      const w = Game.weapons ? Game.weapons.active() : null;
      const ammoLine = w
        ? `${w.name} — ${Game.weapons.magAmmo}/${w.mag || '—'}${w.capped === false ? ' · uncapped' : ` · ${Game.weapons.ammo[w.id] || 0} reserve`}${Game.weapons.reloading ? ' — reloading…' : ''}${w.id === 'smokeflash' ? ` — ${Game.weapons.throwMode === 'flash' ? 'FLASH' : 'SMOKE'}` : ''}`
        : 'Unarmed';
      if (!Game.player.onFoot && Game.player.car) {
        els.speed.classList.add('show');
        els.speedVal.textContent = Math.round(Math.abs(Game.player.car.speed) * 3.6);
        els.ammo.textContent = ammoLine;
      } else {
        els.speed.classList.remove('show');
        els.ammo.textContent = ammoLine;
      }
      // Interact prompt.
      const near = Game.driving.nearestEnterable();
      if (Game.player.onFoot && near) {
        els.interact.textContent = near.driver === 'traffic'
          ? 'Press E — jack this car'
          : 'Press E — get in the car';
        els.interact.classList.add('show');
      } else if (Game.player.onFoot && Game.missions.current && Game.missions.current.type === 'heist' && Game.missions.stage === 0 &&
        Math.hypot(Game.player.pos.x - Game.missions.current.x, Game.player.pos.z - Game.missions.current.z) < 8) {
        els.interact.textContent = 'Walk to the package to grab it';
        els.interact.classList.add('show');
      } else {
        els.interact.classList.remove('show');
      }
      // Crosshair shows when aiming on foot.
      els.crosshair.classList.toggle('show', Game.player.onFoot && Game.player.aiming);
      this.drawMinimap();
      this.updateHudCorners();
    },

    // ---- Bab 29 HUD: the four corners, refreshed from live game state ----
    // Top-left bars, top-right clues + BuckMe, bottom-left vehicle gauges,
    // bottom-right profile + relationship. Nothing here is hardcoded: every
    // number comes from the system that owns it (player / police / weapons /
    // economy / missions / world).
    updateHudCorners() {
      const P = Game.player;
      const setFill = (id, frac) => {
        const el = $(id);
        if (el) el.style.width = `${Math.max(0, Math.min(1, frac || 0)) * 100}%`;
      };
      const setText = (id, txt) => {
        const el = $(id);
        if (el) el.textContent = txt;
      };
      // Top-left: health (with the 50% regen-cap tick), stamina, focus.
      setFill('hud-health-fill', P.health / (P.maxHealth || 100));
      const capEl = $('hud-health-cap');
      if (capEl) capEl.style.left = '50%';
      setText('hud-health-num', `${Math.max(0, Math.round(P.health))}`);
      setFill('hud-stamina-fill', P.stamina);
      setText('hud-stamina-num', `${Math.round((P.stamina || 0) * 100)}`);
      setFill('hud-focus-fill', P.focusMeter);
      setText('hud-focus-num', `${Math.round((P.focusMeter || 0) * 100)}`);
      // Oxygen: breath (lung capacity) while swimming, dive-tank capacity
      // (world.oxygen) while the scuba gear is on. Hidden on dry land.
      const scuba = !!(Game.world && Game.world.scuba);
      const oxyRow = $('hud-oxygen-row');
      if (oxyRow) oxyRow.style.display = (P.swimming || scuba) ? 'flex' : 'none';
      const oxy = scuba ? (Game.world.oxygen || 0) / 100 : (P.lungCapacity || 0);
      setFill('hud-oxygen-fill', oxy);
      setText('hud-oxygen-num', `${Math.round(oxy * 100)}${scuba ? ' TANK' : ''}`);
      // Buff & adrenaline badges: only while the boost is really active.
      const buffs = [];
      if (Game.cheats && Game.cheats.isActive && Game.cheats.isActive('armor')) buffs.push('BODY ARMOR');
      if (Game.cheats && Game.cheats.isActive && Game.cheats.isActive('unlimfocus')) buffs.push('FOCUS ∞');
      if ((P.adrenaline || 0) >= 0.5) buffs.push('ADRENALINE');
      const buffEl = $('hud-buffs');
      if (buffEl) {
        buffEl.innerHTML = buffs.map((b) => `<span class="hud-buff">${b}</span>`).join('');
      }
      // Top-right: recognised-clue chips — each lights up only when the
      // police have actually recorded that clue (police.memory + seenNow).
      const mem = (Game.police && Game.police.memory) || {};
      const clues = [
        ['CCTV', !!mem.cctv],
        ['FACE', !!(Game.police && Game.police.seenNow)],
        ['CLOTHES', !!mem.outfit],
        ['VEHICLE', !!mem.vehicle],
      ];
      const clueEl = $('hud-clues');
      if (clueEl) {
        clueEl.innerHTML = clues.map(([label, on]) =>
          `<span class="hud-chip${on ? ' on' : ''}">${label}</span>`).join('');
      }
      // Top-right: BuckMe bank balance + the wallet cap (WALLET_MAX).
      const clean = Game.economy ? (Game.economy.clean || 0) : 0;
      setText('hud-buckme', `BuckMe $${Math.floor(clean).toLocaleString()} · wallet $${Math.floor(Game.money).toLocaleString()} / $${WALLET_MAX.toLocaleString()}`);
      // Bottom-left: vehicle fuel (tank / charge) + engine condition
      // (car.health, 1 = pristine). Hidden on foot.
      const car = P.car;
      const vehBox = $('hud-vehicle');
      if (vehBox) vehBox.style.display = car ? 'block' : 'none';
      if (car) {
        const fuel = car.fuel ?? 1;
        const engine = car.health ?? 1;
        setFill('hud-fuel-fill', fuel);
        setText('hud-fuel-num', `${Math.round(fuel * 100)}%`);
        setFill('hud-engine-fill', engine);
        setText('hud-engine-num', `${Math.round(engine * 100)}%`);
        const warn = [];
        if (fuel < 0.25) warn.push('LOW FUEL');
        if (engine < 0.35) warn.push('ENGINE FAILING');
        setText('hud-vehicle-warn', warn.join(' · '));
      }
      // Bottom-right: criminal profile (SPEC Bab 10 levels) + relationship.
      const profile = Game.missions ? Game.missions.criminalProfile() : 'Hardened';
      const bp = Game.missions && Game.missions.breakingPoint ? Game.missions.breakingPoint() : false;
      const profEl = $('hud-profile-name');
      if (profEl) {
        profEl.textContent = bp ? `${profile} — BREAKING POINT` : profile;
        profEl.style.color = bp ? '#ff6b5e' : (profile === 'Psycho' || profile === 'Irredeemable') ? '#ff6b5e' : (profile === 'Violent & Dangerous' ? '#ffb03a' : '#ffe9a8');
      }
      const rel = (Game.stats && Game.stats.relationship) || 40;
      setFill('hud-rel-fill', rel / 100);
      setText('hud-rel-num', `${Math.round(rel)}`);
      const relLabel = rel < 30 ? 'Strained — the duo is drifting apart'
        : rel < 55 ? 'Partners — holding together'
        : rel < 80 ? 'In Sync — Bonnie & Clyde rhythm'
        : 'Bonnie & Clyde — ride or die';
      setText('hud-rel-label', relLabel);
    },

    // Read helper for the self-test: the four corners as plain data.
    hudCorners() {
      const P = Game.player;
      const mem = (Game.police && Game.police.memory) || {};
      return {
        health: Math.max(0, Math.round(P.health)),
        stamina: Math.round((P.stamina || 0) * 100),
        focus: Math.round((P.focusMeter || 0) * 100),
        oxygenShown: !!(P.swimming || (Game.world && Game.world.scuba)),
        clues: {
          cctv: !!mem.cctv,
          face: !!(Game.police && Game.police.seenNow),
          clothes: !!mem.outfit,
          vehicle: !!mem.vehicle,
        },
        buckme: Game.economy ? (Game.economy.clean || 0) : 0,
        walletMax: WALLET_MAX,
        fuel: P.car ? (P.car.fuel ?? 1) : null,
        engine: P.car ? (P.car.health ?? 1) : null,
        profile: Game.missions ? Game.missions.criminalProfile() : 'Hardened',
        relationship: (Game.stats && Game.stats.relationship) || 40,
      };
    },

    // ---- Menus ----
    showStart(hasSave) {
      els.startMenu.classList.add('show');
      els.pauseMenu.classList.remove('show');
      els.btnContinue.style.display = hasSave ? 'block' : 'none';
      els.titleCash.textContent = hasSave ? 'Save found — Continue picks up where you left off.' : 'New to Azura Bay? Start a new story.';
    },
    hideMenus() {
      els.startMenu.classList.remove('show');
      els.pauseMenu.classList.remove('show');
    },
    showPause() {
      els.pauseMenu.classList.add('show');
      // Cast credits (SPEC Bab 15): bio + voice-talent name as TEXT only.
      // Built with textContent so bios with quotes/apostrophes stay safe.
      if (Game.characters && els.castList && !els.castList.children.length) {
        for (const c of Game.characters.roster) {
          const row = document.createElement('div');
          const name = document.createElement('b'); name.textContent = c.name + ' ';
          const role = document.createElement('span'); role.className = 'cast-role'; role.textContent = '— ' + c.role + ' ';
          const va = document.createElement('span'); va.className = 'cast-va'; va.textContent = c.va ? '(voice: ' + c.va + ')' : '';
          const bio = document.createElement('div'); bio.textContent = c.bio; bio.style.opacity = '.75'; bio.style.fontSize = '12px';
          row.append(name, role, va, bio);
          els.castList.appendChild(row);
        }
      }
    },
    hidePause() { els.pauseMenu.classList.remove('show'); },

    bindButtons(Game) {
      els.btnNew.addEventListener('click', () => { Game.audio.ensure(); Game.audio.click(); Game.newGame(); });
      els.btnContinue.addEventListener('click', () => { Game.audio.ensure(); Game.audio.click(); Game.continueGame(); });
      els.btnResume.addEventListener('click', () => { Game.audio.click(); Game.resumeGame(); });
      els.btnSave.addEventListener('click', () => { Game.saveGame(); Game.audio.cash(); H.toast('Game saved.'); });
      els.btnQuit.addEventListener('click', () => { Game.audio.click(); Game.quitToMenu(); });
      els.btnRespawn.addEventListener('click', () => { Game.audio.click(); H.hideEndCard(); Game.police.respawn(); });
      els.muteBtn.addEventListener('click', () => {
        Game.audio.ensure();
        Game.audio.setMuted(!Game.audio.muted);
        els.muteBtn.textContent = Game.audio.muted ? '🔇 Sound: OFF' : '🔊 Sound: ON';
      });
      els.radioBtn.addEventListener('click', () => {
        Game.audio.ensure();
        Game.audio.setRadio(!Game.audio.radioOn);
        els.radioBtn.textContent = Game.audio.radioOn ? '📻 Radio: ON' : '📻 Radio: OFF';
      });
    },
    // Round 3: the build tag in the pause menu (main.js sets it at boot).
    setBuildTag(text) {
      const el = document.getElementById('build-tag');
      if (el) el.textContent = text;
    },
  };
  // Bab 29: populate the four corners from the initial state right away —
  // the menu screen shows over the live city, and hud.update() only runs
  // while playing/paused, so without this the bars sit empty until New Game.
  H.updateHudCorners();
  return H;
}
