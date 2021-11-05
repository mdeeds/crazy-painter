import { AnimatedObject } from "./animatedObject";
import { AssetLibrary } from "./assetLibrary";
import { Debug } from "./debug";
import { EphemeralText } from "./ephemeralText";
import { levelSpec } from "./levelSpec";
import { Painter } from "./painter";
import { Score } from "./score";

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
  private readonly wallObject = null;
  private wallPosition = null;
  private tickers: Ticker[] = [];

  constructor(private level: levelSpec, private eText: EphemeralText,
    private score: Score, private assetLibrary: AssetLibrary) {
    const scene = document.querySelector('a-scene');
    const wall = document.createElement('a-entity');
    this.wallObject = wall.object3D;
    this.canvas = document.createElement('canvas') as unknown as HTMLCanvasElement;
    this.canvas.width = 1024;
    this.canvas.height = 1024;
    this.wallZ = -1;
    this.wallY = 1.2;

    this.kWallWidthMeters = level.width() * this.kMetersPerBlock;
    this.kWallHeightMeters = level.height() * this.kMetersPerBlock;

    this.wallTex = new AFRAME.THREE.CanvasTexture(this.canvas);
    const wallMaterial = new AFRAME.THREE.MeshBasicMaterial({
      map: this.wallTex, transparent: true
    });
    const wallGeometry = new AFRAME.THREE.PlaneGeometry(
      1024 / this.kPixelsPerBlock * this.kMetersPerBlock,
      1024 / this.kPixelsPerBlock * this.kMetersPerBlock);
    this.wallPosition = new AFRAME.THREE.Vector3(0, this.wallY, this.wallZ);

    const url = new URL(document.URL);
    if (url.searchParams.get('doors')) {
      this.loadDoors();
    }

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
    wall.object3D = wallMesh;
    scene.appendChild(wall);

    this.blocks = new Uint8ClampedArray(level.width() * level.height());
    this.colorMap = level.getColorMap();
    this.updateCanvas();
  }

  async loadDoors() {
    const scene = document.querySelector('a-scene');
    const doorContainer = document.createElement('a-entity');
    doorContainer.setAttribute('position', `0 1.2 ${this.wallZ}`);
    scene.appendChild(doorContainer);
    const doors = await AnimatedObject.make(
      'obj/oven doors.gltf', this.assetLibrary, doorContainer);
    doors.play();
    this.tickers.push(doors);
  }

  public updateCanvas() {
    const ctx = this.canvas.getContext('2d');
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    const boxWidth = this.kPixelsPerBlock;

    for (const [colorIndex, color] of this.colorMap.entries()) {
      ctx.fillStyle = color;
      for (let i = 0; i < this.level.width(); ++i) {
        for (let j = 0; j < this.level.height(); ++j) {
          if (this.blocks[i + j * this.level.width()] === colorIndex) {
            ctx.fillRect(i * boxWidth + 1, j * boxWidth + 1,
              boxWidth - 2, boxWidth - 2);
          }
        }
      }
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

  private tmpPosition = new AFRAME.THREE.Vector3();
  public paint(brushPosition: any, radius: number, brush: Painter) {
    try {
      const [ci, cj] = this.getIJForPosition(brushPosition);
      if (ci === null) {
        return;
      }
      const brushRadius = radius / this.kMetersPerBlock;
      let hasChanges = false;
      let deltaPoints = 0;
      let sum_x = 0;
      let sum_y = 0;
      for (let i = Math.floor(ci - brushRadius); i <= Math.ceil(ci + brushRadius); ++i) {
        if (i < 0 || i >= this.level.width()) {
          continue;
        }
        for (let j = Math.floor(cj - brushRadius); j <= Math.ceil(cj + brushRadius); ++j) {
          if (j < 0 || j >= this.level.height()) {
            continue;
          }
          if (deltaPoints >= brush.getSupply()) {
            continue;
          }
          const r2 = (i - ci) * (i - ci) + (j - cj) * (j - cj);
          if (r2 < brushRadius * brushRadius) {
            if (this.blocks[i + j * this.level.width()] !== 1) {
              if (Math.random() * 20 > brush.getSupply()) {
                continue;
              }
              this.blocks[i + j * this.level.width()] = 1;
              const wx = this.worldXForI(i);
              const wy = this.worldYForJ(j);
              sum_x += wx;
              sum_y += wy;
              ++deltaPoints;
              hasChanges = true;
            }
          }
        }
      }
      if (hasChanges) {
        this.updateCanvas();
        this.score.add(deltaPoints);
        brush.removeSupply(deltaPoints);
        this.eText.addText(`+${deltaPoints}`,
          sum_x / deltaPoints, sum_y / deltaPoints,
          this.wallZ + Math.random() * 0.05);
      }
    } catch (e) {
      Debug.set(`error: ${e}`);
    }
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