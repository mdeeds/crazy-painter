import * as AFRAME from "aframe";

import { AssetLibrary } from "./assetLibrary";
import { Debug } from "./debug";
import { Painter } from "./painter";
import { Wall } from "./wall";

export class Foot implements Painter {
  private initialPosition: any;
  private color = null;
  constructor(private footObject3D: any, private wall: Wall,
    private assetLibrary: AssetLibrary) {
    this.initialPosition = new AFRAME.THREE.Vector3();
    this.initialPosition.copy(footObject3D.position);
  }

  getSupply() { return this.color != null ? 1 : 0; }
  removeSupply(n: number) { }
  getColor() { return this.color }

  private worldPosition = new AFRAME.THREE.Vector3();
  tick(timeMs: number, timeDeltaMs: number) {
    this.footObject3D.getWorldPosition(this.worldPosition);
    const wallColor = this.wall.getColor(this.worldPosition);
    if (wallColor === null && this.color !== null) {
      this.wall.paint(this.worldPosition,
        this.wall.kMetersPerBlock * 1.4, this)
    } else if (wallColor !== null && this.color != wallColor) {
      this.color = wallColor;
      // this.footObject3D.material = this.assetLibrary.getNeonTexture(this.color);
    }
  }
}
