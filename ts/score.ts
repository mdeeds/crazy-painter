import * as AFRAME from "aframe";

export class Score {
  private score = 0;
  private display: AFRAME.Entity = null;
  constructor(container: AFRAME.Entity) {
    this.display = document.createElement('a-entity');
    container.appendChild(this.display);
    this.add(0);
  }

  add(delta: number) {
    this.score += delta;
    this.display.setAttribute('text',
      `value: ${this.score.toFixed(0)}; align: center; wrap-count: 8; width: 0.2`);
  }
}