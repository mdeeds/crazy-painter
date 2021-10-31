import * as AFRAME from "aframe";
import { resolve } from "path";
import { AssetLibrary } from "./assetLibrary";

import { Critter, CritterParts } from "./critter";
import { Debug } from "./debug";
import { Wall } from "./wall";

export class CritterSource {
  private timeToNextCritterMs = 1000;
  private critters: Critter[] = [];

  private lizard = null;

  constructor(private wall: Wall, private assetLibrary: AssetLibrary) {
  }

  private makeFoot(x: number, z: number, container: AFRAME.Entity): any {
    const foot = document.createElement('a-cylinder');
    foot.setAttribute('radius', '0.01');
    foot.setAttribute('height', '0.01');
    foot.object3D.position.set(x, 0.02, z);
    container.appendChild(foot);
    return foot.object3D;
  }

  private makeTurtle(container: AFRAME.Entity, spawnTime: number) {
    this.lizard = document.createElement('a-entity');
    this.lizard.setAttribute('gltf-model',
      `#${this.assetLibrary.getId('obj/lizard.gltf')}`);
    this.lizard.setAttribute('scale', '0.02 0.02 0.02');
    console.log('Making a turtle');
    container.appendChild(this.lizard);

    this.lizard.addEventListener('model-loaded', () => {
      console.log('Loaded');
      const obj = this.lizard.getObject3D('mesh');
      obj.traverse(node => {
        console.log(`name: ${node.name}`)
      });
    });

    const parts = new CritterParts(this.lizard);
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
      this.timeToNextCritterMs = 5000;
      const turtleEnt = document.createElement('a-entity');
      turtleEnt.setAttribute('position', `1 ${Math.random() * 2 + 0.2} ${this.wall.wallZ}`);
      turtleEnt.setAttribute('rotation', '90 0 0');
      const turtle = this.makeTurtle(turtleEnt, timeMs);
      console.log('Got a turtle');
      this.critters.push(turtle);
      document.querySelector('a-scene').appendChild(turtleEnt);
    }

    for (const critter of this.critters) {
      critter.setPositions(timeMs);
    }
  }
}