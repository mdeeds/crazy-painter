import * as AFRAME from "aframe";
import { AssetLibrary } from "./assetLibrary";
import { PaintBrush } from "./brush";

export class Can implements Ticker {
  private canPosition: any;
  constructor(private container: AFRAME.Entity,
    private color: string,
    private brushes: PaintBrush[], private assetLibrary: AssetLibrary) {

    container.appendChild(this.buildMaterialCan());

    this.canPosition = new AFRAME.THREE.Vector3();
  }

  private parseColor(color: string): number[] {
    const m = color.match(/^#([0-9a-f]{3})$/i)[1];
    if (m) {
      // in three-character format, each value is multiplied by 0x11 to give an
      // even scale from 0x00 to 0xff
      return [
        parseInt(m.charAt(0), 16) * 0x11,
        parseInt(m.charAt(1), 16) * 0x11,
        parseInt(m.charAt(2), 16) * 0x11
      ];
    } else {
      throw new Error(`Failed: ${color}; color must be #abc format.`);
    }
  }

  private makeColor(rgb: number[]): string {
    const rc = Math.round(rgb[0] / 0x11).toString(16);
    const gc = Math.round(rgb[1] / 0x11).toString(16);
    const bc = Math.round(rgb[2] / 0x11).toString(16);
    return `#${rc}${gc}${bc}`
  }

  private buildMaterialCan(): AFRAME.Entity {
    const model = document.createElement('a-entity');
    model.setAttribute('gltf-model',
      `#${this.assetLibrary.getId('obj/bucket.gltf')}`);
    model.setAttribute('scale', '0.1 0.1 0.1');
    model.setAttribute('position', '0 0.125 0');

    const neonRGB = this.parseColor(this.color);
    const fadedRGB = [neonRGB[0] / 2, neonRGB[1] / 2, neonRGB[2] / 2];
    const fadedColor = this.makeColor(fadedRGB);

    model.addEventListener('model-loaded', () => {
      // Grab the mesh / scene.
      const obj = model.getObject3D('mesh');
      // Go over the submeshes and modify materials we want.
      obj.traverse(node => {
        if (node.material && node.material.color) {
          node.material.color.set(fadedColor);
          if (node.material.name === 'Neon') {
            node.material = this.assetLibrary.getNeonTexture(this.color);
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
        brush.dip(this.color);
      }
    }
  }
}