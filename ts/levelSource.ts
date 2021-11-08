import { LargeLevel, LevelSpec, PatternLevel, SmallLevel } from "./levelSpec";

export class LevelSource {
  private currentLevel = 0;
  constructor() {
  }

  getLevelSpec(levelNumber: number): LevelSpec {
    switch (levelNumber % 8) {
      case 0: return new SmallLevel();
      case 1: return new LargeLevel();
      case 2: return new PatternLevel(12, [[1, 2]]);
      case 3: return new PatternLevel(12, [[1], [2]]);
      case 4: return new PatternLevel(15, [[1, 1, 1], [1, 2, 1], [1, 1, 1]]);
      case 5: return new PatternLevel(15, [[1, 2, 1, 2, 1]]);
      case 6: return new PatternLevel(21, [[1], [1], [1], [2], [1], [1], [1]]);
      case 7: return new PatternLevel(5, [
        [1, 2, 1, 2, 1],
        [2, 1, 2, 1, 2],
        [1, 2, 1, 2, 1],
        [2, 1, 2, 1, 2],
        [1, 2, 1, 2, 1]]);
    }
  }

  nextLevel(): LevelSpec {
    const result = this.getLevelSpec(this.currentLevel);
    this.currentLevel++;
    return result;
  }
}