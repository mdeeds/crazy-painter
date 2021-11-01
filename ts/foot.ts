import * as AFRAME from "aframe";
import { Debug } from "./debug";
import { Painter } from "./painter";

import { Pod } from "./pod";
import { Wall } from "./wall";

export class Foot implements Painter {
  private initialPosition: any;
  private static kLift = 0.02;
  constructor(private pod: Pod, private foot: any, private wall: Wall) {
    this.initialPosition = new AFRAME.THREE.Vector3();
    this.initialPosition.copy(foot.position);
    console.log(foot.position);
  }

  getSupply() { return 1; }
  removeSupply(n: number) { }

  private worldPosition = new AFRAME.THREE.Vector3();
  setPosition(p: number, gaitM: number) {
    const [x, dx] = this.pod.getXdX(p);
    this.foot.position.copy(this.initialPosition);
    this.foot.position.x += x * gaitM;
    if (dx < 0) {
      this.foot.position.y += Foot.kLift;
      this.foot.getWorldPosition(this.worldPosition);
      this.wall.paint(this.worldPosition, 0.05, this)
    }
  }
}
