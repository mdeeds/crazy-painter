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
    model.setAttribute('obj-model',
      `obj:#${this.assetLibrary.getId('obj/bucket.obj')};` +
      `mtl:#${this.assetLibrary.getId('obj/bucket.mtl')}`);
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
            node.material = new AFRAME.THREE.MeshBasicMaterial({ color: '#f80' });
            // node.material.emissive.set('orange');
            // This will cause it to crash :-/
            // node.material.type = 'MeshBasicMaterial';
          }
        }
      });
    });

    return model;
  }

  private buildTwoToneCan(): AFRAME.Entity {
    const model = document.createElement('a-entity');
    const dark = document.createElement('a-entity');
    dark.setAttribute('obj-model', `obj: obj/bucket-dark.obj`);
    dark.setAttribute('material', 'color: orange; side: double');
    dark.setAttribute('scale', '0.1 0.1 0.1');
    model.appendChild(dark);

    const neon = document.createElement('a-entity');
    neon.setAttribute('obj-model', `obj: obj/bucket-neon.obj`);
    neon.setAttribute('scale', '0.1 0.1 0.1');
    neon.setAttribute('material', 'color: orange; shader: flat; side: double');
    model.appendChild(neon);

    // model.setAttribute('height', '0.25');
    // model.setAttribute('radius', '0.10');
    model.setAttribute('position', '0 0.125 0');
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