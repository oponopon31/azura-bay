// shots.js — Deterministic screenshot poses. The game reads ?shot=<name>&seed=N
// and stages that exact scene: fixed seed, fixed camera, fixed time of day,
// HUD and minimap visible, menus hidden. The same query always stages the same shot.

import * as THREE from 'three';
import { PLACES } from './config.js';
import { makeCar } from './vehicles.js';

export function applyShot(G, name) {
  // All shots: game already running, menus hidden, HUD on.
  G.mode = 'playing';
  G.hud.hideMenus();
  G.timeOfDay = 17.5; // golden hour by default
  G.dayNightCycle = false; // freeze the clock for reproducibility

  const player = G.player;
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
    G.timeOfDay = 17.6;
    const car = makeCar(G, 'coupe', 0, 120, Math.PI, 'player');
    putPlayerInCar(car, 26);
    player.heading = Math.PI;
    // Traffic ahead.
    const t1 = makeCar(G, 'sedan', 4, 40, Math.PI, 'traffic');
    t1.speed = 12; t1.route = { axis: 'z', road: 0, dir: -1, targetSpeed: 12 };
    const t2 = makeCar(G, 'taxi', -4, 70, Math.PI, 'traffic');
    t2.speed = 10; t2.route = { axis: 'z', road: 0, dir: -1, targetSpeed: 10 };
    // Two police cars in pursuit behind.
    const p1 = makeCar(G, 'police', 4, 165, Math.PI, 'police');
    p1.speed = 30;
    const p2 = makeCar(G, 'police', -4, 185, Math.PI, 'police');
    p2.speed = 28;
    G.police.heat = 55;
    G.police.stars = 3;
    G.police.lastSeen = G.elapsed;
    G.missions.index = 0;
    G.missions.active = true;
    G.missions.stage = 1;
    G.missions.setMarker(PLACES.garage.x, PLACES.garage.z, 'Deliver the car');
    G.hud.showDialog('LUCIA', 'Lucia: "Two units on your tail, Jason — lose them before the garage."', 9000);
    G.hud.toast('Wanted level 3 — lose the cops!');
  } else if (name === 'shootout') {
    // On-foot shootout at a mission marker, police closing in.
    G.timeOfDay = 17.9;
    player.pos.set(-120, 0, -116);
    player.heading = Math.PI * 0.75;
    player.camYaw = Math.PI * 0.75 + Math.PI;
    player.aiming = true;
    // A full magazine for the shootout pose.
    if (G.weapons) {
      G.weapons.give('es9');
      G.weapons.equip('es9');
      G.weapons.magAmmo.es9 = 12;
    }
    G.police.heat = 34;
    G.police.stars = 2;
    G.police.lastSeen = G.elapsed;
    const cop1 = G.police.spawnCop();
    cop1.pos.set(-108, 0, -128); cop1.mesh.position.copy(cop1.pos);
    const cop2 = G.police.spawnCop();
    cop2.pos.set(-132, 0, -104); cop2.mesh.position.copy(cop2.pos);
    const pc = makeCar(G, 'police', -100, -90, Math.PI * 0.25, 'police');
    pc.speed = 0;
    G.missions.index = 3;
    G.missions.active = true;
    G.missions.stage = 0;
    G.missions.setMarker(-120, -120, 'Reach 3 stars');
    G.hud.showDialog('LUCIA', 'Lucia: "The heat is on — make them regret it, Jason."', 9000);
  } else if (name === 'dusk') {
    // High dusk overview: skyline, beachfront, traffic, golden neon hour.
    G.timeOfDay = 18.7;
    player.pos.set(-40, 0, 250);
    player.heading = Math.PI;
    player.onFoot = true;
    player.mesh.visible = true;
    G.missions.index = 1;
    G.missions.active = true;
    G.missions.setMarker(PLACES.courierDrops[0].x, PLACES.courierDrops[0].z, 'Drop 1 of 3');
    // High wide camera: set directly in main's shot camera override.
    G.shotCamera = {
      pos: new THREE.Vector3(-260, 190, 420),
      look: new THREE.Vector3(40, 10, -60),
    };
    G.hud.showDialog('JASON', 'Jason: "Azura Bay at dusk. The whole city is ours, Lucia."', 9000);
  } else if (name === 'heist') {
    // Harbor heist pickup: on foot at the docks, package grabbed, cash popup.
    G.timeOfDay = 18.2;
    player.pos.set(PLACES.harbor.x - 6, 0, PLACES.harbor.z + 4);
    player.heading = -Math.PI / 2;
    player.camYaw = Math.PI / 2;
    player.onFoot = true;
    player.mesh.visible = true;
    G.missions.index = 4;
    G.missions.active = true;
    G.missions.stage = 1;
    G.missions.hasPackage = true;
    G.missions.setMarker(PLACES.safehouseDoor.x, PLACES.safehouseDoor.z, 'Escape to the safehouse');
    G.police.heat = 55;
    G.police.stars = 3;
    G.police.lastSeen = G.elapsed;
    const pc = makeCar(G, 'police', PLACES.harbor.x - 40, PLACES.harbor.z - 20, 0, 'police');
    pc.speed = 0;
    G.money += 0; // cash lands on completion; show the popup the moment the shot is taken
    G.hud.cashPopup('+$5,000');
    G.hud.showDialog('LUCIA', 'Lucia: "Package is hot — every cop in the bay just got your description. RUN."', 9000);
    G.hud.toast('Package secured! Escape to the safehouse.');
  }
  // Force one HUD refresh so the shot shows the staged state immediately.
  G.hud.update(0);
  G.hud.drawMinimap();
}
