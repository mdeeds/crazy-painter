import * as AFRAME from "aframe";
import { CritterSource } from "./critterSource";

import { Debug } from "./debug";
import { Painter } from "./painter";
import { Wall } from "./wall";

export class PaintBrush implements Painter {
  private kPaintCapacity = 120;
  private visibleColor: string;

  // Number of squares of paint
  private supply: number;
  readonly obj: any;

  constructor(private entity: AFRAME.Entity, private color: string) {
    this.obj = entity.object3D;
    this.entity.setAttribute('color', color);
    this.visibleColor = color;
    this.dip(color)
  }

  public getSupply() {
    return this.supply;
  }
  public getColor() {
    return this.visibleColor;
  }

  public removeSupply(n: number) {
    this.supply = Math.max(0, this.supply - n);
    if (this.supply === 0 && this.visibleColor != '#444') {
      this.visibleColor = '#444';
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
  private pole: AFRAME.Entity;

  constructor(container: AFRAME.Entity, color: string,
    private leftHand, private rightHand,
    private wall: Wall, private critters: CritterSource) {
    this.leftBrush = this.makeBrush(container, color);
    this.rightBrush = this.makeBrush(container, color);
    this.leftMinusRight = new AFRAME.THREE.Vector3();
    this.pole = document.createElement('a-cylinder');
    this.pole.setAttribute('radius', '0.01');
    this.pole.setAttribute('height', '2.0');
    container.appendChild(this.pole);
  }

  getBrushes() {
    return [this.leftBrush, this.rightBrush];
  }

  private makeBrush(container: AFRAME.Entity, color: string): PaintBrush {
    const brushEntity = document.createElement('a-cylinder');
    brushEntity.setAttribute('radius', this.kBrushRadius);
    brushEntity.setAttribute('height', '0.01');
    brushEntity.setAttribute('rotation', '90 0 0');
    container.appendChild(brushEntity);
    return new PaintBrush(brushEntity, color);
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
      if (vec.z <= this.wall.wallZ) {
        this.wall.paint(this.brushPosition, this.kBrushRadius, brush);
        vec.z = this.wall.wallZ;
        for (const c of this.critters.getCritters()) {
          c.squash(this.brushPosition);
        }
      }
    }
  }

  private orientation = new AFRAME.THREE.Matrix4();
  private up = new AFRAME.THREE.Object3D().up;
  private xform = new AFRAME.THREE.Matrix4();
  private updatePole(direction: any, from: any, to: any) {
    this.xform.set(1, 0, 0, 0,
      0, 0, 1, 0,
      0, -1, 0, 0,
      0, 0, 0, 1);
    /* THREE.Object3D().up (=Y) default orientation for all objects */
    this.orientation.lookAt(from, to, this.up);
    /* rotation around axis X by -90 degrees 
     * matches the default orientation Y 
     * with the orientation of looking Z */
    this.orientation.multiply(this.xform);
    this.pole.object3D.rotation.set(0, 0, 0);
    this.pole.object3D.applyMatrix4(this.orientation);
    this.pole.object3D.position.copy(to);
    this.leftMinusRight.multiplyScalar(0.5);
    this.pole.object3D.position.add(this.leftMinusRight);
    this.leftMinusRight.multiplyScalar(2.0);
    // edge.position = new THREE.Vector3().addVectors(pointX, direction.multiplyScalar(0.5));
  }

  tick(timeMs: number, timeDeltaMs: number) {
    this.leftMinusRight.copy(this.leftHand.position);
    this.leftMinusRight.sub(this.rightHand.position);

    const xRad = Math.atan2(this.leftMinusRight.y, this.leftMinusRight.z);
    const yRad = Math.atan2(this.leftMinusRight.z, this.leftMinusRight.x);

    const distance = this.leftMinusRight.length();
    if (distance > 0) {
      this.updatePole(this.leftMinusRight, this.leftHand.position, this.rightHand.position);
      // this.pole.object3D.rotation.set(xRad, yRad, 0);
    }
    this.leftMinusRight.normalize().multiplyScalar(Math.max(distance, 0.4));
    // this.leftMinusRight.normalize().multiplyScalar(0.4);
    this.leftBrush.obj.position.copy(this.leftHand.position);
    this.leftBrush.obj.position.add(this.leftMinusRight);
    this.rightBrush.obj.position.copy(this.rightHand.position);
    this.rightBrush.obj.position.sub(this.leftMinusRight);
    this.clamp(this.leftBrush);
    this.clamp(this.rightBrush);
  }
}