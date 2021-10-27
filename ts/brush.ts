import * as AFRAME from "aframe";
import { Debug } from "./debug";
import { Wall } from "./wall";

export class Brush {
  private leftBrush: any;
  private rightBrush: any;
  private leftMinusRight: any;
  private readonly kBrushRadius = 0.1;

  constructor(container: AFRAME.Entity, private leftHand, private rightHand,
    private wall: Wall) {
    this.leftBrush = this.makeBrush(container);
    this.rightBrush = this.makeBrush(container);
    this.leftMinusRight = new AFRAME.THREE.Vector3();
  }

  private makeBrush(container: AFRAME.Entity) {
    const brushEntity = document.createElement('a-sphere');
    brushEntity.setAttribute('radius', this.kBrushRadius);
    container.appendChild(brushEntity);
    return brushEntity.object3D;
  }

  private brushPosition = new AFRAME.THREE.Vector3();
  private clamp(obj: any) {
    const vec = obj.position;
    if (vec.y < 0) {
      vec.y = 0;
    }
    if (vec.z - this.kBrushRadius < this.wall.wallZ) {
      obj.getWorldPosition(this.brushPosition);
      if (vec.z < this.wall.wallZ) {
        this.wall.paint(this.brushPosition, this.kBrushRadius);
        vec.z = this.wall.wallZ;
      } else {
        const d = this.kBrushRadius - (vec.z - this.wall.wallZ);
        Debug.set(`Partial: ${d.toFixed(3)}`);
        // c^2 + d^2 = r^2
        // c = sqrt(r^2 - d^2)
        const c = Math.sqrt(this.kBrushRadius * this.kBrushRadius - d * d);
        if (c > 0) {
          this.wall.paint(this.brushPosition, c);
        }

      }
    }

  }

  tick(timeMs: number, timeDeltaMs: number) {
    this.leftMinusRight.copy(this.leftHand.position);
    this.leftMinusRight.sub(this.rightHand.position);
    this.leftMinusRight.normalize().multiplyScalar(0.4);
    this.leftBrush.position.copy(this.leftHand.position);
    this.leftBrush.position.add(this.leftMinusRight);
    this.rightBrush.position.copy(this.rightHand.position);
    this.rightBrush.position.sub(this.leftMinusRight);
    this.clamp(this.leftBrush);
    this.clamp(this.rightBrush);
  }
}