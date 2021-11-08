import * as AFRAME from "aframe";

import { AssetLibrary } from "./assetLibrary";
import { Debug } from "./debug";
import { Painter } from "./painter";
import { Wall, WallHandle } from "./wall";

export class Foot implements Painter {
  private color = null;
  constructor(private footObject3D: any, private wallHandle: WallHandle,
    private assetLibrary: AssetLibrary) {
    this.previousWorldPosition.copy(footObject3D.position);

  }

  getSupply() { return this.color != null ? 1e6 : 0; }
  removeSupply(n: number) { }
  getColor() { return this.color }

  private previousWorldPosition = new AFRAME.THREE.Vector3();
  private worldPosition = new AFRAME.THREE.Vector3();

  tick(timeMs: number, timeDeltaMs: number) {
    this.footObject3D.getWorldPosition(this.worldPosition);
    if (this.color === null) {
      this.color = this.wallHandle.wall.pickUpLine(
        this.previousWorldPosition, this.worldPosition);
      if (this.color !== null) {
        // Debug.set('got', this.color);
      }
    } else {
      this.wallHandle.wall.paintLine(
        this.previousWorldPosition, this.worldPosition, this);
    }
    this.previousWorldPosition.copy(this.worldPosition);
  }
}
