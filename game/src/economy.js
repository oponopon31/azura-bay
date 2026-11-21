// economy.js — The 3-money economy + fences (SPEC Bab 17).
// 1) Clean money / bank balance — spent directly, saved in BuckMe.
//    Some main-story missions need a minimum bank balance to open.
// 2) Marked Bills — from bank / armored-truck robberies; must be washed
//    through a fence before they can be spent.
// 3) Stolen Goods — drugs, jewelry, luxury watches, stolen cars.
// Fences (specialists): Tyrone pays best for drugs; Yasmani for jewelry &
// marked bills (and opens armored-truck / bank-vault jobs); Moses for
// standard stolen cars without a tracker in Chapter 2 ($1,000+);
// Pay 'n' Spray for tracked standard stolen cars from early Chapter 3
// ($4,000+); Randy for special-order supercars in mint condition
// ($30,000+ per car). Wallet cap: $20,000 cash on hand (Bab 23) —
// anything above that must go to the bank / safe.
// ATMs can be ripped out with a tow hook; safes can be blown with a grenade.

export const FENCES = [
  { id: 'tyrone', name: 'Tyrone', specialty: 'drugs', rate: 1.0, desc: 'Pays the best price for drugs.' },
  { id: 'yasmani', name: 'Yasmani', specialty: 'jewelry', rate: 0.95, desc: 'Jewelry & marked bills — and opens armored-truck and bank-vault jobs.' },
  { id: 'moses', name: 'Moses', specialty: 'cars', rate: 0.8, desc: 'Standard stolen cars without a tracker (Chapter 2, $1,000+).' },
  { id: 'paynspray', name: "Pay 'n' Spray", specialty: 'tracked-cars', rate: 0.85, desc: 'Tracked standard stolen cars, from early Chapter 3 ($4,000+).' },
  { id: 'randy', name: 'Randy', specialty: 'supercars', rate: 1.0, desc: 'Special-order supercars in mint condition ($30,000+ per car).' },
];

export const WALLET_MAX = 20000;

export function createEconomy(G) {
  const E = {
    fences: FENCES,
    clean: 0,        // bank balance (BuckMe savings — affects the ending)
    marked: 0,       // marked bills (must be washed)
    goods: {},       // stolen goods: {drugs, jewelry, watches, cars}
    // Cash on hand is G.money; the wallet cap forces the rest to the bank.
    deposit(amount) {
      const amt = Math.min(amount, G.money);
      if (amt <= 0) return { ok: false, reason: 'Nothing to deposit.' };
      G.money -= amt;
      this.clean += amt;
      G.hud.toast(`Deposited $${amt.toLocaleString()} to BuckMe.`);
      return { ok: true, amount: amt };
    },
    withdraw(amount) {
      const amt = Math.min(amount, this.clean);
      if (amt <= 0) return { ok: false, reason: 'No savings to withdraw.' };
      if (G.money + amt > WALLET_MAX) return { ok: false, reason: `Wallet cap is $${WALLET_MAX.toLocaleString()} — withdraw less.` };
      this.clean -= amt;
      G.money += amt;
      return { ok: true, amount: amt };
    },
    // Enforce the wallet cap after any big payout: overflow goes to the bank.
    enforceWalletCap() {
      if (G.money > WALLET_MAX) {
        const overflow = G.money - WALLET_MAX;
        G.money = WALLET_MAX;
        this.clean += overflow;
        G.hud.toast(`Wallet full — $${overflow.toLocaleString()} moved to BuckMe.`);
      }
    },
    // Robbery / heist income arrives as marked bills (Bab 17).
    addMarked(amount) {
      this.marked += amount;
      G.hud.toast(`Marked bills: $${this.marked.toLocaleString()} — wash them through a fence.`);
    },
    addGoods(kind, amount) {
      this.goods[kind] = (this.goods[kind] || 0) + amount;
    },
    // Sell through a fence: the rate depends on the fence's specialty.
    fenceSell(fenceId, kind, amount) {
      const fence = FENCES.find((f) => f.id === fenceId);
      if (!fence) return { ok: false, reason: 'Unknown fence.' };
      if (kind === 'marked') {
        if (this.marked < amount) return { ok: false, reason: 'Not enough marked bills.' };
        this.marked -= amount;
        const paid = Math.round(amount * (fence.id === 'yasmani' ? 0.8 : 0.6));
        G.money += paid;
        G.stats.markedWashed = (G.stats.markedWashed || 0) + amount;
        G.audio.cash();
        return { ok: true, paid, fence: fence.name };
      }
      const have = this.goods[kind] || 0;
      if (have < amount) return { ok: false, reason: `You only have ${have} ${kind}.` };
      this.goods[kind] -= amount;
      const base = { drugs: 500, jewelry: 800, watches: 1200, cars: 1000 }[kind] || 100;
      const rate = fence.specialty === kind ? fence.rate : fence.rate * 0.7;
      const paid = Math.round(base * amount * rate);
      G.money += paid;
      G.audio.cash();
      this.enforceWalletCap();
      return { ok: true, paid, fence: fence.name };
    },
    // Sell a stolen car to the right fence (Bab 17 pricing).
    fenceCar(car) {
      const isSuper = car.cls && car.cls.maxSpeed >= 44;
      const mint = car.health >= 0.9;
      if (isSuper && mint) {
        G.money += 30000;
        G.hud.cashPopup('+$30,000');
        return { ok: true, paid: 30000, fence: 'Randy' };
      }
      if (car.tracker) {
        G.money += 4000;
        return { ok: true, paid: 4000, fence: "Pay 'n' Spray" };
      }
      G.money += 1000;
      return { ok: true, paid: 1000, fence: 'Moses' };
    },
    // ATM ripped out with a tow hook (Bab 23): $2,000–$5,000, big heat.
    ripATM() {
      const take = 2000 + Math.floor(Math.random() * 3000);
      G.money += take;
      G.police.addHeat(35, 'ripped out an ATM');
      G.hud.cashPopup(`+$${take.toLocaleString()}`);
      this.enforceWalletCap();
      return take;
    },
    // Safe blown with a grenade (Bab 23): $3,000–$8,000, big heat.
    blowSafe() {
      const take = 3000 + Math.floor(Math.random() * 5000);
      G.money += take;
      G.police.addHeat(40, 'blew a safe');
      G.hud.cashPopup(`+$${take.toLocaleString()}`);
      this.enforceWalletCap();
      return take;
    },
    // Mission gate (Bab 17): some story missions need a minimum balance.
    meetsBalanceGate(amount) {
      return this.clean + G.money >= amount;
    },
    // ---- Save / load ----
    serialize() {
      return { clean: this.clean, marked: this.marked, goods: this.goods };
    },
    restore(data) {
      if (typeof data.clean === 'number') this.clean = data.clean;
      if (typeof data.marked === 'number') this.marked = data.marked;
      if (data.goods) this.goods = data.goods;
    },
  };
  return E;
}
