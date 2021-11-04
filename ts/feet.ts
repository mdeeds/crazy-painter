import { Foot } from "./foot";

export class Feet {
  private feet: Foot[] = [];
  constructor() { }
  add(foot: Foot) {
    this.feet.push(foot);
  }
}
