export interface Painter {
  getSupply(): number;
  removeSupply(n: number): void;
}