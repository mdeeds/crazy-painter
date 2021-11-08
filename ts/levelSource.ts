import { LargeLevel, LevelSpec, PatternLevel, SmallLevel } from "./levelSpec";

export class LevelSource {
  private currentLevel = 0;
  constructor() {
  }

  getLevelSpec(levelNumber: number): LevelSpec {
    switch (levelNumber % 5) {
      case 0: return new SmallLevel();
      case 1: return new LargeLevel();
      case 2: return new PatternLevel(12, [[1, 2]]);
      case 3: return new PatternLevel(12, [[1], [2]]);
      case 4: return new PatternLevel(15, [[1, 1, 1], [1, 2, 1], [1, 1, 1]]);
    }
  }

  nextLevel(): LevelSpec {
    const result = this.getLevelSpec(this.currentLevel);
    this.currentLevel++;
    return result;
  }
}