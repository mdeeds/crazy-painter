import * as AFRAME from "aframe";
import { Wall } from "./wall";

export class Brush {
  private leftBrush: any;
  private rightBrush: any;
  private leftMinusRight: any;
  private readonly kBrushRadius = 0.2;

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
    if (vec.z < this.wall.wallZ) {
      vec.z = this.wall.wallZ;
      obj.getWorldPosition(this.brushPosition);
      // TODO: Handle light touch.
      this.wall.paint(this.brushPosition, this.kBrushRadius);
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