import { Motion, PWLL } from "./pwll";

export class Pod {
  private position: PWLL;
  // #####---  :  [5, 3]
  // #---####  :  [1, 3, 4]
  // ####---#  :  [4, 3, 1]
  // ---#####  :  [0, 3, 5]  // 0 = foot starts up

  constructor(private pattern: number[]) {
    let down = true;
    if (pattern[0] == 0) {
      down = false;
      pattern.shift();
    }
    const totalLength = pattern.reduce((a, b) => a + b, 0);

    let cumulativeLength = 0;
    this.position = new PWLL();

    if (pattern.length % 2 === 1 && down) {
      // Odd pattern, so first and last need to be merged.
      const len = pattern[0] + pattern[pattern.length - 1];
      const pEnd = pattern[0] / totalLength;
      const pStart = 1 - (pattern[pattern.length - 1] / totalLength);
      this.position.add(new Motion(pStart, -len / 2 / totalLength));
      this.position.add(new Motion(pEnd, len / 2 / totalLength))
      pattern.shift();
      pattern.pop();
      down = false;
    }

    for (let i = 0; i < pattern.length; ++i) {
      const len = pattern[i];
      const p = cumulativeLength / totalLength;
      if (down) {
        this.position.add(new Motion(p, -len / 2 / totalLength));
        let x = len / totalLength;
        this.position.add(new Motion(p + x, len / 2 / totalLength));
      }
      down = !down;
      cumulativeLength += len;
    }
    this.position.log();
  }

  getXdX(p: number): number[] {
    return this.position.getXdX(p);
  }
}
