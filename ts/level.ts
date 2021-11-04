import { CritterSource } from "./critterSource";
import { levelSpec } from "./levelSpec";

export class Level {
  constructor(private levelSpec: levelSpec,
    private critterSource: CritterSource) {
  }

  getCritterSource(): CritterSource {
    return this.critterSource;
  }

}