import * as AFRAME from "aframe";

import { Critter, CritterParts } from "./critter";
import { Debug } from "./debug";
import { Wall } from "./wall";

export class CritterSource {
  private critters: Critter[] = [];
  constructor(private wall: Wall) {
    const turtleEnt = document.createElement('a-entity');
    turtleEnt.setAttribute('position', `0 1 ${wall.wallZ}`);
    turtleEnt.setAttribute('rotation', '90 0 0');
    const turtle = this.makeTurtle(turtleEnt);
    this.critters.push(turtle);
    document.querySelector('a-scene').appendChild(turtleEnt);
  }

  private makeFoot(x: number, z: number, container: AFRAME.Entity): AFRAME.Entity {
    const foot = document.createElement('a-cylinder');
    foot.setAttribute('radius', '0.01');
    foot.setAttribute('height', '0.01');
    foot.object3D.position.set(x, 0.02, z);
    return foot;
  }

  private makeTurtle(container: AFRAME.Entity) {

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
      Critter.walkingGait, container, parts, this.wall);
    return critter;
  }

  tick(timeMs: number, timeDeltaMs: number) {
    for (const critter of this.critters) {
      critter.setPositions(timeMs);
    }
  }
}