import * as AFRAME from "aframe";

import { Foot } from "./foot";

export class Feet {
  private feet: Foot[] = [];
  // `gaitM` : Distance traveled in one cycle of the gait.
  // `gaitMS` : Duration of the gait in milliseconds
  constructor(private gaitM: number, private gaitMS: number,
    private container: AFRAME.Entity, private body: AFRAME.Entity) { }
  add(foot: Foot) {
    this.feet.push(foot);
  }
  setPositions(timeMs: number) {
    const p = (timeMs / this.gaitMS) % 1; // percentage of 800ms
    for (const foot of this.feet) {
      foot.setPosition(p, this.gaitM);
    }
    const seconds = ((timeMs % 3000) - 1500) / 1000;
    const mps = this.gaitM / (this.gaitMS / 1000);
    this.container.object3D.position.x = -mps * seconds;
  }
}
