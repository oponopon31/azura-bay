// hud.js — Every 2D layer: health, cash, wanted stars, objective, minimap,
// speed, dialogs, toasts, menus and the mission list. One job: the interface.

import { MISSIONS, PLACES, CITY_HALF, PITCH, GRID } from './config.js';

export function createHud(G) {
  const $ = (id) => document.getElementById(id);
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
    startMenu: $('start-menu'), pauseMenu: $('pause-menu'),
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
    showEndCard(title, sub) {
      els.endTitle.textContent = title;
      els.endSub.textContent = sub;
      els.endCard.classList.add('show');
    },
    hideEndCard() { els.endCard.classList.remove('show'); },

    updateMissionList() {
      let html = '';
      MISSIONS.forEach((m, i) => {
        const done = G.missions.completed[i];
        const active = i === G.missions.index && G.missions.index < MISSIONS.length;
        const cls = done ? 'done' : active ? 'active' : 'locked';
        const tag = done ? '✓ DONE' : active ? '▶ ACTIVE' : 'LOCKED';
        html += `<div class="mission-row ${cls}"><b>${i + 1}. ${m.name}</b><span>$${m.payout.toLocaleString()}</span><span class="tag">${tag}</span><p>${m.objective}</p></div>`;
      });
      els.missionList.innerHTML = html;
    },
    toggleMissionPanel(show) {
      els.missionPanel.classList.toggle('show', show);
      if (show) this.updateMissionList();
    },

    // ---- Minimap: roads, beach, harbor, player, cars, police, marker ----
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
      // Cars (white), police (flashing blue/red), target (orange).
      for (const car of G.cars) {
        let col = '#e8e8e8';
        if (car.driver === 'police') col = Math.sin(G.elapsed * 9) > 0 ? '#ff3333' : '#3388ff';
        else if (car.driver === 'target') col = '#ff7a1a';
        else if (car.driver === 'player') continue; // player arrow covers it
        mm.fillStyle = col;
        mm.fillRect(toMap(car.pos.x) - 2, toMap(car.pos.z) - 2, 4, 4);
      }
      // Foot cops.
      mm.fillStyle = '#3388ff';
      for (const cop of G.police.cops) {
        if (!cop.alive) continue;
        mm.fillRect(toMap(cop.pos.x) - 2, toMap(cop.pos.z) - 2, 4, 4);
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
      // Speed + ammo.
      if (!G.player.onFoot && G.player.car) {
        els.speed.classList.add('show');
        els.speedVal.textContent = Math.round(Math.abs(G.player.car.speed) * 3.6);
        els.ammo.textContent = `Ammo ${G.combat.ammo}${G.combat.reloading ? ' — reloading…' : ''}`;
      } else {
        els.speed.classList.remove('show');
        els.ammo.textContent = `Ammo ${G.combat.ammo}${G.combat.reloading ? ' — reloading…' : ''}`;
      }
      // Interact prompt.
      const near = G.driving.nearestEnterable();
      if (G.player.onFoot && near) {
        els.interact.textContent = near.driver === 'traffic'
          ? 'Press E — jack this car'
          : 'Press E — get in the car';
        els.interact.classList.add('show');
      } else if (G.player.onFoot && G.missions.index === 4 && G.missions.stage === 0 &&
        Math.hypot(G.player.pos.x - PLACES.harbor.x, G.player.pos.z - PLACES.harbor.z) < 8) {
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
    showPause() { els.pauseMenu.classList.add('show'); },
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
