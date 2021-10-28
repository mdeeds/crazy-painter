import * as AFRAME from "aframe";
import { Debug } from "./debug";
import { Wall } from "./wall";

export class PaintBrush {
  private kPaintCapacity = 120;
  private color: string;
  private visibleColor: string;

  // Number of squares of paint
  private supply: number;
  readonly obj: any;

  constructor(private entity: AFRAME.Entity) {
    this.obj = entity.object3D;
    this.entity.setAttribute('color', '#f80');
    this.visibleColor = '#f80';
    this.dip('#f80')
  }

  public getSupply() {
    return this.supply;
  }

  public removeSupply(n: number) {
    this.supply = Math.max(0, this.supply - n);
    if (this.supply === 0 && this.visibleColor != '#333') {
      this.visibleColor = '#333';
      this.entity.setAttribute('color', this.visibleColor)
    }
  }

  public dip(color: string) {
    this.color = color;
    if (this.visibleColor != color) {
      this.visibleColor = color;
      this.entity.setAttribute('color', this.visibleColor)
    }
    this.supply = this.kPaintCapacity;
  }
}

export class Brush {
  private leftBrush: PaintBrush;
  private rightBrush: PaintBrush;
  private leftMinusRight: any;
  private readonly kBrushRadius = 0.1;

  constructor(container: AFRAME.Entity, private leftHand, private rightHand,
    private wall: Wall) {
    this.leftBrush = this.makeBrush(container);
    this.rightBrush = this.makeBrush(container);
    this.leftMinusRight = new AFRAME.THREE.Vector3();
  }

  getBrushes() {
    return [this.leftBrush, this.rightBrush];
  }

  private makeBrush(container: AFRAME.Entity): PaintBrush {
    const brushEntity = document.createElement('a-sphere');
    brushEntity.setAttribute('radius', this.kBrushRadius);
    container.appendChild(brushEntity);
    return new PaintBrush(brushEntity);
  }

  private brushPosition = new AFRAME.THREE.Vector3();
  private clamp(brush: PaintBrush) {
    const obj = brush.obj;
    const vec = obj.position;
    if (vec.y < 0) {
      vec.y = 0;
    }
    if (vec.z - this.kBrushRadius < this.wall.wallZ) {
      obj.getWorldPosition(this.brushPosition);
      if (vec.z < this.wall.wallZ) {
        this.wall.paint(this.brushPosition, this.kBrushRadius, brush);
        vec.z = this.wall.wallZ;
      } else {
        const d = this.kBrushRadius - (vec.z - this.wall.wallZ);
        // c^2 + d^2 = r^2
        // c = sqrt(r^2 - d^2)
        const c = Math.sqrt(this.kBrushRadius * this.kBrushRadius - d * d);
        // Debug.set(`Radius: ${c.toFixed(3)}`);
        if (c > 0) {
          this.wall.paint(this.brushPosition, c, brush);
        }

      }
    }
  }

  tick(timeMs: number, timeDeltaMs: number) {
    this.leftMinusRight.copy(this.leftHand.position);
    this.leftMinusRight.sub(this.rightHand.position);
    this.leftMinusRight.normalize().multiplyScalar(0.4);
    this.leftBrush.obj.position.copy(this.leftHand.position);
    this.leftBrush.obj.position.add(this.leftMinusRight);
    this.rightBrush.obj.position.copy(this.rightHand.position);
    this.rightBrush.obj.position.sub(this.leftMinusRight);
    this.clamp(this.leftBrush);
    this.clamp(this.rightBrush);
  }
}