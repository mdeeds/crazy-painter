import * as AFRAME from "aframe";

import { Foot } from "./foot";

export class Feet {
  private feet: Foot[] = [];

  private done = false;

  // `gaitM` : Distance traveled in one cycle of the gait.
  // `gaitMS` : Duration of the gait in milliseconds
  constructor(private gaitM: number, private gaitMS: number,
    private container: AFRAME.Entity, private body: AFRAME.Entity) { }
  add(foot: Foot) {
    this.feet.push(foot);
  }

  isDone() { return this.done; }

  setPositions(timeMs: number) {
    const p = (timeMs / this.gaitMS) % 1; // percentage of 800ms
    for (const foot of this.feet) {
      foot.setPosition(p, this.gaitM);
    }
    const seconds = timeMs / 1000;
    const mps = this.gaitM / (this.gaitMS / 1000);
    const newX = 1.5 - mps * seconds;
    this.container.object3D.position.x = newX;
    if (newX < -1.5) {
      this.done = true;
    }
  }
}
