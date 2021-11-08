import * as AFRAME from "aframe";
import { resolve } from "path";
import { AnimatedObject } from "./animatedObject";
import { AssetLibrary } from "./assetLibrary";

import { Critter, CritterParts } from "./critter";
import { Debug } from "./debug";
import { EphemeralText } from "./ephemeralText";
import { Score } from "./score";
import { Wall, WallHandle } from "./wall";

export class CritterSource {
  private timeToNextCritterMs = 1000;
  private critters: Critter[] = [];

  private lizards: AnimatedObject[] = [];

  private showLizards = true;

  constructor(private wallHandle: WallHandle, private assetLibrary: AssetLibrary,
    private score: Score, private eText: EphemeralText) {
    const url = new URL(document.URL);
    const numLizards = url.searchParams.get('lizards');
    if (numLizards === '0') {
      this.showLizards = false;
    }
  }

  public getCritters(): Critter[] {
    return this.critters;
  }

  private async makeLizard(container: AFRAME.Entity, spawnTime: number): Promise<Critter> {
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
      container, parts, this.wallHandle,
      spawnTime, this.score, this.eText, this.assetLibrary);
    return critter;
  }

  async tick(timeMs: number, timeDeltaMs: number) {
    if (!this.showLizards) {
      return;
    }
    this.timeToNextCritterMs -= timeDeltaMs;
    if (this.timeToNextCritterMs <= 0) {
      this.timeToNextCritterMs = 3000;
      const turtleEnt = document.createElement('a-entity');
      turtleEnt.setAttribute('position',
        `0 ${this.wallHandle.wall.wallY} ${this.wallHandle.wall.wallZ}`);
      turtleEnt.setAttribute('rotation', '90 0 0');
      document.querySelector('a-scene').appendChild(turtleEnt);
      const turtle = await this.makeLizard(
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