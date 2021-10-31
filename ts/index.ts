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

var brush = null;
var wall: Wall = null;
var critters: CritterSource = null;
var eText: EphemeralText = null;
var score: Score;
var cans: Can[] = [];

AFRAME.registerComponent("go", {
  init: async function () {
    Debug.init();
    const scene = document.querySelector('a-scene');
    const assetLibrary = new AssetLibrary(document.querySelector('a-assets'));
    eText = new EphemeralText(scene);
    eText.addText("Let's go!", 0, 1.5, -0.6);
    score = new Score(document.querySelector('#score'));

    wall = new Wall(eText, score);
    critters = new CritterSource(wall, assetLibrary);

    brush = new Brush(document.querySelector('#player'),
      document.querySelector('#leftHand').object3D,
      document.querySelector('#rightHand').object3D, wall);

    const canEntity = document.createElement('a-entity');
    canEntity.setAttribute('position', '-0.5 0 -0.2');
    scene.appendChild(canEntity);
    const can = new Can(canEntity, brush.getBrushes(), assetLibrary);
    cans.push(can);

    const body = document.querySelector('body');
    body.addEventListener('keydown', (ev: KeyboardEvent) => {
      let dy = 0;
      let dx = 0;
      let dz = 0;
      switch (ev.code) {
        case "KeyI": dy = 0.1; break;
        case "KeyK": dy = -0.1; break;
        case "KeyJ": dx = -0.1; break;
        case "KeyL": dx = 0.1; break;
        case "KeyU": dz = -0.1; break;
        case "KeyO": dz = 0.1; break;
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
      if (eText != null) {
        eText.tick(timeMs, timeDeltaMs);
      }
      for (const can of cans) {
        can.tick(timeMs, timeDeltaMs);
      }
    } catch (e) {
      Debug.set(`Tick error: ${e}`);
      const url = new URL(document.URL);
      if (url.searchParams.get('throw')) {
        throw e;
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
<a-entity light="type: ambient; color: #222"></a-entity>
<a-entity light="type:directional; color: #777" position="1800 5000 1200"></a-entity>
<a-entity id='world'>
</a-entity>
<a-entity id=score position='0 2.4 -0.8'></a-entity>
<a-box width=20 height=0.2 depth=0.03 position='0 0.1 -0.6'></a-box> 
<a-box width=20 height=0.2 depth=0.03 position='0 2.5 -0.6'></a-box> 
<a-box width=9 height=2.2 depth=0.03 position='-5.5 1.3 -0.6'></a-box> 
<a-box width=9 height=2.2 depth=0.03 position=' 5.5 1.3 -0.6'></a-box> 

<a-entity id='player'>
  <a-camera id="camera" position="0 1.6 0">
    <a-entity light="type:point; intensity: 0.1; distance: 4; decay: 2" position="0 0.1 -0.1">
  </a-camera>
  <a-entity id="leftHand" hand-controls="hand: left; handModelStyle: lowPoly; color: #aaaaff">
  </a-entity>
  <a-entity id="rightHand" hand-controls="hand: right; handModelStyle: lowPoly; color: #aaaaff">
  </a-entity>
  </a-entity>

</a-scene>
`;
