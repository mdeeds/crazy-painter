export class Doors {
  private desiredPosition = 0;
  private currentPosition = 0;
  constructor() {
  }


  private setPosition(position: number) {
    // TODO: Update the position of the graphics.
    this.currentPosition = position;
  }

  tick(timeMs: number, timeDeltaMs: number) {
  }
}