import * as AFRAME from "aframe";
import { PaintBrush } from "./brush";

export class Can {
  private canPosition: any;
  constructor(private container: AFRAME.Entity,
    private brushes: PaintBrush[]) {
    const model = document.createElement('a-cylinder');
    model.setAttribute('color', 'orange');
    model.setAttribute('height', '0.25');
    model.setAttribute('radius', '0.10');
    model.setAttribute('position', '0 0.125 0');
    container.appendChild(model);
    this.canPosition = new AFRAME.THREE.Vector3();
  }

  tick(timeMs: number, timeDeltaMs: number) {
    for (const brush of this.brushes) {
      this.canPosition.copy(this.container.object3D.position);
      this.canPosition.sub(brush.obj.position);
      const d = this.canPosition.length();
      if (d < 0.2) {
        brush.dip('orange');
      }
    }
  }


}