// audio.js — All sound is synthesized with WebAudio. No audio files, no network.
// Engine hum, sirens, gunshots, pickup blips, UI clicks and a procedural radio loop.

export function createAudio() {
  const A = {
    ctx: null, master: null, muted: false, radioOn: false,
    engineOsc: null, engineGain: null, engineFilter: null,
    sirenOsc: null, sirenGain: null, sirenLfo: null,
    radioTimer: null, radioStep: 0, radioNextTime: 0,
    noiseBuf: null,

    ensure() {
      if (this.ctx) { if (this.ctx.state === 'suspended') this.ctx.resume(); return; }
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return;
      this.ctx = new Ctx();
      this.master = this.ctx.createGain();
      this.master.gain.value = this.muted ? 0 : 0.5;
      this.master.connect(this.ctx.destination);
      // Shared white-noise buffer for gunshots / crashes.
      const len = this.ctx.sampleRate * 0.5;
      this.noiseBuf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
      const d = this.noiseBuf.getChannelData(0);
      for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
      this.startEngine();
      this.startSiren();
    },

    setMuted(m) {
      this.muted = m;
      if (this.master && this.ctx) this.master.gain.setTargetAtTime(m ? 0 : 0.5, this.ctx.currentTime, 0.05);
    },

    // ---- Engine: sawtooth through a lowpass, pitch follows speed ----
    startEngine() {
      const c = this.ctx;
      this.engineOsc = c.createOscillator();
      this.engineOsc.type = 'sawtooth';
      this.engineOsc.frequency.value = 55;
      this.engineFilter = c.createBiquadFilter();
      this.engineFilter.type = 'lowpass';
      this.engineFilter.frequency.value = 320;
      this.engineGain = c.createGain();
      this.engineGain.gain.value = 0;
      this.engineOsc.connect(this.engineFilter);
      this.engineFilter.connect(this.engineGain);
      this.engineGain.connect(this.master);
      this.engineOsc.start();
    },
    setEngine(speed01, on) {
      if (!this.ctx) return;
      const t = this.ctx.currentTime;
      const target = on ? 0.05 + speed01 * 0.11 : 0;
      this.engineGain.gain.setTargetAtTime(target, t, 0.08);
      this.engineOsc.frequency.setTargetAtTime(52 + speed01 * 130, t, 0.08);
      this.engineFilter.frequency.setTargetAtTime(280 + speed01 * 900, t, 0.1);
    },

    // ---- Siren: two-tone wail, gain follows nearest police distance ----
    startSiren() {
      const c = this.ctx;
      this.sirenOsc = c.createOscillator();
      this.sirenOsc.type = 'triangle';
      this.sirenOsc.frequency.value = 720;
      this.sirenLfo = c.createOscillator();
      this.sirenLfo.type = 'square';
      this.sirenLfo.frequency.value = 0.55;
      const lfoGain = c.createGain();
      lfoGain.gain.value = 160;
      this.sirenLfo.connect(lfoGain);
      lfoGain.connect(this.sirenOsc.frequency);
      this.sirenGain = c.createGain();
      this.sirenGain.gain.value = 0;
      this.sirenOsc.connect(this.sirenGain);
      this.sirenGain.connect(this.master);
      this.sirenOsc.start();
      this.sirenLfo.start();
    },
    setSiren(level) { // level 0..1
      if (!this.ctx) return;
      this.sirenGain.gain.setTargetAtTime(level * 0.05, this.ctx.currentTime, 0.2);
    },

    // ---- One-shots ----
    blip(freq, dur, type, vol) {
      if (!this.ctx) return;
      const c = this.ctx, t = c.currentTime;
      const o = c.createOscillator(), g = c.createGain();
      o.type = type || 'sine'; o.frequency.value = freq || 660;
      g.gain.setValueAtTime(vol || 0.18, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + (dur || 0.09));
      o.connect(g); g.connect(this.master);
      o.start(t); o.stop(t + (dur || 0.09) + 0.02);
    },
    click() { this.blip(880, 0.05, 'square', 0.08); },
    pickup() { this.blip(660, 0.09, 'sine', 0.2); setTimeout(() => this.blip(990, 0.12, 'sine', 0.2), 90); },
    cash() { this.blip(523, 0.1, 'triangle', 0.22); setTimeout(() => this.blip(659, 0.1, 'triangle', 0.22), 100); setTimeout(() => this.blip(784, 0.18, 'triangle', 0.22), 200); },
    gunshot() {
      if (!this.ctx) return;
      const c = this.ctx, t = c.currentTime;
      const src = c.createBufferSource(); src.buffer = this.noiseBuf;
      const f = c.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 1800;
      const g = c.createGain();
      g.gain.setValueAtTime(0.5, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.16);
      src.connect(f); f.connect(g); g.connect(this.master);
      src.start(t); src.stop(t + 0.2);
    },
    crash(intensity) {
      if (!this.ctx) return;
      const c = this.ctx, t = c.currentTime;
      const src = c.createBufferSource(); src.buffer = this.noiseBuf;
      const f = c.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = 300; f.Q.value = 0.8;
      const g = c.createGain();
      const v = Math.min(0.5, 0.15 + intensity * 0.4);
      g.gain.setValueAtTime(v, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
      src.connect(f); f.connect(g); g.connect(this.master);
      src.start(t); src.stop(t + 0.35);
    },
    punch() { this.blip(140, 0.08, 'sine', 0.3); },

    // ---- Radio: a lazy synthwave loop (Am – F – C – G), scheduled ahead ----
    // Chords as semitone offsets from A2 (110 Hz).
    setRadio(on) {
      this.radioOn = on;
      if (!this.ctx) return;
      if (on && !this.radioTimer) {
        this.radioNextTime = this.ctx.currentTime + 0.1;
        this.radioStep = 0;
        this.radioTimer = setInterval(() => this.scheduleRadio(), 120);
      } else if (!on && this.radioTimer) {
        clearInterval(this.radioTimer);
        this.radioTimer = null;
      }
    },
    scheduleRadio() {
      if (!this.ctx || !this.radioOn) return;
      const c = this.ctx;
      const chords = [[0, 3, 7, 12], [-4, 0, 5, 8], [-9, -5, 0, 3], [-2, 2, 5, 10]]; // Am F C G
      while (this.radioNextTime < c.currentTime + 0.35) {
        const chord = chords[Math.floor(this.radioStep / 8) % 4];
        const note = chord[this.radioStep % 4];
        const freq = 110 * Math.pow(2, note / 12);
        const t = this.radioNextTime;
        const o = c.createOscillator(); o.type = 'triangle'; o.frequency.value = freq * 2;
        const g = c.createGain();
        g.gain.setValueAtTime(0.0001, t);
        g.gain.exponentialRampToValueAtTime(0.055, t + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 0.42);
        o.connect(g); g.connect(this.master);
        o.start(t); o.stop(t + 0.45);
        // Soft bass on the beat.
        if (this.radioStep % 4 === 0) {
          const b = c.createOscillator(); b.type = 'sine'; b.frequency.value = freq / 2;
          const bg = c.createGain();
          bg.gain.setValueAtTime(0.0001, t);
          bg.gain.exponentialRampToValueAtTime(0.09, t + 0.02);
          bg.gain.exponentialRampToValueAtTime(0.0001, t + 0.5);
          b.connect(bg); bg.connect(this.master);
          b.start(t); b.stop(t + 0.55);
        }
        this.radioStep++;
        this.radioNextTime += 0.22;
      }
    },
  };
  return A;
}
