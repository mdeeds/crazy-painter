import * as AFRAME from "aframe";

class uvPair {
  static kWidth = 360;
  static kMaxV = 179;
  constructor(public u: number, public v: number) {
    if (this.v === 0 || this.v === uvPair.kMaxV) {
      this.u = 0;
    }
  }

  static mid(a: uvPair, b: uvPair): uvPair {
    if (a.v === 0 || a.v === uvPair.kMaxV) {
      a.u = b.u;
    } else if (b.v === 0 || b.v === uvPair.kMaxV) {
      b.u = a.u;
    }
    return new uvPair(Math.round((a.u + b.u) / 2), Math.round((a.v + b.v) / 2));
  }

  equals(other: uvPair) {
    if (this.v === 0 && other.v === 0) {
      return true;
    }
    if (this.v === uvPair.kMaxV && other.v === uvPair.kMaxV) {
      return true;
    }
    return (this.v === other.v && this.u === other.u);
  }
  close(other: uvPair) {
    if (this.v <= 1 && other.v <= 1) {
      return true;
    }
    if (this.v >= uvPair.kMaxV - 1 && other.v >= uvPair.kMaxV - 1) {
      return true;
    }
    return (Math.abs(this.v - other.v) <= 1 &&
      Math.abs(this.u - other.u) <= 1);
  }
}

export class Octohedron {
  private r: Float32Array = null;
  constructor(scene: AFRAME.Entity) {
    this.r = new Float32Array(uvPair.kWidth * uvPair.kWidth / 2);

    const t = new uvPair(0, 0);
    const b = new uvPair(0, uvPair.kMaxV);
    const midV = Math.round(uvPair.kWidth / 4);
    const pitchU = Math.round(uvPair.kWidth / 4)
    const m1 = new uvPair(0, midV);
    const m2 = new uvPair(pitchU, midV);
    const m3 = new uvPair(2 * pitchU, midV);
    const m4 = new uvPair(3 * pitchU, midV);
    const m5 = new uvPair(4 * pitchU, midV);
    for (let u = 0; u < uvPair.kWidth; ++u) {
      this.setUV(u, t.v, 1);
      this.setUV(u, b.v, 1);
    }

    this.maybeSet(m1, 1);
    this.maybeSet(m2, 1);
    this.maybeSet(m3, 1);
    this.maybeSet(m4, 1);

    this.plasma(t, m1, m2, 0);
    this.plasma(t, m2, m3, 0);
    this.plasma(t, m3, m4, 0);
    this.plasma(t, m4, m5, 0);
    this.plasma(b, m1, m2, 0);
    this.plasma(b, m2, m3, 0);
    this.plasma(b, m3, m4, 0);
    this.plasma(b, m4, m5, 0);

    let prev = 1.0;
    for (let i = 0; i < this.r.length; ++i) {
      if (!(this.r[i] > 0.1) || this.r[i] > 5) {
        this.r[i] = prev;
      } else {
        prev = this.r[i];
      }
    }

    const f = (u: number, v: number, target: any) => {
      if (u === 1) { u = 0; }
      const theta = Math.PI * 2 * u;
      const rho = Math.PI * v;
      const i = Math.min(uvPair.kWidth - 1, Math.max(0,
        Math.floor(u * uvPair.kWidth)));
      const j = Math.min(uvPair.kMaxV, Math.max(0,
        Math.floor(v * uvPair.kWidth / 2)));

      const r = this.r[i + j * uvPair.kWidth] * 2.0;
      if (!(r > 0.01)) {
        throw new Error(`out of range.`);
      }

      const rr = r * Math.sin(rho);
      target.set(rr * Math.cos(theta),
        r * Math.cos(rho),
        rr * Math.sin(theta));
    }

    const geometry = new AFRAME.THREE.ParametricGeometry(
      f, /*slices=*/360, /*stacks=*/180);

    const material = new AFRAME.THREE.MeshStandardMaterial({
      color: '#88f',
    });
    material.side = AFRAME.THREE.DoubleSide;
    const mesh = new AFRAME.THREE.Mesh(geometry, material);
    const entity = document.createElement('a-entity');
    entity.setAttribute('position', '0 1 0');
    entity.object3D = mesh;
    scene.appendChild(entity);
  }

  private setUV(u: number, v: number, val: number) {
    this.r[u + v * uvPair.kWidth] = val;
  }
  private maybeSet(p: uvPair, val: number) {
    const v = p.v;
    const u = (v === 0 || v === uvPair.kMaxV) ? 0 : p.u % (uvPair.kWidth);
    if (this.r[u + v * uvPair.kWidth] === 0) {
      this.r[u + v * uvPair.kWidth] = val;
    }
  }

  private get(p: uvPair): number {
    const v = p.v;
    const u = (v === 0 || v === uvPair.kMaxV) ? 0 : p.u % (uvPair.kWidth);
    return this.r[u + v * uvPair.kWidth];
  }

  private subdivide(p1: uvPair, p2: uvPair, magnitude: number): uvPair {
    const val1 = this.get(p1);
    const val2 = this.get(p2);
    const mid = uvPair.mid(p1, p2);
    if (this.get(mid) === 0) {
      const newVal = (Math.random() - 0.5) * magnitude +
        (val1 + val2) / 2;
      if (!(newVal > 0.01)) {
        throw new Error(`Illegal: ${newVal}`);
      }
      this.maybeSet(mid, newVal);
    }
    return mid;
  }

  // By construction, a must always be the top or bottom of the triangle.
  private plasma(a: uvPair, b: uvPair, c: uvPair, depth: number) {
    if (a.close(b) && b.close(c) && c.close(a)) {
      return; // nothing to do.
    }
    if (depth > 20) {
      throw new Error('Exhausted!');
    }
    const magnitude = this.getMagnitude(b, c);
    const nextTri: uvPair[] = [];
    const ab = this.subdivide(a, b, magnitude);
    const bc = this.subdivide(b, c, magnitude);
    const ac = this.subdivide(a, c, magnitude);
    this.plasma(a, ab, ac, depth + 1);
    this.plasma(bc, ab, ac, depth + 1);
    this.plasma(ab, b, bc, depth + 1);
    this.plasma(ac, bc, c, depth + 1);
  }

  private getMagnitude(uv1: uvPair, uv2: uvPair): number {
    const deltaURad = Math.abs(uv1.u - uv2.u) / uvPair.kWidth * Math.PI * 2;
    if (uv1.v !== uv2.v) {
      throw new Error(
        `Misformed base: ${JSON.stringify(uv1)} ${JSON.stringify(uv2)}`);
    };
    // Measured from north pole.
    const vrad = uv1.v / uvPair.kWidth * Math.PI * 2;
    return deltaURad * Math.sin(vrad) * 0.4;
  }


  // v3 is 3-space y = up, z = back, x = right
  // v2 is longitude, latitude measured in radians.
  private v2ToV3(v2: any, v3: any) {
    const r = Math.cos(v2.y);
    v3.set(
      r * Math.cos(v2.x),
      Math.sin(v2.y),
      r * Math.sin(v2.x),
    )
  }

  // v3 must be normalized.
  private v3ToV2(v3: any, v2: any) {
    v2.set(
      Math.atan2(v3.x, v3.z),
      Math.asin(v2.y)
    )
  }

  private tmpP1 = new AFRAME.THREE.Vector3();
  private tmpP2 = new AFRAME.THREE.Vector3();
  private midV2(xy1: any, xy2: any, xyTarget: any) {
    this.v2ToV3(xy1, this.tmpP1);
    this.v2ToV3(xy2, this.tmpP2);
    this.tmpP2.add(this.tmpP1).normalize();
    this.v3ToV2(this.tmpP2, xyTarget);

  }

}