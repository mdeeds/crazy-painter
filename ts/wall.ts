export class Wall {
  private canvas: HTMLCanvasElement = null;
  private wallTex = null;

  constructor() {
    const scene = document.querySelector('a-scene');
    const wall = document.createElement('a-entity');
    this.canvas = document.createElement('canvas') as unknown as HTMLCanvasElement;
    this.canvas.width = 1024;
    this.canvas.height = 1024;

    this.wallTex = new AFRAME.THREE.CanvasTexture(this.canvas);
    const wallMaterial = new AFRAME.THREE.MeshBasicMaterial({
      map: this.wallTex, transparent: true
    });
    const wallGeometry = new AFRAME.THREE.PlaneGeometry(2, 2);
    wallGeometry.translate(0, 1.2, -0.8);
    const wallMesh = new AFRAME.THREE.Mesh(wallGeometry, wallMaterial);
    wall.object3D = wallMesh;
    scene.appendChild(wall);

    this.updateCanvas();
  }

  public updateCanvas() {
    const ctx = this.canvas.getContext('2d');
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    const kWidth = 30;

    const boxWidth = this.canvas.width / kWidth;
    ctx.fillStyle = 'pink';
    for (let i = 0; i < kWidth; ++i) {
      for (let j = 0; j < kWidth; ++j) {
        ctx.fillRect(i * boxWidth + 1, j * boxWidth + 1,
          boxWidth - 2, boxWidth - 2);
      }
    }

    ctx.fillStyle = 'blue';
    for (let i = 0; i < kWidth; ++i) {
      for (let j = 0; j < kWidth; ++j) {
        if (Math.random() > 0.5) {
          ctx.fillRect(i * boxWidth + 1, j * boxWidth + 1,
            boxWidth - 2, boxWidth - 2);
        }
      }
    }
  }

}