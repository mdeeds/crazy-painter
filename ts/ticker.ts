interface Ticker {
  tick(timeMs: number, timeDeltaMs: number): void;
  isDone(): boolean;
  remove(): void;
}