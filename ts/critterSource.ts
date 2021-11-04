import * as AFRAME from "aframe";
import { resolve } from "path";
import { AnimatedObject } from "./animatedObject";
import { AssetLibrary } from "./assetLibrary";

import { Critter, CritterParts } from "./critter";
import { Debug } from "./debug";
import { EphemeralText } from "./ephemeralText";
import { Score } from "./score";
import { Wall } from "./wall";

export class CritterSource {
  private timeToNextCritterMs = 1000;
  private critters: Critter[] = [];

  private lizards: AnimatedObject[] = [];

  constructor(private wall: Wall, private assetLibrary: AssetLibrary,
    private score: Score, private eText: EphemeralText) {
  }

  public getCritters(): Critter[] {
    return this.critters;
  }

  private async makeTurtle(container: AFRAME.Entity, spawnTime: number): Promise<Critter> {
    const lizard = await AnimatedObject.make(
      'obj/lizard.gltf', this.assetLibrary, container);
    this.lizards.push(lizard);
    lizard.play();

    const parts = new CritterParts(lizard);

    const obj = lizard.entity.getObject3D('mesh');
    obj.traverse(node => {
      const m = (/foo[tr]-([\d+])/i).exec(node.name);
      if (m && m.length > 0) {
        const i = parseInt(m[1]);
        parts.feet[i] = node;
      }
    });
    const critter = new Critter(
      container, parts, this.wall,
      spawnTime, this.score, this.eText, this.assetLibrary);
    return critter;
  }

  async tick(timeMs: number, timeDeltaMs: number) {
    this.timeToNextCritterMs -= timeDeltaMs;
    if (this.timeToNextCritterMs <= 0) {
      this.timeToNextCritterMs = 15000;
      const turtleEnt = document.createElement('a-entity');
      turtleEnt.setAttribute('position',
        `0` +
        ` ${(Math.random() - 0.5) * this.wall.kWallHeightMeters + this.wall.wallY}` +
        ` ${this.wall.wallZ}`);
      turtleEnt.setAttribute('rotation', '90 0 0');
      // TODO: We need to clean these up.
      document.querySelector('a-scene').appendChild(turtleEnt);
      const turtle = await this.makeTurtle(
        turtleEnt, timeMs);
      this.critters.push(turtle);
    }

    for (const critter of this.critters) {
      critter.tick(timeMs, timeDeltaMs);
    }
    for (const lizard of this.lizards) {
      lizard.tick(timeMs, timeDeltaMs);
    }
    for (let i = 0; i < this.critters.length; ++i) {
      if (this.critters[i].isDone()) {
        this.critters[i].remove();
        this.critters.splice(i, 1);
      }
    }
  }
}