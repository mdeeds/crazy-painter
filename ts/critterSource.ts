import * as AFRAME from "aframe";

import { Critter } from "./critter";
import { Wall } from "./wall";

export class CritterSource {

  private critters: Critter[] = [];

  constructor(private wall: Wall) {
    const turtleEnt = document.createElement('a-entity');
    turtleEnt.setAttribute('position', `1 1 ${wall.wallZ}`);
    const turtle = this.makeTurtle(turtleEnt);
    this.critters.push(turtle);
    document.querySelector('a-scene').appendChild(turtleEnt);
  }

  private makeFoot(container: AFRAME.Entity, x: number, z: number): AFRAME.Entity {
    const foot = document.createElement('a-cylinder');
    foot.setAttribute('radius', '0.01');
    foot.setAttribute('height', '0.01');
    foot.setAttribute('position', `${x} -0.02 ${z}`);
    container.appendChild(foot);
    return foot;
  }

  private makeTurtle(container: AFRAME.Entity) {

    const body = document.createElement('a-box');
    body.setAttribute('width', 0.2);
    body.setAttribute('depth', '0.08');
    body.setAttribute('height', '0.01');
    body.setAttribute('position', '0 0.02 0');
    container.appendChild(body);

    const critter = new Critter(
      Critter.walkingGait, body, this.wall);


    critter.addFoot(this.makeFoot(container, 0.07, 0.08));
    critter.addFoot(this.makeFoot(container, -0.07, 0.08));
    critter.addFoot(this.makeFoot(container, -0.07, -0.08));
    critter.addFoot(this.makeFoot(container, 0.07, -0.08));
    return critter;
  }

  tick(timeMs: number, timeDeltaMs: number) {
    for (const critter of this.critters) {
      critter.setPositions(timeMs);
    }
  }
}