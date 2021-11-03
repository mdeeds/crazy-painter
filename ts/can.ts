import * as AFRAME from "aframe";
import { AssetLibrary } from "./assetLibrary";
import { PaintBrush } from "./brush";

export class Can {
  private canPosition: any;
  constructor(private container: AFRAME.Entity,
    private brushes: PaintBrush[], private assetLibrary: AssetLibrary) {

    container.appendChild(this.buildMaterialCan());

    this.canPosition = new AFRAME.THREE.Vector3();
  }

  private buildMaterialCan(): AFRAME.Entity {
    const model = document.createElement('a-entity');
    model.setAttribute('gltf-model',
      `#${this.assetLibrary.getId('obj/bucket.gltf')}`);
    model.setAttribute('scale', '0.1 0.1 0.1');
    model.setAttribute('position', '0 0.125 0');

    model.addEventListener('model-loaded', () => {
      // Grab the mesh / scene.
      const obj = model.getObject3D('mesh');
      // Go over the submeshes and modify materials we want.
      obj.traverse(node => {
        if (node.material && node.material.color) {
          node.material.color.set('#840');
          if (node.material.name === 'Neon') {
            node.material = this.assetLibrary.getNeonTexture('#f80');
          }
        }
      });
    });
    return model;
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