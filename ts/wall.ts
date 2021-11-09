import * as AFRAME from "aframe";

import { AnimatedObject } from "./animatedObject";
import { AssetLibrary } from "./assetLibrary";
import { Debug } from "./debug";
import { EphemeralText } from "./ephemeralText";
import { LevelSpec } from "./levelSpec";
import { Painter } from "./painter";
import { Score } from "./score";
import { SFX } from "./sfx";

export class WallHandle {
  wall: Wall = null;
}

class PaintState {
  hasChanges = false;
  deltaPoints = 0;
  paintUsed = 0;
  sum_x = 0;
  sum_y = 0;
  constructor(kMetersPerBlock: number, public newColor: number) { }
}

export class Wall implements Ticker {
  private canvas: HTMLCanvasElement = null;
  private wallTex = null;
  readonly wallZ: number;
  readonly wallY: number;
  readonly kMetersPerBlock = 0.05;
  private kPixelsPerBlock = 32;

  private blocks: Uint8ClampedArray;
  private colorMap = new Map<number, string>();
  readonly kWallWidthMeters: number;
  readonly kWallHeightMeters: number;
  private wallPosition = null;
  private tickers: Ticker[] = [];
  private remaining: number = null;
  private done = false;
  private entity: AFRAME.Entity = null;

  constructor(private level: LevelSpec, private eText: EphemeralText,
    private score: Score, private assetLibrary: AssetLibrary,
    private sfx: SFX) {
    const scene = document.querySelector('a-scene');
    this.entity = document.createElement('a-entity');
    this.canvas = document.createElement('canvas') as unknown as HTMLCanvasElement;
    this.canvas.width = 1024;
    this.canvas.height = 1024;
    this.wallZ = -1;
    this.wallY = 1.2;

    this.kWallWidthMeters = level.width() * this.kMetersPerBlock;
    this.kWallHeightMeters = level.height() * this.kMetersPerBlock;
    this.remaining = level.width() * level.height();

    this.wallTex = new AFRAME.THREE.CanvasTexture(this.canvas);
    const wallMaterial = new AFRAME.THREE.MeshBasicMaterial({
      map: this.wallTex, transparent: true
    });
    const wallGeometry = new AFRAME.THREE.PlaneGeometry(
      1024 / this.kPixelsPerBlock * this.kMetersPerBlock,
      1024 / this.kPixelsPerBlock * this.kMetersPerBlock);
    this.wallPosition = new AFRAME.THREE.Vector3(0, this.wallY, this.wallZ);

    {
      const centerPx = this.kPixelsPerBlock * level.width() / 2;
      const fromLeftM = this.kMetersPerBlock * centerPx / this.kPixelsPerBlock;
      const centerM = this.kMetersPerBlock * 512 / this.kPixelsPerBlock;
      const deltaM = (centerM - fromLeftM);
      wallGeometry.translate(
        this.wallPosition.x + deltaM, this.wallPosition.y - deltaM,
        this.wallPosition.z);
    }

    const wallMesh = new AFRAME.THREE.Mesh(wallGeometry, wallMaterial);
    this.entity.object3D = wallMesh;
    scene.appendChild(this.entity);

    this.blocks = new Uint8ClampedArray(level.width() * level.height());
    this.colorMap = level.getColorMap();
    this.updateCanvas();
  }

  isDone(): boolean { return this.done; }

  remove() {
    this.entity.remove();
  }

  public updateCanvas() {
    const ctx = this.canvas.getContext('2d');
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    const boxWidth = this.kPixelsPerBlock;
    for (const [colorIndex, color] of this.colorMap.entries()) {
      ctx.fillStyle = color;
      let numSet = 0;
      for (let i = 0; i < this.level.width(); ++i) {
        for (let j = 0; j < this.level.height(); ++j) {
          if (this.blocks[i + j * this.level.width()] === colorIndex) {
            ctx.fillRect(i * boxWidth + 1, j * boxWidth + 1,
              boxWidth - 2, boxWidth - 2);
            ++numSet;
          }
        }
      }
    }
    ctx.lineWidth = 2;
    for (const [colorIndex, color] of this.colorMap.entries()) {
      ctx.strokeStyle = color;
      for (let i = 0; i < this.level.width(); ++i) {
        for (let j = 0; j < this.level.height(); ++j) {
          if (this.level.paintColorNumber(i, j) === colorIndex) {
            ctx.strokeRect(i * boxWidth + 1.5, j * boxWidth + 1.5,
              boxWidth - 3, boxWidth - 3);
          }
        }
      }
    }
    this.remaining = 0;
    for (let i = 0; i < this.level.width(); ++i) {
      for (let j = 0; j < this.level.height(); ++j) {
        if (this.level.paintColorNumber(i, j) !== this.blocks[i + j * this.level.width()]) {
          this.remaining++;
        }
      }
    }
    if (this.remaining === 0) {
      this.done = true;
      this.sfx.complete();
    }

    this.wallTex.needsUpdate = true;
  }

  private worldXForI(i: number) {
    return (i + 0.5) /
      this.level.width() * this.kWallWidthMeters - this.kWallWidthMeters / 2
      + this.wallPosition.x;
  }

  private worldYForJ(j: number) {
    return (this.level.height() - j - 0.5) /
      this.level.height() * this.kWallHeightMeters - this.kWallHeightMeters / 2
      + this.wallPosition.y;
  }

  private getIJForPosition(brushPosition: any): number[] {
    this.tmpPosition.copy(brushPosition);
    this.tmpPosition.sub(this.wallPosition);
    this.tmpPosition.multiplyScalar(1 / this.kWallWidthMeters);
    this.tmpPosition.x += 0.5;
    this.tmpPosition.y = 0.5 - this.tmpPosition.y;
    if (this.tmpPosition.x < 0 || this.tmpPosition.x > 1 ||
      this.tmpPosition.y < 0 || this.tmpPosition.y > 1) {
      return [null, null];
    }
    // brushPosition is now [0,1]
    // x = 0.5 * 1 / kWidth + i * 1/kWidth
    // x - 0.5 / kWidth = i / kWidth
    // kWidth * x - 0.5 = i
    const ci = (this.level.width() * this.tmpPosition.x) - 0.5;
    const cj = (this.level.height() * this.tmpPosition.y) - 0.5;
    return [ci, cj];
  }

  // ci, cj, and brushRadius describe a circle.  ci and cj may be
  // floating point numbers.  Calls cb for all integer i,j inside that circle.
  private doCircle(ci: number, cj: number, brushRadius: number,
    cb: (i: number, j: number) => void) {
    for (let i = Math.floor(ci - brushRadius); i <= Math.ceil(ci + brushRadius); ++i) {
      if (i < 0 || i >= this.level.width()) {
        continue;
      }
      for (let j = Math.floor(cj - brushRadius); j <= Math.ceil(cj + brushRadius); ++j) {
        if (j < 0 || j >= this.level.height()) {
          continue;
        }
        const r2 = (i - ci) * (i - ci) + (j - cj) * (j - cj);
        if (r2 < brushRadius * brushRadius) {
          cb(i, j);
        }
      }
    }
  }

  private doLine(i1: number, j1: number, i2: number, j2: number,
    cb: (i: number, j: number) => void) {
    let di: number, dj: number;
    if (Math.abs(i2 - i1) > Math.abs(j2 - j1)) {
      di = Math.sign(i2 - i1);
      dj = (j2 - j1) / Math.abs(i2 - i1);
    } else {
      dj = Math.sign(j2 - j1);
      di = (i2 - i1) / Math.abs(j2 - j1);
    }
    // Debug.set('doLine', `${di} ${dj}`);
    let i = i1;
    let j = j1;
    let steps = Math.round(Math.max(Math.abs(i2 - i1), Math.abs(j2 - j1))) + 1;
    // Debug.set('steps', `${steps}`);
    while (steps > 0) {
      if (i >= 0 && j >= 0 &&
        i < this.level.width() && j < this.level.width()) {
        cb(Math.round(i), Math.round(j));
      }
      i += di;
      j += dj;
      --steps;
    }
  }

  private handlePaintFactory(paintState: PaintState, brush: Painter) {
    return (i: number, j: number) => {
      if (paintState.deltaPoints >= brush.getSupply()) {
        return;
      }
      const oldColor = this.blocks[i + j * this.level.width()];
      const desiredColor = this.level.paintColorNumber(i, j);
      if (oldColor !== paintState.newColor) {
        if (Math.random() * 20 > brush.getSupply()) {
          return;
        }
        this.blocks[i + j * this.level.width()] = paintState.newColor;
        if (paintState.newColor === desiredColor) {
          ++paintState.deltaPoints;
        } else if (oldColor === desiredColor) {
          --paintState.deltaPoints;
        }
        // TODO: award points if the color is correct.
        // TODO: deduct points if color is incorrect.
        const wx = this.worldXForI(i);
        const wy = this.worldYForJ(j);
        paintState.sum_x += wx;
        paintState.sum_y += wy;
        ++paintState.paintUsed;
        paintState.hasChanges = true;
      }
    }
  }

  private finishBrushing(paintState: PaintState, brush: Painter) {
    if (paintState.hasChanges) {
      this.updateCanvas();
      this.score.add(paintState.deltaPoints);
      brush.removeSupply(paintState.paintUsed);
      if (paintState.deltaPoints > 0) {
        this.sfx.point();
        this.eText.addText(`+${paintState.deltaPoints}`,
          paintState.sum_x / paintState.paintUsed, paintState.sum_y / paintState.paintUsed,
          this.wallZ + Math.random() * 0.05);
      } else if (paintState.deltaPoints < 0) {
        this.eText.addText(`${paintState.deltaPoints}`,
          paintState.sum_x / paintState.paintUsed, paintState.sum_y / paintState.paintUsed,
          this.wallZ + Math.random() * 0.05, 'down');
        this.sfx.minusPoint();
      }
    }
  }

  private tmpPosition = new AFRAME.THREE.Vector3();
  public paintCircle(brushPosition: any, radius: number, brush: Painter) {
    try {
      const [ci, cj] = this.getIJForPosition(brushPosition);
      if (ci === null) {
        return;
      }
      const paintState = new PaintState(this.kMetersPerBlock,
        this.level.getIndexForColor(brush.getColor()));
      const brushRadius = radius / this.kMetersPerBlock;
      this.doCircle(ci, cj, brushRadius, this.handlePaintFactory(paintState, brush));
      this.finishBrushing(paintState, brush);
    } catch (e) {
      // Debug.set('paint error', `${e}`);
      if (new URL(document.URL).searchParams.get('throw')) {
        throw e;
      }
    }
  }

  public paintLine(fromPosition: any, toPosition: any, brush: Painter) {
    const [i1, j1] = this.getIJForPosition(fromPosition);
    const [i2, j2] = this.getIJForPosition(toPosition);
    if (i1 === null || i2 === null) {
      return;
    }
    const paintState = new PaintState(this.kMetersPerBlock,
      this.level.getIndexForColor(brush.getColor()));
    this.doLine(i1, j1, i2, j2, this.handlePaintFactory(paintState, brush));
    this.finishBrushing(paintState, brush);
  }

  public pickUpLine(fromPosition: any, toPosition: any): string {
    const [i1, j1] = this.getIJForPosition(fromPosition);
    const [i2, j2] = this.getIJForPosition(toPosition);
    if (i1 === null || i2 === null) {
      return null;
    }
    let color: string = null;
    this.doLine(i1, j1, i2, j2, (i: number, j: number) => {
      const colorNumber = this.blocks[i + j * this.level.width()];
      if (colorNumber !== 0) {
        color = this.colorMap.get(colorNumber);
      }
    });
    if (color !== null) {
      // Debug.set('pickup', color);
    }
    return color;
  }


  public getColor(brushPosition: any): string {
    const [ci, cj] = this.getIJForPosition(brushPosition);
    if (ci === null) {
      return null;
    }
    const i = Math.round(ci);
    const j = Math.round(cj);
    const colorNumber = this.blocks[i + j * this.level.width()];
    if (colorNumber === 0) {
      return null;
    }
    return this.colorMap.get(colorNumber);
  }

  tick(timeMs: number, timeDeltaMs: number) {
    for (const t of this.tickers) {
      t.tick(timeMs, timeDeltaMs);
    }
  }
}