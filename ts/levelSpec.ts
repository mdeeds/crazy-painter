export interface levelSpec {
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

export class LargeLevel extends AbstractLevel implements levelSpec {
  width() { return 30; }
  height() { return 30; }
  paintColorNumber(i: number, j: number) { return 1; }
  constructor() {
    super(['#444', '#f80']);
  }
}

export class SmallLevel extends AbstractLevel implements levelSpec {
  width() { return 10; }
  height() { return 10; }
  paintColorNumber(i: number, j: number) { return 1; }
  constructor() {
    super(['#444', '#f80']);
  }
}