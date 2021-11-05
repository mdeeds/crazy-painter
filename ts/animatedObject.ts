import * as AFRAME from "aframe";
import { AssetLibrary } from "./assetLibrary";

export class AnimatedObject implements Ticker {
  readonly entity: AFRAME.Entity;
  private mixer: any;
  private clips: any[] = [];
  private needsToStart = false;
  private constructor(url: string, assetLibrary: AssetLibrary,
    callback: (a: AnimatedObject) => void, container: AFRAME.Entity) {
    this.entity = document.createElement('a-entity');
    this.entity.setAttribute('gltf-model',
      `#${assetLibrary.getId(url)}`);

    this.entity.addEventListener('model-loaded', () => {
      // Grab the mesh / scene.
      const obj = this.entity.getObject3D('mesh');
      // Go over the submeshes and modify materials we want.
      console.log(`Loaded: ${url}`);
      obj.traverse(node => {
        if (node.name) {
          console.log(` ${node.name}`);
        }
      });
      if (obj.animations) {
        this.mixer = new AFRAME.THREE.AnimationMixer(obj);
        this.clips = obj.animations;
      }
      callback(this);
    });

    container.appendChild(this.entity);
  }

  public static async make(url: string,
    assetLibrary: AssetLibrary, container: AFRAME.Entity):
    Promise<AnimatedObject> {
    return new Promise<AnimatedObject>((resolve, reject) => {
      new AnimatedObject(url, assetLibrary, resolve, container);
    })
  }

  play() {
    if (this.clips) {
      for (const clip of this.clips) {
        this.mixer.clipAction(clip).play();
      }
    } else {
      this.needsToStart = true;
    }
  }

  stop() {
    for (const clip of this.clips) {
      this.mixer.clipAction(clip).stop();
    }
  }

  tick(timeMs: number, timeDeltaMs: number) {
    if (this.needsToStart) {
      this.play();
    }
    if (this.mixer) {
      this.mixer.update(timeDeltaMs / 1000);
    }
  }
}