import * as AFRAME from "aframe";
import { AnimatedObject } from "./animatedObject";
import { AssetLibrary } from "./assetLibrary";
import { Debug } from "./debug";
import { EphemeralText } from "./ephemeralText";
import { Foot } from "./foot";
import { Score } from "./score";
import { Wall } from "./wall";

export class CritterParts {
  readonly feet: any[] = [];  // THREE.Object3D
  constructor(readonly body: AnimatedObject) { }  // THREE.Object3D
}

export class Critter implements Ticker {
  private feet: Foot[] = [];
  private done = false;
  private targetPosition = new AFRAME.THREE.Vector3();
  private speedMps = 2;
  private timeToNextSprintMs = 0;
  constructor(
    private container: AFRAME.Entity, private parts: CritterParts,
    private wall: Wall, private spawnTimeMs: number, private score: Score,
    private eText: EphemeralText, private assetLibrary: AssetLibrary) {
    for (const [i, f] of parts.feet.entries()) {
      this.feet.push(new Foot(f, this.wall, this.assetLibrary));
    }
    this.targetPosition.set(Math.random() * 2 - 1, 0, 1);
    this.parts.body.entity.object3D.position.copy(this.targetPosition);
    // container.appendChild(parts.body.entity);
    // body.object3D.position.z = wall.wallZ;
    this.setNewTarget();
  }

  isDone() { return this.done; }

  remove() { this.container.remove(); }

  private setNewTarget() {
    const newZ = this.targetPosition.z - Math.random();
    this.targetPosition.set(Math.random() * 2 - 1, 0, newZ);
    const currentPos = this.parts.body.entity.object3D.position;
    const dz = this.targetPosition.z - currentPos.z;
    const dx = this.targetPosition.x - currentPos.x;

    this.parts.body.entity.object3D.rotation.y = Math.atan2(dz, -dx);
  }

  private worldPosition = new AFRAME.THREE.Vector3();
  squash(worldPosition: any) {
    this.parts.body.entity.object3D.getWorldPosition(this.worldPosition);
    if (worldPosition.distanceTo(this.worldPosition) < 0.2) {

      this.score.add(500);
      this.eText.addText("+500", this.worldPosition.x, this.worldPosition.y, this.worldPosition.z)
      this.done = true;
    }
  }

  private direction = new AFRAME.THREE.Vector3();
  tick(timeMs: number, timeDeltaMs: number) {
    if (this.timeToNextSprintMs > 0) {
      this.timeToNextSprintMs -= timeDeltaMs;
      if (this.timeToNextSprintMs <= 0) {
        this.setNewTarget();
        this.speedMps = 2;
      }
    } else {
      this.direction.copy(this.targetPosition);
      const currentPos = this.parts.body.entity.object3D.position;
      this.direction.sub(currentPos);
      const remainingDistance = this.direction.length();
      let stepSize = this.speedMps * timeDeltaMs / 1000;
      if (stepSize >= remainingDistance) {
        stepSize = remainingDistance;
        this.speedMps = 0;
        this.timeToNextSprintMs = Math.random() * 500 + 500;
      }
      this.direction.setLength(stepSize);
      currentPos.add(this.direction);
      if (currentPos.z < -2.0) {
        this.done = true;
      }

      const animationMps = (0.35 - 0.15) / (30 / 24);

      for (const f of this.feet) {
        f.tick(timeMs, timeDeltaMs);
      }
    }
  }
};