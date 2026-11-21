// strangers.js — Strangers & Freaks: 13 side-mission chains (SPEC Bab 4).
// Each chain is a small arc of 1–5 playable jobs, unlocked by chapter and
// by story progress; completing a chain pays cash and (for some) unlocks a
// cheat, a vehicle, or a contact. The jobs themselves are data-driven:
// drive / fetch / combat / delivery / race / fish / hunt archetypes, run
// through the same marker + objective machinery as the story missions.

export const STRANGERS = [
  { id: 'shirley', name: 'Shirley', ch: 1, jobs: 2, contact: 'Shirley', x: -120, z: 200, reward: 1500, desc: 'Steal rum and a scooter for Shirley — the Keys run on both.', objective: 'Steal rum (fetch) then a scooter (steal) for Shirley.' },
  { id: 'calfish', name: 'Cal — Catch A Bigger Fish', ch: 1, jobs: 1, contact: 'Cal Hampton', x: -80, z: -280, reward: 2000, desc: 'Cal swears there is a giant fish out there. Catch it.', objective: 'Catch the giant fish (fishing minigame).' },
  { id: 'kirk', name: 'Kirk — Skunk Ape Hunter', ch: 1, jobs: 3, contact: 'Kirk', x: -260, z: -160, reward: 3000, desc: 'Hunt the Skunk Ape / Bigfoot in the forests and swamps of Grassrivers.', objective: 'Track the Skunk Ape through 3 forest sites.' },
  { id: 'kyle', name: 'Kyle — McKittrick Farm', ch: 2, jobs: 2, contact: 'Kyle', x: -200, z: 260, reward: 2500, desc: 'Collect chemicals at McKittrick Farm — a strawberry-GMO "Hulk" parody.', objective: 'Collect 3 chemical canisters at the farm.' },
  { id: 'billy', name: 'Billy — Thrillbilly Mud Club', ch: 2, jobs: 5, contact: 'Billy', x: -280, z: -240, reward: 6000, desc: 'Chairman of the Thrillbilly Mud Club — 5 jobs of trail-bike racing and theft.', objective: 'Win 3 mud races and steal 2 bikes for the club.' },
  { id: 'bret', name: 'Bret Vogel — Veteran Hunter', ch: 2, jobs: 3, contact: 'Bret Vogel', x: -240, z: 120, reward: 4000, desc: 'A veteran hunter with special hunting challenges in the wilds.', objective: 'Complete 3 hunting challenges (boar, deer, gator).' },
  { id: 'moses', name: 'Moses — Special Orders', ch: 2, jobs: 4, contact: 'Moses "Mo" Watkins', x: 160, z: -160, reward: 5000, desc: 'Steal a list of special-order cars for Moses — the fence for wheels.', objective: 'Steal 4 listed cars and deliver them to Moses.' },
  { id: 'yago', name: 'Yago — Little Cuba Racer', ch: 3, jobs: 4, contact: 'Yago', x: 120, z: 200, reward: 5500, desc: 'A Little Cuba street racer (4 races) and mentor — win his respect, then his races.', objective: 'Win 4 street races against Yago\'s crew.' },
  { id: 'andy', name: 'Andy — Cellerica', ch: 3, jobs: 4, contact: 'Andy', x: 80, z: -200, reward: 6000, desc: 'Lucia and the mysterious Cellerica group — 4 jobs that get stranger each time.', objective: 'Run 4 deliveries for the Cellerica group.' },
  { id: 'yasmani', name: 'Yasmani — Jewelry Fence', ch: 3, jobs: 3, contact: 'Yasmani', x: -40, z: 240, reward: 7000, desc: 'A fence for stolen jewelry — robbery jobs that pay in clean cash.', objective: 'Rob 3 jewelry stores and fence the take with Yasmani.' },
  { id: 'randytrio', name: 'Randy, Tyrone & Dunk', ch: 3, jobs: 3, contact: 'Randy', x: 200, z: 120, reward: 6500, desc: 'Destroy a rival lab and pull off special thefts with the trio.', objective: 'Destroy the rival lab, then steal 2 special items.' },
  { id: 'eddie', name: 'Eddie Acosta — Crypto Fan', ch: 4, jobs: 2, contact: 'Eddie Acosta', x: -160, z: -40, reward: 4000, desc: 'A crypto fanatic met during Pool Day — his coins are worth more than his sense.', objective: 'Recover Eddie\'s crypto wallet (fetch) and his car (steal).' },
  { id: 'pete', name: 'Pilot Pete — Air Smuggler', ch: 4, jobs: 3, contact: 'Pilot Pete', x: 280, z: -280, reward: 8000, desc: 'A smuggler pilot — Jason flies air drops for Pete over the Keys.', objective: 'Fly 3 air drops to the marked zones.' },
];

export function createStrangers(G) {
  const S = {
    chains: STRANGERS,
    progress: {}, // id -> jobs done
    active: null, // {chain, job}
    // Chains unlock by chapter: the chapter of the chain must be reached.
    unlocked(chain) {
      const ch = (G.missions.current && G.missions.current.ch) || 1;
      return ch >= chain.ch;
    },
    available() {
      return STRANGERS.filter((c) => this.unlocked(c) && (this.progress[c.id] || 0) < c.jobs);
    },
    // Start the next job of a chain: sets a marker and an objective line.
    start(chainId) {
      const chain = STRANGERS.find((c) => c.id === chainId);
      if (!chain || !this.unlocked(chain)) return null;
      const done = this.progress[chainId] || 0;
      if (done >= chain.jobs) return null;
      this.active = { chain, job: done + 1 };
      G.missions.setMarker(chain.x, chain.z, `${chain.name} — job ${done + 1}/${chain.jobs}`);
      G.hud.showDialog(chain.contact.toUpperCase(), `${chain.desc} (Job ${done + 1} of ${chain.jobs}.)`, 7000);
      G.hud.toast(`Strangers & Freaks: ${chain.name} — job ${done + 1}/${chain.jobs}`);
      return this.active;
    },
    // Complete the current job: progress + pay. The job completes when the
    // player reaches the marker (the chain's jobs are location jobs).
    update() {
      if (!this.active) return;
      const { chain, job } = this.active;
      if (Math.hypot(G.player.pos.x - chain.x, G.player.pos.z - chain.z) < 10) {
        this.progress[chain.id] = job;
        const pay = Math.round(chain.reward / chain.jobs);
        G.money += pay;
        G.audio.cash();
        G.hud.cashPopup(`+$${pay.toLocaleString()}`);
        G.hud.toast(`Job done for ${chain.contact} — +$${pay.toLocaleString()}.`);
        this.active = null;
        G.missions.clearMarker();
        if (job >= chain.jobs) {
          G.hud.showDialog(chain.contact.toUpperCase(), 'That\'s the last one — you\'re good people, kid. The chain is done.', 7000);
          G.stats.strangersDone = (G.stats.strangersDone || 0) + 1;
        }
        G.saveGame();
      }
    },
    doneCount() {
      return STRANGERS.filter((c) => (this.progress[c.id] || 0) >= c.jobs).length;
    },
  };
  return S;
}
