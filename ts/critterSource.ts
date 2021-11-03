import * as AFRAME from "aframe";
import { resolve } from "path";
import { AssetLibrary } from "./assetLibrary";

import { Critter, CritterParts } from "./critter";
import { Debug } from "./debug";
import { EphemeralText } from "./ephemeralText";
import { Score } from "./score";
import { Wall } from "./wall";

export class CritterSource {
  private timeToNextCritterMs = 1000;
  private critters: Critter[] = [];

  private lizard = null;

  constructor(private wall: Wall, private assetLibrary: AssetLibrary,
    private score: Score, private eText: EphemeralText) {
  }

  public getCritters(): Critter[] {
    return this.critters;
  }

  private extractObject(obj: any, container: AFRAME.Entity) {
    // const ent = document.createElement('a-entity');
    obj.material = this.assetLibrary.getMetalTexture('#0f0');
    // obj.parent.remove(obj);
    // ent.object3D = obj;
    // container.appendChild(ent);
  }

  private async makeTurtle(container: AFRAME.Entity, spawnTime: number, scene: AFRAME.Entity): Promise<Critter> {
    this.lizard = document.createElement('a-entity');
    this.lizard.setAttribute('gltf-model',
      `#${this.assetLibrary.getId('obj/lizard.gltf')}`);
    container.appendChild(this.lizard);
    const parts = new CritterParts(this.lizard);

    return new Promise<Critter>((resolve, reject) => {
      this.lizard.addEventListener('model-loaded', () => {
        const obj = this.lizard.getObject3D('mesh');
        obj.traverse(node => {
          const m = (/foo[tr]-([\d+])/i).exec(node.name);
          if (m && m.length > 0) {
            const i = parseInt(m[1]);
            this.extractObject(node, this.lizard);
            parts.feet[i] = node;
          }
        });
        const critter = new Critter(
          Critter.walkingGait, container, parts, this.wall,
          spawnTime, this.score, this.eText, this.assetLibrary);
        resolve(critter);
      });
      scene.appendChild(container);
    })
  }

  async tick(timeMs: number, timeDeltaMs: number) {
    this.timeToNextCritterMs -= timeDeltaMs;
    if (this.timeToNextCritterMs <= 0) {
      this.timeToNextCritterMs = 5000;
      const turtleEnt = document.createElement('a-entity');
      turtleEnt.setAttribute('position',
        `0` +
        ` ${(Math.random() - 0.5) * this.wall.kWallHeightMeters + this.wall.wallY}` +
        ` ${this.wall.wallZ}`);
      turtleEnt.setAttribute('rotation', '90 0 0');
      const turtle = await this.makeTurtle(
        turtleEnt, timeMs, document.querySelector('a-scene'));
      this.critters.push(turtle);
    }

    for (const critter of this.critters) {
      critter.setPositions(timeMs);
    }
    for (let i = 0; i < this.critters.length; ++i) {
      if (this.critters[i].isDone()) {
        this.critters[i].remove();
        this.critters.splice(i, 1);
      }
    }
  }
}