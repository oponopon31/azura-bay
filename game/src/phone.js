// phone.js — The smartphone (SPEC Bab 13). 10 apps, opened with U.
// BuckMe (savings — affects the ending), WhatUp! (messages), Lifeinvader
// (social feed), Eyefind (browser — buy vehicles, news about your crimes),
// Music/Radio (radio on foot via headphones), Camera & Wildlife Logbook,
// RydeMe (ride-hailing = paid fast travel), Wink App (scan a car from
// afar: locked / alarm / GPS tracker), Scooter Bros (register & manage up
// to 10 scooters / light bikes), Snapmatic (the 10th app — phone photos,
// incl. the GTA 7 poster joke from Bab 21).
// Cheats are also entered here: D-Pad Up opens the phone, hold L1+R1 /
// LB+RB, then a D-Pad combo — here: type the combo as arrow keys while
// the phone is open.
// Round 5: table rows re-expressed one field per line. Values unchanged.

export const PHONE_APPS = [
  'BuckMe', 'WhatUp!', 'Lifeinvader', 'Eyefind', 'Music',
  'Camera', 'RydeMe', 'Wink App', 'Scooter Bros', 'Snapmatic',
];

export function createPhone(Game) {
  const P = {
    apps: PHONE_APPS,
    currentApp: 'BuckMe',
    scooters: [], // up to 10 registered scooters / light bikes
    messages: [
      {
        from: 'Lucia',
        text: 'We good? The Keys job paid out. Meet at Brian\'s.',
        time: '09:12',
      },
      {
        from: 'Jason',
        text: 'On my way. Bring the car, not the attitude.',
        time: '09:14',
      },
      {
        from: 'Cal',
        text: 'THE COAST GUARD IS LISTENING. Also I need beer.',
        time: '10:02',
      },
      {
        from: 'Boobie',
        text: 'Jack of Hearts tonight. Don\'t be late, don\'t be broke.',
        time: '11:30',
      },
    ],
    feed: [
      {
        user: '@vicecitydrifter',
        text: 'Somebody just jumped the drawbridge in a stolen Banshee??',
        likes: 412,
      },
      {
        user: '@leonidawild',
        text: 'Skunk Ape sighting in Grassrivers. AGAIN. I have photos.',
        likes: 1203,
      },
      {
        user: '@onlyrawrecords',
        text: 'Real Dimez in the studio tonight. New heat dropping.',
        likes: 8900,
      },
    ],
    // ---- App renderers (each returns HTML for the phone panel) ----
    render(el) {
      const app = this.currentApp;
      let body = '';
      if (app === 'BuckMe') {
        const e = Game.economy;
        body = `<b>BuckMe — Joint Savings</b><br>Savings: $${Math.floor(e ? e.clean : 0).toLocaleString()}<br>Cash: $${Math.floor(Game.money).toLocaleString()}<br>Marked bills: $${e ? Math.floor(e.marked).toLocaleString() : 0}<br><span style="color:#9fb8c8">Savings + your bond with Lucia shape the ending.</span><br><br><button data-act="deposit" style="margin:2px;padding:6px 10px">Deposit $1,000</button> <button data-act="withdraw" style="margin:2px;padding:6px 10px">Withdraw $1,000</button>`;
      } else if (app === 'WhatUp!') {
        body = `<b>WhatUp!</b><br>` + this.messages.map((m) => `<div style="margin:6px 0"><b>${m.from}</b> <span style="color:#9fb8c8">${m.time}</span><br>${m.text}</div>`).join('');
      } else if (app === 'Lifeinvader') {
        body = `<b>Lifeinvader</b><br>` + this.feed.map((f) => `<div style="margin:6px 0"><b>${f.user}</b><br>${f.text}<br><span style="color:#ff7fa8">♥ ${f.likes}</span></div>`).join('');
      } else if (app === 'Eyefind') {
        const stars = Game.police.stars;
        body = `<b>Eyefind</b><br>Top story: ${stars > 0 ? `Wanted duo spotted in Vice City — ${stars} star${stars > 1 ? 's' : ''} and counting.` : 'Vice City quiet tonight. For once.'}<br><br>Vehicle listings: <button data-act="buy-car" style="margin:2px;padding:6px 10px">Buy a Sultan — $48,000</button>`;
      } else if (app === 'Music') {
        const r = Game.radio;
        body = `<b>Music / Radio</b><br>Now playing: ${r ? r.current.name : '—'} — ${r ? r.current.genre : ''}<br><span style="color:#9fb8c8">Headphones on — radio works on foot too.</span><br><br><button data-act="radio-next" style="margin:2px;padding:6px 10px">Next station (V)</button>`;
      } else if (app === 'Camera') {
        const f = Game.fishing;
        body = `<b>Camera & Wildlife Logbook</b><br>Species logged: ${f ? f.compendiumCount() : 0} / 232<br>Fish: ${f ? f.logbookCount() : 0} / 35<br><br><button data-act="snap" style="margin:2px;padding:6px 10px">Take a photo</button>`;
      } else if (app === 'RydeMe') {
        body = `<b>RydeMe — Rides</b><br>Paid fast travel across Leonida.<br><br><button data-act="ryde-safehouse" style="margin:2px;padding:6px 10px">Ride to safehouse — $25</button> <button data-act="ryde-beach" style="margin:2px;padding:6px 10px">Ride to Ocean Beach — $40</button>`;
      } else if (app === 'Wink App') {
        body = `<b>Wink App — Car Scanner</b><br>Point the phone camera at a car to scan it: locked? alarm? GPS tracker?<br><br><button data-act="wink" style="margin:2px;padding:6px 10px">Scan nearest car</button><div id="wink-result" style="margin-top:6px"></div>`;
      } else if (app === 'Scooter Bros') {
        body = `<b>Scooter Bros</b><br>Registered: ${this.scooters.length} / 10<br>${this.scooters.map((s) => `<div>${s}</div>`).join('') || '<span style="color:#9fb8c8">No scooters yet.</span>'}<br><br><button data-act="scooter-add" style="margin:2px;padding:6px 10px">Register current bike</button>`;
      } else if (app === 'Snapmatic') {
        body = `<b>Snapmatic</b><br>Phone photos. The GTA 7 poster in town is… a poster for a game that does not exist yet. Snap it anyway.<br><br><button data-act="snap" style="margin:2px;padding:6px 10px">Snap a photo</button>`;
      }
      el.innerHTML = `<div style="display:flex;flex-wrap:wrap;gap:4px;margin-bottom:8px">${this.apps.map((a) => `<button data-app="${a}" style="padding:4px 8px;font-size:11px;background:${a === app ? '#ffd23f' : 'rgba(255,255,255,0.08)'};color:${a === app ? '#111' : '#eee'};border:1px solid rgba(255,255,255,0.2);border-radius:6px;cursor:pointer">${a}</button>`).join('')}</div><div>${body}</div><div style="margin-top:8px;color:#9fb8c8;font-size:11px">U closes the phone · cheats: type a D-Pad combo (arrow keys) here</div>`;
      el.querySelectorAll('button[data-app]').forEach((b) => {
        b.addEventListener('click', () => { this.currentApp = b.dataset.app; this.render(el); });
      });
      el.querySelectorAll('button[data-act]').forEach((b) => {
        b.addEventListener('click', () => this.act(b.dataset.act, el));
      });
    },
    act(action, el) {
      if (action === 'deposit') { if (Game.economy) Game.economy.deposit(1000); }
      else if (action === 'withdraw') { if (Game.economy) Game.economy.withdraw(1000); }
      else if (action === 'radio-next') { if (Game.radio) Game.radio.next(); }
      else if (action === 'snap') {
        Game.hud.toast('Photo taken — saved to Snapmatic.');
        if (Game.world) Game.world.takePhoto();
      }
      else if (action === 'ryde-safehouse' || action === 'ryde-beach') {
        const cost = action === 'ryde-safehouse' ? 25 : 40;
        if (Game.money < cost) { Game.hud.toast('Not enough cash for a RydeMe.'); return; }
        Game.money -= cost;
        const dest = action === 'ryde-safehouse' ? { x: 0, z: 0 } : { x: 300, z: 300 };
        Game.player.pos.set(dest.x, 0, dest.z);
        Game.hud.toast(`RydeMe dropped you off — $${cost}.`);
      }
      else if (action === 'wink') {
        const car = Game.driving ? Game.driving.nearestEnterable() : null;
        const res = el.querySelector('#wink-result');
        if (!car) { if (res) res.textContent = 'No car nearby to scan.'; return; }
        if (res) res.textContent = `${car.model || car.kind}: ${car.tracker ? 'GPS TRACKER — will call the police if stolen' : 'No tracker'} · Security tier ${car.securityTier} · Fuel ${Math.round(car.fuel * 100)}%`;
      }
      else if (action === 'scooter-add') {
        if (this.scooters.length >= 10) { Game.hud.toast('Scooter Bros is full (10).'); return; }
        const car = Game.player.car;
        if (!car) { Game.hud.toast('Get on a scooter or light bike first.'); return; }
        this.scooters.push(car.model || car.kind);
        Game.hud.toast(`Registered ${car.model || car.kind} with Scooter Bros (${this.scooters.length}/10).`);
      }
      else if (action === 'buy-car') {
        if (Game.money < 48000) { Game.hud.toast('You need $48,000 for the Sultan.'); return; }
        Game.money -= 48000;
        Game.hud.toast('Bought a Karin Sultan via Eyefind — pick it up at your garage.');
      }
      this.render(el);
    },
    // Cheat combo entry: arrow keys typed while the phone is open.
    typeComboKey(key) {
      const map = { ArrowUp: 'U', ArrowDown: 'D', ArrowLeft: 'L', ArrowRight: 'R' };
      const dir = map[key];
      if (!dir) return;
      this._combo = (this._combo || '') + dir + ' ';
      const combo = this._combo.trim();
      if (Game.cheats) {
        const hit = Game.cheats.activateByCombo(combo);
        if (hit) this._combo = '';
      }
      if (combo.split(' ').length >= 10) this._combo = '';
    },
    // Round 3: the phone's app names, in install order (HUD app grid).
    appNames() {
      return this.apps.map((a) => a.name || a.id);
    },
    // ---- Save / load ----
    serialize() {
      return { scooters: this.scooters, messages: this.messages, currentApp: this.currentApp };
    },
    restore(data) {
      if (data.scooters) this.scooters = data.scooters;
      if (data.messages) this.messages = data.messages;
      if (data.currentApp) this.currentApp = data.currentApp;
    },
  };
  return P;
}
