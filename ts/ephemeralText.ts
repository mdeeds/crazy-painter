import * as AFRAME from "aframe";
import { Debug } from "./debug";

class TextBlurb {
  private remainingTimeMs = 1000;
  private entity: AFRAME.Entity;
  private done: boolean = false;
  constructor(container: AFRAME.Entity, message: string,
    x: number, y: number, z: number) {
    this.entity = document.createElement('a-entity');
    this.entity.setAttribute('text',
      `value: ${message}; align: center; wrap-count: 8; width: 0.2`);
    this.entity.object3D.position.set(x, y, z);
    container.appendChild(this.entity);
  }

  dispose() {
    this.entity.remove();
    this.remainingTimeMs = 0;
    this.done = true;
  }

  isDone() {
    return this.done;
  }

  tick(timeMs: number, timeDeltaMs: number) {
    this.remainingTimeMs -= timeDeltaMs;
    if (this.remainingTimeMs <= 0) {
      this.dispose();
    } else {
      this.entity.object3D.position.y += timeDeltaMs / 3000;
    }
  }
}

export class EphemeralText {
  private textItems: TextBlurb[] = [];
  private kCapacity: number = 12;
  private nextSlot = 0;
  constructor(private scene: AFRAME.Entity) { }

  addText(message: string, x: number, y: number, z: number) {
    if (this.textItems[this.nextSlot]) {
      this.textItems[this.nextSlot].dispose();
    }
    const item = new TextBlurb(this.scene, message, x, y, z);
    this.textItems[this.nextSlot] = item;
    this.nextSlot = (this.nextSlot + 1) % this.kCapacity;
  }

  tick(timeMs: number, timeDeltaMs: number) {
    for (let i = 0; i < this.kCapacity; ++i) {
      if (this.textItems[i]) {
        if (this.textItems[i].isDone()) {
          this.textItems[i] = null;
        } else {
          this.textItems[i].tick(timeMs, timeDeltaMs);
        }
      }
    }
  }
}