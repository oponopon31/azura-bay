// shots.js — Deterministic screenshot poses. The game reads ?shot=<name>&seed=N
// and stages that exact scene: fixed seed, fixed camera, fixed time of day,
// HUD and minimap visible, menus hidden. The same query always stages the same shot.
// The night pose is the fifth entry — it stages but has no screenshot file yet,
// so the build warns and ships without it.
// Round 5: Game replaces G; the poses are unchanged.

import { makeCar } from './vehicles.js';
import { PLACES } from './config.js';
import * as THREE from 'three';

// Round 3: the staged poses, including the new night meet.
export const SHOT_NAMES = ['cover', 'shootout', 'dusk', 'heist', 'night'];

export function applyShot(Game, name) {
  // All shots: game already running, menus hidden, HUD on.
  Game.mode = 'playing';
  Game.hud.hideMenus();
  Game.timeOfDay = 17.5; // golden hour by default
  Game.dayNightCycle = false; // freeze the clock for reproducibility

  const player = Game.player;
  const putPlayerInCar = (car, speed) => {
    player.onFoot = false;
    player.car = car;
    car.driver = 'player';
    car.speed = speed || 0;
    player.mesh.visible = false;
    player.pos.copy(car.pos);
  };

  if (name === 'cover') {
    // Driving chase: player coupe on Marina Row, traffic ahead, police behind, 3 stars.
    Game.timeOfDay = 17.6;
    const car = makeCar(Game, 'coupe', 0, 120, Math.PI, 'player');
    putPlayerInCar(car, 26);
    player.heading = Math.PI;
    // Traffic ahead.
    const t1 = makeCar(Game, 'sedan', 4, 40, Math.PI, 'traffic');
    t1.speed = 12; t1.route = { axis: 'z', road: 0, dir: -1, targetSpeed: 12 };
    const t2 = makeCar(Game, 'taxi', -4, 70, Math.PI, 'traffic');
    t2.speed = 10; t2.route = { axis: 'z', road: 0, dir: -1, targetSpeed: 10 };
    // Two police cars in pursuit behind.
    const p1 = makeCar(Game, 'police', 4, 165, Math.PI, 'police');
    p1.speed = 30;
    const p2 = makeCar(Game, 'police', -4, 185, Math.PI, 'police');
    p2.speed = 28;
    Game.police.heat = 55;
    Game.police.stars = 3;
    Game.police.lastSeen = Game.elapsed;
    Game.missions.index = 0;
    Game.missions.active = true;
    Game.missions.stage = 1;
    Game.missions.setMarker(PLACES.garage.x, PLACES.garage.z, 'Deliver the car');
    Game.hud.showDialog('LUCIA', 'Lucia: "Two units on your tail, Jason — lose them before the garage."', 9000);
    Game.hud.toast('Wanted level 3 — lose the cops!');
  } else if (name === 'shootout') {
    // On-foot shootout at a mission marker, police closing in.
    Game.timeOfDay = 17.9;
    player.pos.set(-120, 0, -116);
    player.heading = Math.PI * 0.75;
    player.camYaw = Math.PI * 0.75 + Math.PI;
    player.aiming = true;
    // A full magazine for the shootout pose.
    if (Game.weapons) {
      Game.weapons.give('es9');
      Game.weapons.equip('es9');
      Game.weapons.magAmmo = 12;
    }
    Game.police.heat = 34;
    Game.police.stars = 2;
    Game.police.lastSeen = Game.elapsed;
    const cop1 = Game.police.spawnCop();
    cop1.pos.set(-108, 0, -128); cop1.mesh.position.copy(cop1.pos);
    const cop2 = Game.police.spawnCop();
    cop2.pos.set(-132, 0, -104); cop2.mesh.position.copy(cop2.pos);
    const pc = makeCar(Game, 'police', -100, -90, Math.PI * 0.25, 'police');
    pc.speed = 0;
    Game.missions.index = 3;
    Game.missions.active = true;
    Game.missions.stage = 0;
    Game.missions.setMarker(-120, -120, 'Reach 3 stars');
    Game.hud.showDialog('LUCIA', 'Lucia: "The heat is on — make them regret it, Jason."', 9000);
  } else if (name === 'dusk') {
    // High dusk overview: skyline, beachfront, traffic, golden neon hour.
    Game.timeOfDay = 18.7;
    player.pos.set(-40, 0, 250);
    player.heading = Math.PI;
    player.onFoot = true;
    player.mesh.visible = true;
    Game.missions.index = 1;
    Game.missions.active = true;
    Game.missions.setMarker(PLACES.courierDrops[0].x, PLACES.courierDrops[0].z, 'Drop 1 of 3');
    // High wide camera: set directly in main's shot camera override.
    Game.shotCamera = {
      pos: new THREE.Vector3(-260, 190, 420),
      look: new THREE.Vector3(40, 10, -60),
    };
    Game.hud.showDialog('JASON', 'Jason: "Azura Bay at dusk. The whole city is ours, Lucia."', 9000);
  } else if (name === 'heist') {
    // Harbor heist pickup: on foot at the docks, package grabbed, cash popup.
    Game.timeOfDay = 18.2;
    player.pos.set(PLACES.harbor.x - 6, 0, PLACES.harbor.z + 4);
    player.heading = -Math.PI / 2;
    player.camYaw = Math.PI / 2;
    player.onFoot = true;
    player.mesh.visible = true;
    Game.missions.index = 4;
    Game.missions.active = true;
    Game.missions.stage = 1;
    Game.missions.hasPackage = true;
    Game.missions.setMarker(PLACES.safehouseDoor.x, PLACES.safehouseDoor.z, 'Escape to the safehouse');
    // Fixed camera: 7 m behind the player at the docks, looking west at
    // the player with the police car and the city beyond. Without this the
    // framing depends on the third-person camera lerp converging, which
    // in slow headless runs leaves the player a speck on the horizon.
    Game.shotCamera = {
      pos: new THREE.Vector3(PLACES.harbor.x + 1, 2.6, PLACES.harbor.z + 4),
      look: new THREE.Vector3(PLACES.harbor.x - 6, 1.4, PLACES.harbor.z + 4),
    };
    Game.police.heat = 55;
    Game.police.stars = 3;
    Game.police.lastSeen = Game.elapsed;
    const pc = makeCar(Game, 'police', PLACES.harbor.x - 40, PLACES.harbor.z - 20, 0, 'police');
    pc.speed = 0;
    Game.money += 0; // cash lands on completion; show the popup the moment the shot is taken
    Game.hud.cashPopup('+$5,000');
    Game.hud.showDialog('LUCIA', 'Lucia: "Package is hot — every cop in the bay just got your description. RUN."', 9000);
    Game.hud.toast('Package secured! Escape to the safehouse.');
  } else if (name === 'night') {
    // Night meet at the Ocean Drive nightclub: neon, a parked coupe,
    // a taxi rolling past, one star, Lucia waiting by the door.
    Game.timeOfDay = 21.3;
    player.pos.set(PLACES.nightclub.x + 4, 0, PLACES.nightclub.z + 6);
    player.heading = Math.PI / 2;
    player.camYaw = -Math.PI / 2;
    player.onFoot = true;
    player.mesh.visible = true;
    const nc = makeCar(Game, 'coupe', PLACES.nightclub.x - 8, PLACES.nightclub.z - 2, Math.PI / 2, 'parked');
    nc.speed = 0;
    const tx = makeCar(Game, 'taxi', PLACES.nightclub.x + 12, PLACES.nightclub.z - 14, 0, 'traffic');
    tx.speed = 8; tx.route = { axis: 'x', road: -240, dir: 1, targetSpeed: 8 };
    Game.police.heat = 12;
    Game.police.stars = 1;
    Game.police.lastSeen = Game.elapsed;
    Game.missions.index = 2;
    Game.missions.active = true;
    Game.missions.stage = 0;
    Game.missions.setMarker(PLACES.nightclub.x, PLACES.nightclub.z, 'Meet Lucia at the nightclub');
    Game.shotCamera = {
      pos: new THREE.Vector3(PLACES.nightclub.x + 14, 3.2, PLACES.nightclub.z + 14),
      look: new THREE.Vector3(PLACES.nightclub.x, 1.4, PLACES.nightclub.z),
    };
    Game.hud.showDialog('LUCIA', 'Lucia: "Midnight at the club, Jason — the contact is inside, and the door is watching."', 9000);
    Game.hud.toast('Night meet — Ocean Drive.');
  }
  // Force one HUD refresh so the shot shows the staged state immediately.
  Game.hud.update(0);
  Game.hud.drawMinimap();
}
