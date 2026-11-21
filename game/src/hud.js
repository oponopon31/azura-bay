// hud.js — Every 2D layer: health, cash, wanted stars, objective, minimap,
// speed, dialogs, toasts, menus and the mission list. One job: the interface.
// Round 2 adds: hit-markers (Bab 21, white/yellow/red), the 2D Leonida map
// overlay (B key, Bab 28), the smartphone overlay (U key, Bab 9/26), the
// Photo Studio overlay (O key, Bab 21), and a fixed weapon wheel that shows
// the real magazine + reserve ammo per weapon (round 1 showed a wrong
// per-id magAmmo). Minimap: NO automatic red dots (Bab 26) — police dots
// only appear while the player is wanted (they are "known" then).

import { MISSIONS, PLACES, CITY_HALF, PITCH, GRID } from './config.js';
import { CHAPTERS } from './story.js';

export function createHud(G) {
  const $ = (id) => document.getElementById(id);
  // The weapon wheel + character badge + ankle monitor + hit-marker are
  // built here so index.html does not need new markup for them.
  const wheelEl = document.createElement('div');
  wheelEl.id = 'weapon-wheel';
  wheelEl.style.cssText = 'position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);width:340px;height:340px;border-radius:50%;background:rgba(10,14,24,0.82);border:2px solid rgba(255,210,63,0.5);display:none;z-index:40;pointer-events:auto;';
  document.body.appendChild(wheelEl);
  const charBadge = document.createElement('div');
  charBadge.id = 'char-badge';
  charBadge.style.cssText = 'position:fixed;left:14px;top:64px;padding:4px 10px;background:rgba(10,14,24,0.7);border:1px solid rgba(255,255,255,0.25);border-radius:4px;color:#ffe9a8;font:600 13px system-ui;z-index:30;';
  charBadge.textContent = 'JASON';
  document.body.appendChild(charBadge);
  const monitorEl = document.createElement('div');
  monitorEl.id = 'ankle-monitor';
  monitorEl.style.cssText = 'position:fixed;right:14px;top:110px;padding:6px 10px;background:rgba(20,10,10,0.8);border:1px solid #e74c3c;border-radius:4px;color:#ffb0a0;font:600 13px system-ui;z-index:30;display:none;';
  document.body.appendChild(monitorEl);
  // Hit-marker: a small X at the crosshair, coloured white/yellow/red.
  const hitEl = document.createElement('div');
  hitEl.id = 'hit-marker';
  hitEl.style.cssText = 'position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);font:700 22px system-ui;color:#fff;opacity:0;pointer-events:none;z-index:35;text-shadow:0 0 4px #000;';
  hitEl.textContent = '✕';
  document.body.appendChild(hitEl);
  // Leonida map overlay (B key): a canvas + a side panel, built by leonidamap.js.
  const mapEl = document.createElement('div');
  mapEl.id = 'leonida-map';
  mapEl.style.cssText = 'position:fixed;inset:0;background:rgba(6,10,16,0.92);display:none;z-index:45;';
  document.body.appendChild(mapEl);
  // Smartphone overlay (U key): apps are rendered by phone.js into this.
  const phoneEl = document.createElement('div');
  phoneEl.id = 'phone';
  phoneEl.style.cssText = 'position:fixed;right:18px;top:60px;width:300px;max-height:70vh;overflow:auto;background:rgba(12,16,24,0.95);border:2px solid rgba(255,210,63,0.6);border-radius:14px;padding:12px;display:none;z-index:46;color:#eee;font:13px system-ui;';
  document.body.appendChild(phoneEl);
  // Photo Studio overlay (O key): 4 tabs, rendered by world.js.
  const photoEl = document.createElement('div');
  photoEl.id = 'photo-studio';
  photoEl.style.cssText = 'position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);width:520px;max-width:92vw;max-height:80vh;overflow:auto;background:rgba(12,16,24,0.95);border:2px solid rgba(255,210,63,0.6);border-radius:12px;padding:14px;display:none;z-index:46;color:#eee;font:13px system-ui;';
  document.body.appendChild(photoEl);
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
  let dialogTimer = null;
  let toastTimer = null;
  let hitTimer = null;

  const H = {
    toast(msg) {
      els.toast.textContent = msg;
      els.toast.classList.add('show');
      clearTimeout(toastTimer);
      toastTimer = setTimeout(() => els.toast.classList.remove('show'), 3600);
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
      clearTimeout(dialogTimer);
      dialogTimer = setTimeout(() => els.dialog.classList.remove('show'), ms || 6000);
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
      hitEl.style.color = color === 'red' ? '#ff3b30' : color === 'yellow' ? '#ffd23f' : '#ffffff';
      hitEl.style.opacity = '1';
      clearTimeout(hitTimer);
      hitTimer = setTimeout(() => { hitEl.style.opacity = '0'; }, 350);
    },
    // Character badge: which protagonist is on screen right now.
    setCharacter(who) {
      charBadge.textContent = who === 'lucia' ? 'LUCIA' : 'JASON';
      charBadge.style.color = who === 'lucia' ? '#ffb0c8' : '#ffe9a8';
    },
    // Ankle monitor (Chapter 2): null hides it; {inside:true} shows OK;
    // {inside:false, secondsLeft} shows the countdown in red.
    setMonitor(state) {
      if (!state) { monitorEl.style.display = 'none'; return; }
      monitorEl.style.display = 'block';
      if (state.inside) {
        monitorEl.textContent = 'ANKLE MONITOR — inside Port Gellhorn';
        monitorEl.style.borderColor = '#2ecc71';
        monitorEl.style.color = '#a8e6b0';
      } else {
        monitorEl.textContent = `ANKLE MONITOR — return to Port Gellhorn! ${state.secondsLeft}s`;
        monitorEl.style.borderColor = '#e74c3c';
        monitorEl.style.color = '#ffb0a0';
      }
    },
    // Weapon wheel (hold Tab): owned weapons in a ring, grouped by category.
    // Click a weapon to equip it; release Tab to close. Shows real ammo:
    // magazine for the equipped weapon, reserve for the rest.
    showWeaponWheel(open) {
      if (!open) { wheelEl.style.display = 'none'; return; }
      const W = G.weapons;
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
      wheelEl.innerHTML = html;
      wheelEl.style.display = 'block';
      wheelEl.querySelectorAll('button[data-w]').forEach((b) => {
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
      mapEl.style.display = open ? 'block' : 'none';
      if (open && G.leonidaMap) G.leonidaMap.render(mapEl);
    },
    mapVisible() { return mapEl.style.display === 'block'; },
    // ---- Smartphone overlay (U key) ----
    showPhone(open) {
      phoneEl.style.display = open ? 'block' : 'none';
      if (open && G.phone) G.phone.render(phoneEl);
    },
    phoneVisible() { return phoneEl.style.display === 'block'; },
    phoneEl() { return phoneEl; },
    // ---- Photo Studio overlay (O key) ----
    showPhotoStudio(open) {
      photoEl.style.display = open ? 'block' : 'none';
      if (open && G.world) G.world.renderPhotoStudio(photoEl);
    },
    photoVisible() { return photoEl.style.display === 'block'; },
    photoEl() { return photoEl; },

    updateMissionList() {
      let html = '';
      for (const ch of CHAPTERS) {
        const doneCount = MISSIONS.slice(ch.from - 1, ch.to).filter((m, i) => G.missions.completed[ch.from - 1 + i]).length;
        html += `<div class="mission-chapter"><b>CHAPTER ${ch.n} — ${ch.title}</b><span>${doneCount}/${ch.to - ch.from + 1} done</span><p>${ch.desc}</p></div>`;
        MISSIONS.slice(ch.from - 1, ch.to).forEach((m, k) => {
          const i = ch.from - 1 + k;
          const done = G.missions.completed[i];
          const active = i === G.missions.index && G.missions.index < MISSIONS.length;
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
      // Blocks.
      mm.fillStyle = '#3a4148';
      for (let i = 0; i < GRID - 1; i++) {
        for (let j = 0; j < GRID - 1; j++) {
          const bx = -CITY_HALF + PITCH / 2 + i * PITCH - 32;
          const bz = -CITY_HALF + PITCH / 2 + j * PITCH - 32;
          mm.fillRect(toMap(bx), toMap(bz), (64 / worldSpan) * S, (64 / worldSpan) * S);
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
      if (G.missions.marker) {
        const pulse = 5 + Math.sin(G.elapsed * 5) * 2;
        mm.fillStyle = '#ffd23f';
        mm.beginPath();
        mm.arc(toMap(G.missions.marker.x), toMap(G.missions.marker.z), pulse, 0, Math.PI * 2);
        mm.fill();
        mm.strokeStyle = '#fff';
        mm.lineWidth = 1.5;
        mm.stroke();
      }
      // Cars (white), police (flashing blue/red, only while wanted), target (orange).
      for (const car of G.cars) {
        let col = '#e8e8e8';
        if (car.driver === 'police') {
          if (G.police.stars < 1) continue; // no auto red dots
          col = Math.sin(G.elapsed * 9) > 0 ? '#ff3333' : '#3388ff';
        }
        else if (car.driver === 'target') col = '#ff7a1a';
        else if (car.driver === 'player') continue; // player arrow covers it
        mm.fillStyle = col;
        mm.fillRect(toMap(car.pos.x) - 2, toMap(car.pos.z) - 2, 4, 4);
      }
      // Foot cops — only while wanted (Bab 26: no auto red dots).
      if (G.police.stars >= 1) {
        mm.fillStyle = '#3388ff';
        for (const cop of G.police.cops) {
          if (!cop.alive) continue;
          mm.fillRect(toMap(cop.pos.x) - 2, toMap(cop.pos.z) - 2, 4, 4);
        }
      }
      // Player arrow.
      const px = toMap(G.player.pos.x), pz = toMap(G.player.pos.z);
      mm.save();
      mm.translate(px, pz);
      mm.rotate(Math.atan2(Math.sin(G.player.heading), Math.cos(G.player.heading)) * -1 + Math.PI);
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
      const hp = Math.max(0, Math.round(G.player.health));
      els.healthFill.style.width = hp + '%';
      els.healthFill.style.background = hp > 50 ? '#2ecc71' : hp > 25 ? '#f1c40f' : '#e74c3c';
      els.healthText.textContent = hp;
      els.cash.textContent = '$' + Math.floor(G.money).toLocaleString();
      // Stars.
      let starsHtml = '';
      for (let i = 0; i < 5; i++) {
        starsHtml += `<span class="star ${i < G.police.stars ? 'on' : ''}">★</span>`;
      }
      els.stars.innerHTML = starsHtml;
      els.stars.classList.toggle('hot', G.police.stars >= 3);
      // Objective + distance.
      els.objective.textContent = G.missions.objectiveText();
      if (G.missions.marker) {
        const d = Math.round(Math.hypot(
          G.player.pos.x - G.missions.marker.x, G.player.pos.z - G.missions.marker.z));
        els.objectiveDist.textContent = `${G.missions.marker.label} — ${d}m`;
      } else {
        els.objectiveDist.textContent = '';
      }
      // Speed + ammo (from the weapons system: active weapon + magazine).
      const w = G.weapons ? G.weapons.active() : null;
      const ammoLine = w
        ? `${w.name} — ${G.weapons.magAmmo}/${w.mag || '—'}${w.capped === false ? ' · uncapped' : ` · ${G.weapons.ammo[w.id] || 0} reserve`}${G.weapons.reloading ? ' — reloading…' : ''}${w.id === 'smokeflash' ? ` — ${G.weapons.throwMode === 'flash' ? 'FLASH' : 'SMOKE'}` : ''}`
        : 'Unarmed';
      if (!G.player.onFoot && G.player.car) {
        els.speed.classList.add('show');
        els.speedVal.textContent = Math.round(Math.abs(G.player.car.speed) * 3.6);
        els.ammo.textContent = ammoLine;
      } else {
        els.speed.classList.remove('show');
        els.ammo.textContent = ammoLine;
      }
      // Interact prompt.
      const near = G.driving.nearestEnterable();
      if (G.player.onFoot && near) {
        els.interact.textContent = near.driver === 'traffic'
          ? 'Press E — jack this car'
          : 'Press E — get in the car';
        els.interact.classList.add('show');
      } else if (G.player.onFoot && G.missions.current && G.missions.current.type === 'heist' && G.missions.stage === 0 &&
        Math.hypot(G.player.pos.x - G.missions.current.x, G.player.pos.z - G.missions.current.z) < 8) {
        els.interact.textContent = 'Walk to the package to grab it';
        els.interact.classList.add('show');
      } else {
        els.interact.classList.remove('show');
      }
      // Crosshair shows when aiming on foot.
      els.crosshair.classList.toggle('show', G.player.onFoot && G.player.aiming);
      this.drawMinimap();
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
      if (G.characters && els.castList && !els.castList.children.length) {
        for (const c of G.characters.roster) {
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

    bindButtons(G) {
      els.btnNew.addEventListener('click', () => { G.audio.ensure(); G.audio.click(); G.newGame(); });
      els.btnContinue.addEventListener('click', () => { G.audio.ensure(); G.audio.click(); G.continueGame(); });
      els.btnResume.addEventListener('click', () => { G.audio.click(); G.resumeGame(); });
      els.btnSave.addEventListener('click', () => { G.saveGame(); G.audio.cash(); H.toast('Game saved.'); });
      els.btnQuit.addEventListener('click', () => { G.audio.click(); G.quitToMenu(); });
      els.btnRespawn.addEventListener('click', () => { G.audio.click(); H.hideEndCard(); G.police.respawn(); });
      els.muteBtn.addEventListener('click', () => {
        G.audio.ensure();
        G.audio.setMuted(!G.audio.muted);
        els.muteBtn.textContent = G.audio.muted ? '🔇 Sound: OFF' : '🔊 Sound: ON';
      });
      els.radioBtn.addEventListener('click', () => {
        G.audio.ensure();
        G.audio.setRadio(!G.audio.radioOn);
        els.radioBtn.textContent = G.audio.radioOn ? '📻 Radio: ON' : '📻 Radio: OFF';
      });
    },
  };
  return H;
}
