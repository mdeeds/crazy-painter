import * as AFRAME from "aframe";

import { Pod } from "./pod";

export class Foot {
  private initialPosition: any;
  private static kLift = 0.02;
  constructor(private pod: Pod, private foot: AFRAME.Entity) {
    this.initialPosition = new AFRAME.THREE.Vector3();
    this.initialPosition.copy(foot.object3D.position);
  }

  setPosition(p: number, gaitM: number) {
    const [x, dx] = this.pod.getXdX(p);
    this.foot.object3D.position.copy(this.initialPosition);
    this.foot.object3D.position.x += x * gaitM;
    if (dx < 0) {
      this.foot.object3D.position.y += Foot.kLift;
    }
  }
}
