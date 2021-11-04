import * as AFRAME from "aframe";
import { AnimatedObject } from "./animatedObject";
import { AssetLibrary } from "./assetLibrary";
import { Debug } from "./debug";
import { EphemeralText } from "./ephemeralText";
import { Feet } from "./feet";
import { Foot } from "./foot";
import { Score } from "./score";
import { Wall } from "./wall";

export class CritterParts {
  readonly feet: any[] = [];  // THREE.Object3D
  constructor(readonly body: AnimatedObject) { }  // THREE.Object3D
}

export class Critter {
  private feet: Foot[] = [];
  private done = false;
  constructor(
    private container: AFRAME.Entity, private parts: CritterParts,
    private wall: Wall, private spawnTimeMs: number, private score: Score,
    private eText: EphemeralText, private assetLibrary: AssetLibrary) {
    for (const [i, f] of parts.feet.entries()) {
      this.feet.push(new Foot(f, this.wall, this.assetLibrary));
    }
    // container.appendChild(parts.body.entity);
    // body.object3D.position.z = wall.wallZ;
  }

  isDone() { return this.done; }

  remove() { this.container.remove(); }

  private worldPosition = new AFRAME.THREE.Vector3();
  squash(worldPosition: any) {
    this.container.object3D.getWorldPosition(this.worldPosition);
    if (worldPosition.distanceTo(this.worldPosition) < 0.2) {

      this.score.add(500);
      this.eText.addText("+500", this.worldPosition.x, this.worldPosition.y, this.worldPosition.z)
      this.done = true;
    }
  }

  tick(timeMs: number, timeDeltaMs: number) {
    // TODO: calculate x-position based on spawnTimeMs.
    const secondsElapsed = (timeMs - this.spawnTimeMs) / 1000;
    const mps = (0.35 - 0.15) / (30 / 24);
    const x = 0.5 + this.wall.kWallWidthMeters / 2 - mps * secondsElapsed;

    if (x < -this.wall.kWallWidthMeters / 2 - 0.5) {
      this.done = true;
    }
    this.parts.body.entity.object3D.position.x = x;
    for (const f of this.feet) {
      f.tick(timeMs, timeDeltaMs);
    }
  }
};