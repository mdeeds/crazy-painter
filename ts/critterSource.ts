import * as AFRAME from "aframe";

import { Critter, CritterParts } from "./critter";
import { Debug } from "./debug";
import { Wall } from "./wall";

export class CritterSource {
  private timeToNextCritterMs = 1000;
  private critters: Critter[] = [];
  constructor(private wall: Wall) {
  }

  private makeFoot(x: number, z: number, container: AFRAME.Entity): AFRAME.Entity {
    const foot = document.createElement('a-cylinder');
    foot.setAttribute('radius', '0.01');
    foot.setAttribute('height', '0.01');
    foot.object3D.position.set(x, 0.02, z);
    return foot;
  }

  private makeTurtle(container: AFRAME.Entity, spawnTime: number) {
    const body = document.createElement('a-box');
    body.setAttribute('width', '0.2');
    body.setAttribute('depth', '0.01');
    body.setAttribute('height', '0.01');
    body.setAttribute('position', '0 0.02 0');

    const parts = new CritterParts(body);
    parts.feet.push(this.makeFoot(0.07, 0.03, container));
    parts.feet.push(this.makeFoot(-0.07, 0.03, container));
    parts.feet.push(this.makeFoot(-0.07, -0.03, container));
    parts.feet.push(this.makeFoot(0.07, -0.03, container));

    const critter = new Critter(
      Critter.walkingGait, container, parts, this.wall, spawnTime);
    return critter;
  }

  tick(timeMs: number, timeDeltaMs: number) {
    this.timeToNextCritterMs -= timeDeltaMs;
    if (this.timeToNextCritterMs <= 0) {
      const turtleEnt = document.createElement('a-entity');
      turtleEnt.setAttribute('position', `1 ${Math.random() * 2 + 0.2} ${this.wall.wallZ}`);
      turtleEnt.setAttribute('rotation', '90 0 0');
      const turtle = this.makeTurtle(turtleEnt, timeMs);
      this.critters.push(turtle);
      document.querySelector('a-scene').appendChild(turtleEnt);
      this.timeToNextCritterMs = 5000;
    }

    for (const critter of this.critters) {
      critter.setPositions(timeMs);
    }
  }
}