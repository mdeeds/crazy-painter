import * as AFRAME from "aframe";
import { Debug } from "./debug";

class TextBlurb {
  private remainingTimeMs = 2000;
  private entity: AFRAME.Entity;
  private done: boolean = false;
  constructor(container: AFRAME.Entity, message: string, position: any) {
    this.entity = document.createElement('a-entity');
    this.entity.setAttribute('text', `value: ${message}`);
    this.entity.setAttribute('width', '0.5');
    this.entity.setAttribute('align', 'center');
    this.entity.object3D.position.copy(position);
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
      this.entity.object3D.position.y += timeDeltaMs / 5000;
    }
  }
}

export class EphemeralText {
  private textItems: TextBlurb[] = [];
  private kCapacity: number = 12;
  private nextSlot = 0;
  constructor(private scene: AFRAME.Entity) { }

  addText(message: string, position: any) {
    if (this.textItems[this.nextSlot]) {
      this.textItems[this.nextSlot].dispose();
    }
    const item = new TextBlurb(this.scene, message, position);
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