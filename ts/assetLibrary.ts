import * as AFRAME from "aframe";


export class AssetLibrary {
  private idMap = new Map<string, string>();
  constructor(private assetCollection: AFRAME.Entity) { }


  private addImage(url: string) {
    const img = document.createElement('img');
    img.setAttribute('src', url);
    img.id = `asset${this.idMap.size}`;
    this.assetCollection.appendChild(img);
    this.idMap.set(url, img.id);
    return img.id;
  }

  private addItem(url: string) {
    // <a-asset-item id="horse-obj" src="horse.obj"></a-asset-item>
    // <a-asset-item id="horse-mtl" src="horse.mtl"></a-asset-item>
    const item = document.createElement('a-asset-item');
    item.setAttribute('src', url);
    item.id = `asset${this.idMap.size}`;
    this.assetCollection.appendChild(item);
    this.idMap.set(url, item.id);
    return item.id;
  }

  getId(url: string) {
    if (this.idMap.has(url)) {
      return this.idMap.get(url);
    }
    if (url.toLowerCase().endsWith('.png') ||
      url.toLocaleLowerCase().endsWith('.jpg')) {
      return this.addImage(url);
    }
    return this.addItem(url);
  }

  private neonTextureMap = new Map<string, any>();
  getNeonTexture(color: string): any {
    if (this.neonTextureMap.has(color)) {
      return this.neonTextureMap.get(color);
    }
    const material = new AFRAME.THREE.MeshBasicMaterial({ color: color });
    this.neonTextureMap.set(color, material);
    return material;
  }

  private metalTextureMap = new Map<string, any>();
  getMetalTexture(color: string): any {
    if (this.metalTextureMap.has(color)) {
      return this.metalTextureMap.get(color);
    }
    const material = new AFRAME.THREE.MeshStandardMaterial({
      color: color,
      metalness: 1.0,
    });
    this.metalTextureMap.set(color, material);
    return material;
  }

}