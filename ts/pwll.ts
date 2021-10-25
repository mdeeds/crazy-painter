export class Motion {
  constructor(
    readonly p: number, readonly x: number) { }
}

/**
 * A PWLL is a PieceWise Linear Loop.  It's a piecewise function
 * defined over the interval [0, 1] where the last control point "loops"
 * back around to the first.
 */
export class PWLL {
  private controlPoints: Motion[] = [];
  private firstP = 0;
  private lastP = 0;
  constructor() { }
  add(m: Motion) {
    this.controlPoints.push(m);
    this.controlPoints.sort((a: Motion, b: Motion) => a.p - b.p)
    this.lastP = this.controlPoints[this.controlPoints.length - 1].p;
    this.firstP = this.controlPoints[0].p;
  }

  log() {
    console.log(this.controlPoints);
  }

  getXdX(p: number): number[] {
    let q = 0;
    let len = 0;
    let i = 0;
    let j = 0;
    if (p > this.lastP) {
      q = (p - this.lastP);
      len = 1 - this.lastP + this.firstP;
      i = this.controlPoints.length - 1;
      j = 0;
    } else if (p < this.firstP) {
      q = (1 - this.lastP) + p;
      len = 1 - this.lastP + this.firstP;
      i = this.controlPoints.length - 1;
      j = 0;
    } else {
      while (p < this.controlPoints[i].p) {
        ++i;
      }
      j = i + 1;
      q = p - this.controlPoints[i].p;
      len = this.controlPoints[j].p - this.controlPoints[i].p;
    }
    const x = (q / len) * this.controlPoints[j].x
      + (1 - q / len) * this.controlPoints[i].x;
    const dx = (this.controlPoints[j].x - this.controlPoints[i].x) / len;
    return [x, dx];
  }
}
