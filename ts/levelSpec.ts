export interface levelSpec {
  width(): number;
  height(): number;
  // Returns the color for cell i, j 
  paintColorNumber(i: number, j: number): number;
  // Maps the color numbers to the associated color string
  getColorMap(): Map<number, string>;
}

export class LargeLevel implements levelSpec {
  width() { return 30; }
  height() { return 30; }
  paintColorNumber(i: number, j: number) { return 1; }
  private colorMapInternal = new Map<number, string>();
  constructor() {
    this.colorMapInternal.set(0, '#444');
    this.colorMapInternal.set(1, '#f80');
  }
  getColorMap() {
    return this.colorMapInternal;
  }
}

export class SmallLevel implements levelSpec {
  width() { return 10; }
  height() { return 10; }
  paintColorNumber(i: number, j: number) { return 1; }
  private colorMapInternal = new Map<number, string>();
  constructor() {
    this.colorMapInternal.set(0, '#444');
    this.colorMapInternal.set(1, '#4f0');
  }
  getColorMap() {
    return this.colorMapInternal;
  }
}