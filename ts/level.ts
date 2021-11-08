import { CritterSource } from "./critterSource";
import { LevelSpec } from "./levelSpec";

export class Level {
  constructor(private levelSpec: LevelSpec,
    private critterSource: CritterSource) {
  }

  getCritterSource(): CritterSource {
    return this.critterSource;
  }

}