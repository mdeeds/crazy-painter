import * as AFRAME from "aframe";

export class Brush {
  private leftBrush: any;
  private rightBrush: any;
  private leftMinusRight: any;

  constructor(container: AFRAME.Entity, private leftHand, private rightHand) {
    this.leftBrush = this.makeBrush(container);
    this.rightBrush = this.makeBrush(container);
    this.leftMinusRight = new AFRAME.THREE.Vector3();
  }

  private makeBrush(container: AFRAME.Entity) {
    const brushEntity = document.createElement('a-sphere');
    brushEntity.setAttribute('radius', '0.2');
    container.appendChild(brushEntity);
    return brushEntity.object3D;
  }

  private clamp(vec: any) {
    if (vec.y < 0) {
      vec.y = 0;
    }
    if (vec.z < -2) {
      // TODO: Get this from the wall, also handle collision and painting.
      vec.z = -2;
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
    this.clamp(this.leftBrush.position);
    this.clamp(this.rightBrush.position);
  }
}