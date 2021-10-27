import { Brush, PaintBrush } from "./brush";
import { Debug } from "./debug";
import { EphemeralText } from "./ephemeralText";
import { Score } from "./score";

export class Wall {
  private canvas: HTMLCanvasElement = null;
  private wallTex = null;
  readonly wallZ: number;

  private blocks: number[] = [];
  private colorMap = new Map<number, string>();
  private readonly kWidth = 30;
  private readonly kWallWidthMeters = 2;
  private readonly wallObject = null;
  private wallPosition = null;

  constructor(private eText: EphemeralText, private score: Score) {
    const scene = document.querySelector('a-scene');
    const wall = document.createElement('a-entity');
    this.wallObject = wall.object3D;
    this.canvas = document.createElement('canvas') as unknown as HTMLCanvasElement;
    this.canvas.width = 1024;
    this.canvas.height = 1024;
    this.wallZ = -0.8;

    this.wallTex = new AFRAME.THREE.CanvasTexture(this.canvas);
    const wallMaterial = new AFRAME.THREE.MeshBasicMaterial({
      map: this.wallTex, transparent: true
    });
    const wallGeometry = new AFRAME.THREE.PlaneGeometry(
      this.kWallWidthMeters, this.kWallWidthMeters);
    this.wallPosition = new AFRAME.THREE.Vector3(0, 1.2, this.wallZ);
    wallGeometry.translate(this.wallPosition.x,
      this.wallPosition.y, this.wallPosition.z);
    const wallMesh = new AFRAME.THREE.Mesh(wallGeometry, wallMaterial);
    wall.object3D = wallMesh;
    scene.appendChild(wall);

    for (let i = 0; i < this.kWidth * this.kWidth; ++i) {
      this.blocks.push(0);
    }
    this.colorMap.set(0, '#820');
    this.colorMap.set(1, '#f40');
    this.updateCanvas();
  }

  public updateCanvas() {
    const ctx = this.canvas.getContext('2d');
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    const kWidth = 30;

    const boxWidth = this.canvas.width / kWidth;

    for (const [colorIndex, color] of this.colorMap.entries()) {
      ctx.fillStyle = color;
      for (let i = 0; i < kWidth; ++i) {
        for (let j = 0; j < kWidth; ++j) {
          if (this.blocks[i + j * this.kWidth] === colorIndex) {
            ctx.fillRect(i * boxWidth + 1, j * boxWidth + 1,
              boxWidth - 2, boxWidth - 2);
          }
        }
      }
    }
    this.wallTex.needsUpdate = true;
  }

  private worldXForI(i: number) {
    return (i + 0.5) / this.kWidth * this.kWallWidthMeters - this.kWallWidthMeters / 2
      + this.wallPosition.x;
  }

  private worldYForJ(i: number) {
    return (this.kWidth - i - 0.5) / this.kWidth * this.kWallWidthMeters - this.kWallWidthMeters / 2
      + this.wallPosition.y;
  }

  public paint(brushPosition: any, radius: number, brush: PaintBrush) {
    try {
      brushPosition.sub(this.wallPosition);
      brushPosition.multiplyScalar(1 / this.kWallWidthMeters);
      brushPosition.x += 0.5;
      brushPosition.y = 0.5 - brushPosition.y;
      if (brushPosition.x < 0 || brushPosition.x > 1 ||
        brushPosition.y < 0 || brushPosition.y > 1) {
        return;
      }
      // brushPosition is now [0,1]
      // x = 0.5 * 1 / kWidth + i * 1/kWidth
      // x - 0.5 / kWidth = i / kWidth
      // kWidth * x - 0.5 = i
      const ci = (this.kWidth * brushPosition.x) - 0.5;
      const cj = (this.kWidth * brushPosition.y) - 0.5;
      const brushRadius = radius / this.kWallWidthMeters * this.kWidth;
      let hasChanges = false;
      let deltaPoints = 0;
      for (let i = Math.floor(ci - brushRadius); i <= Math.ceil(ci + brushRadius); ++i) {
        if (i < 0 || i >= this.kWidth) {
          continue;
        }
        for (let j = Math.floor(cj - brushRadius); j <= Math.ceil(cj + brushRadius); ++j) {
          if (j < 0 || j >= this.kWidth) {
            continue;
          }
          if (deltaPoints >= brush.getSupply()) {
            continue;
          }
          const r2 = (i - ci) * (i - ci) + (j - cj) * (j - cj);
          if (r2 < brushRadius * brushRadius) {
            if (this.blocks[i + j * this.kWidth] !== 1) {
              if (Math.random() * 20 > brush.getSupply()) {
                continue;
              }
              this.blocks[i + j * this.kWidth] = 1;
              const wx = this.worldXForI(i);
              const wy = this.worldYForJ(j);
              this.eText.addText(`+ 1`,
                wx + (Math.random() - 0.5) * 0.01,
                wy + (Math.random() - 0.5) * 0.01,
                this.wallZ + Math.random() * 0.05);
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
      }
    } catch (e) {
      Debug.set(`error: ${e}`);
    }
  }
}