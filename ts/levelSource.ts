import { LargeLevel, LevelSpec, SmallLevel } from "./levelSpec";

export class LevelSource {
  private currentLevel = 0;
  constructor() {
  }

  getLevelSpec(levelNumber: number): LevelSpec {
    switch (levelNumber % 2) {
      case 0: return new SmallLevel();
      case 1: return new LargeLevel();
    }
  }

  nextLevel(): LevelSpec {
    const result = this.getLevelSpec(this.currentLevel);
    this.currentLevel++;
    return result;
  }
}