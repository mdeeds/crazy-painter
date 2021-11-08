import * as AFRAME from "aframe";
import { Brush } from "./brush";
import { Can } from "./can";
import { Debug } from "./debug";
import { EphemeralText } from "./ephemeralText";
import { Critter } from "./critter";
import { Score } from "./score";
import { Wall } from "./wall";
import { AssetLibrary } from "./assetLibrary";
import { CritterSource } from "./critterSource";
import { LargeLevel, SmallLevel } from "./levelSpec";
import { AnimatedObject } from "./animatedObject";
import { SFX } from "./sfx";

var brush = null;
var wall: Wall = null;
var critters: CritterSource = null;
var eText: EphemeralText = null;
var score: Score;
var tickers: Ticker[] = [];

var totalElapsed = 0;
var tickNumber = 0;
var previousTicks = new Float32Array(60);

function makeRoom(scene: AFRAME.Entity, assetLibrary: AssetLibrary) {
  const model = document.createElement('a-entity');
  model.setAttribute('gltf-model', `#${assetLibrary.getId('obj/clean-room.gltf')}`);
  const url = new URL(document.URL);
  if (url.searchParams.get('merge')) {
    model.addEventListener('model-loaded', () => {
      const seenGeometries = new Map<string, any[]>();
      const seenTextures = new Map<string, any>();
      console.log('AAAAA merging');
      const obj = model.getObject3D('mesh');
      // obj.updateMatrixWorld();
      let geometryCount = 0;
      obj.traverse(node => {
        if (node.geometry && node.material) {
          node.updateMatrix();
          if (!seenTextures.has(node.material.name)) {
            seenTextures.set(node.material.name, node.material);
            seenGeometries.set(node.material.name, []);
          }
          seenGeometries.get(node.material.name).push(
            node.geometry.clone().applyMatrix4(node.matrix));
          ++geometryCount;
        }
      });
      console.log(`AAAAA merging ${geometryCount} assets;` +
        ` ${seenTextures.size} unique textures.`);
      const group = new AFRAME.THREE.Group();
      for (const [name, geometries] of seenGeometries.entries()) {
        const merged = AFRAME.THREE.BufferGeometryUtils.mergeBufferGeometries(
          geometries, false);
        const material = seenTextures.get(name);
        const mesh = new AFRAME.THREE.Mesh(merged, material);
        group.add(mesh);
      }
      model.remove();
      const model2 = document.createElement('a-entity');
      model2.object3D = group;
      scene.appendChild(model2);
      console.log('AAAAA merge done');
    });
  }

  scene.appendChild(model);
}

var makeCanEntity = function (scene, assetLibrary, color, position) {
  const canEntity = document.createElement('a-entity');
  canEntity.setAttribute('position', position);
  scene.appendChild(canEntity);
  const can = new Can(canEntity, color,
    brush.getBrushes(), assetLibrary);
  tickers.push(can);
}

AFRAME.registerComponent("go", {
  init: async function () {
    Debug.init();
    const scene = document.querySelector('a-scene');
    const assetLibrary = new AssetLibrary(document.querySelector('a-assets'));
    makeRoom(scene, assetLibrary);
    eText = new EphemeralText(scene);
    eText.addText("Let's go!", 0, 1.5, -0.6);
    score = new Score(document.querySelector('#score'));
    tickers.push(eText);

    const sfx = await SFX.make();
    wall = new Wall(new SmallLevel(), eText, score, assetLibrary,
      sfx);
    tickers.push(wall);
    critters = new CritterSource(wall, assetLibrary, score, eText);

    brush = new Brush(document.querySelector('#player'),
      '#f80',
      document.querySelector('#leftHand').object3D,
      document.querySelector('#rightHand').object3D, wall, critters);

    makeCanEntity(scene, assetLibrary, '#f80', '-0.5 0 -0.2');
    makeCanEntity(scene, assetLibrary, '#0f0', '0.5 0 -0.2');

    const body = document.querySelector('body');
    body.addEventListener('keydown', (ev: KeyboardEvent) => {
      let dy = 0;
      let dx = 0;
      let dz = 0;
      switch (ev.code) {
        case "KeyI": dy = 0.03; break;
        case "KeyK": dy = -0.03; break;
        case "KeyJ": dx = -0.03; break;
        case "KeyL": dx = 0.03; break;
        case "KeyU": dz = -0.05; break;
        case "KeyO": dz = 0.05; break;
      }
      const rh = document.querySelector('#rightHand');
      rh.object3D.position.x += dx;
      rh.object3D.position.y += dy;
      rh.object3D.position.z += dz;
      const lh = document.querySelector('#leftHand');
      lh.object3D.position.x -= dx;
      lh.object3D.position.y -= dy;
      lh.object3D.position.z -= dz;
    });
  },
  tick: function (timeMs: number, timeDeltaMs: number) {
    try {
      if (critters != null) {
        critters.tick(timeMs, timeDeltaMs);
      }
      if (brush != null) {
        brush.tick(timeMs, timeDeltaMs);
      }
      for (let i = 0; i < tickers.length;) {
        const t = tickers[i];
        t.tick(timeMs, timeDeltaMs);
        if (t.isDone()) {
          t.remove();
          tickers.splice(i, 1);
        } else {
          ++i;
        }
      }
    } catch (e) {
      Debug.set(`Tick error: ${e}`);
      const url = new URL(document.URL);
      if (url.searchParams.get('throw')) {
        throw e;
      }
    }

    if (timeMs >= 10000) {
      totalElapsed -= previousTicks[tickNumber];
      totalElapsed += timeDeltaMs;
      previousTicks[tickNumber] = timeDeltaMs;
      tickNumber = (tickNumber + 1) % previousTicks.length;
      const fps = previousTicks.length * 1000 / totalElapsed;
      if (tickNumber % 15 === 0) {
        Debug.set(`${fps.toFixed(1)} fps`);
      }
    }
  }
});

const body = document.getElementsByTagName('body')[0];
body.innerHTML = `
<a-scene go="1" 
  fog="type: linear; color: #112; near: 20; far: 300"
  background="black" transparent="false" cursor="rayOrigin: mouse" stats>
  <a-assets></a-assets>

<a-sky color="#112" radius=3000></a-sky>
<a-entity light="type: ambient; color: #555"></a-entity>
<a-entity light="type:directional; color: #fff" position="1800 5000 1200"></a-entity>
<a-entity id='world'>
</a-entity>
<a-entity id=score position='0 2.4 -0.8'></a-entity>
<a-entity id='player'>
  <a-camera id="camera" position="0 1.6 0">
  </a-camera>
  <a-entity id="leftHand" hand-controls="hand: left; handModelStyle: lowPoly; color: #aaaaff">
  </a-entity>
  <a-entity id="rightHand" hand-controls="hand: right; handModelStyle: lowPoly; color: #aaaaff">
  </a-entity>
  </a-entity>

</a-scene>
`;
