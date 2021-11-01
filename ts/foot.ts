import * as AFRAME from "aframe";
import { Debug } from "./debug";

import { Pod } from "./pod";

export class Foot {
  private initialPosition: any;
  private static kLift = 0.02;
  constructor(private pod: Pod, private foot: any) {  // THREE.Object3D
    this.initialPosition = new AFRAME.THREE.Vector3();
    this.initialPosition.copy(foot.position);
    console.log(foot.position);
  }

  setPosition(p: number, gaitM: number) {
    const [x, dx] = this.pod.getXdX(p);
    this.foot.position.copy(this.initialPosition);
    this.foot.position.x += x * gaitM;
    if (dx < 0) {
      this.foot.position.y += Foot.kLift;
    }
  }
}
