import * as AFRAME from "aframe";
import { AssetLibrary } from "./assetLibrary";
import { Debug } from "./debug";
import { Painter } from "./painter";

import { Pod } from "./pod";
import { Wall } from "./wall";

export class Foot implements Painter {
  private initialPosition: any;
  private static kLift = 0.02;
  private color = null;
  constructor(private pod: Pod, private foot: any, private wall: Wall,
    private assetLibrary: AssetLibrary) {
    this.initialPosition = new AFRAME.THREE.Vector3();
    this.initialPosition.copy(foot.position);
  }

  getSupply() { return this.color != null ? 1 : 0; }
  removeSupply(n: number) { }

  private worldPosition = new AFRAME.THREE.Vector3();
  setPosition(p: number, gaitM: number) {
    const [x, dx] = this.pod.getXdX(p);
    this.foot.position.copy(this.initialPosition);
    this.foot.position.x += x * gaitM;
    if (dx < 0) {
      this.foot.position.y += Foot.kLift;
      this.foot.getWorldPosition(this.worldPosition);

      const wallColor = this.wall.getColor(this.worldPosition);
      if (wallColor === null && this.color !== null) {
        this.wall.paint(this.worldPosition, 0.05, this)
      } else if (wallColor !== null && this.color != wallColor) {
        this.color = wallColor;
        this.foot.material = this.assetLibrary.getNeonTexture(this.color);
      }
    }
  }
}
