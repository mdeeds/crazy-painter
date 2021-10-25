import { Debug } from "./debug";

export class Wall {
  private canvas: HTMLCanvasElement = null;
  private wallTex = null;
  readonly wallZ: number;

  private blocks: number[] = [];
  private colorMap = new Map<number, string>();
  private readonly kWidth = 30;
  private readonly kWallWidthMeters = 4;
  private readonly wallObject = null;

  constructor() {
    Debug.set('Wall');
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
      this.kWallWidthMeters / 2, this.kWallWidthMeters / 2);
    wallGeometry.translate(0, 1.2, this.wallZ);
    const wallMesh = new AFRAME.THREE.Mesh(wallGeometry, wallMaterial);
    wall.object3D = wallMesh;
    scene.appendChild(wall);

    for (let i = 0; i < this.kWidth * this.kWidth; ++i) {
      this.blocks.push(0);
    }
    this.colorMap.set(0, '#f40');
    this.colorMap.set(1, '#820');
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

  // Argument is in world space.
  private wallPosition = new AFRAME.THREE.Vector3();
  public paint(brushPosition: any, radius: number) {
    try {
      this.wallObject.getWorldPosition(this.wallPosition);
      brushPosition.sub(this.wallPosition);
      brushPosition.multiplyScalar(1 / this.kWallWidthMeters);
      brushPosition.x += 0.5;
      brushPosition.y += 0.5;
      Debug.set(`x: ${brushPosition.x} y: ${brushPosition.y}`);
      // brushPosition is now [0,1]
      // x = 0.5 * 1 / kWidth + i * 1/kWidth
      // x - 0.5 / kWidth = i / kWidth
      // kWidth * (x - 0.5) = i
      const i = Math.round(this.kWidth * (brushPosition.x - 0.5));
      const j = Math.round(this.kWidth * (brushPosition.y - 0.5));
      // TODO: Handle radius
      if (this.blocks[i + j * this.kWidth] === 1) {
        return;
      }
      this.blocks[i + j * this.kWidth] = 1;
      this.updateCanvas();
      Debug.set(`success: ${i}, ${j}`);
    } catch (e) {
      Debug.set(`error: ${e}`);
    }
  }
}