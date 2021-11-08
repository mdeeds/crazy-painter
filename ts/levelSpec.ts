export interface LevelSpec {
  width(): number;
  height(): number;
  // Returns the color for cell i, j 
  paintColorNumber(i: number, j: number): number;
  // Maps the color numbers to the associated color string
  getColorMap(): Map<number, string>;
  getIndexForColor(color: string): number;
}

class AbstractLevel {
  private colorMapInternal = new Map<number, string>();
  private indexMapInternal = new Map<string, number>();
  constructor(colors: string[]) {
    for (const c of colors) {
      this.setColor(this.colorMapInternal.size, c);
    }
  }
  setColor(index: number, color: string) {
    this.colorMapInternal.set(index, color);
    this.indexMapInternal.set(color, index);
  }
  getColorMap() {
    return this.colorMapInternal;
  }
  getIndexForColor(color: string) {
    if (!this.indexMapInternal.has(color)) {
      this.setColor(this.indexMapInternal.size, color);
    }
    return this.indexMapInternal.get(color);
  }
}

export class LargeLevel extends AbstractLevel implements LevelSpec {
  width() { return 20; }
  height() { return 20; }
  paintColorNumber(i: number, j: number) { return 1; }
  constructor() {
    super(['#444', '#f80']);
  }
}

export class SmallLevel extends AbstractLevel implements LevelSpec {
  width() { return 10; }
  height() { return 10; }
  paintColorNumber(i: number, j: number) { return 1; }
  constructor() {
    super(['#444', '#f80']);
  }
}

export class PatternLevel extends AbstractLevel implements LevelSpec {
  constructor(private size: number, private pattern: number[][]) {
    super(['4444', '#f80', '#0f0']);
  }
  width() { return this.size; }
  height() { return this.size; }
  paintColorNumber(i: number, j: number) {
    const pi = Math.floor(i / this.size * this.pattern[0].length);
    const pj = Math.floor(j / this.size * this.pattern.length);
    return this.pattern[pj][pi];
  }
}