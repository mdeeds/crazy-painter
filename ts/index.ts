import * as AFRAME from "aframe";
import { Brush } from "./brush";
import { Debug } from "./debug";
import { EphemeralText } from "./ephemeralText";
import { Gait } from "./gait";
import { Score } from "./score";
import { Wall } from "./wall";

var brush = null;
var wall: Wall = null;
var gait: Gait = null;
var eText: EphemeralText = null;
var score: Score;

AFRAME.registerComponent("go", {
  init: async function () {
    Debug.init();
    eText = new EphemeralText(document.querySelector('a-scene'));
    eText.addText("Let's go!", 0, 1.5, -0.6);
    score = new Score(document.querySelector('#score'));

    wall = new Wall(eText, score);
    gait = new Gait(Gait.walkingGait, document.querySelector('#body'), wall);
    gait.addFoot(document.querySelector('#foot_lh'));
    gait.addFoot(document.querySelector('#foot_lf'));
    gait.addFoot(document.querySelector('#foot_rf'));
    gait.addFoot(document.querySelector('#foot_rh'));

    brush = new Brush(document.querySelector('#player'),
      document.querySelector('#leftHand').object3D,
      document.querySelector('#rightHand').object3D, wall);

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
    });
  },
  tick: function (timeMs: number, timeDeltaMs: number) {
    try {
      if (gait != null) {
        gait.setPositions(timeMs);
      }
      if (brush != null) {
        brush.tick(timeMs, timeDeltaMs);
      }
      if (eText != null) {
        eText.tick(timeMs, timeDeltaMs);
      }
    } catch (e) {
      Debug.set(`Tick error: ${e}`);
    }
  }
});

const body = document.getElementsByTagName('body')[0];
body.innerHTML = `
<a-scene go="1" 
  fog="type: linear; color: #112; near: 20; far: 300"
  background="black" transparent="false" cursor="rayOrigin: mouse" stats>
  <a-assets>
  </a-assets>

<a-sky color="#112" radius=3000></a-sky>
<a-entity light="type: ambient; color: #222"></a-entity>
<a-entity light="type:directional; color: #777" position="1800 5000 1200"></a-entity>
<a-entity id='world'>
  <a-entity id='dog' rotation='90 0 0' position='0 2 -0.8'>
    <a-box id='body' width=0.2 depth=0.08 height=0.01 position="0 0.02 0" >
      <a-cylinder id='foot_lh' height=0.01 radius=0.01 position= "0.07 -0.02  0.08" ></a-cylinder>
      <a-cylinder id='foot_lf' height=0.01 radius=0.01 position="-0.07 -0.02  0.08" ></a-cylinder>
      <a-cylinder id='foot_rf' height=0.01 radius=0.01 position="-0.07 -0.02 -0.08" ></a-cylinder>
      <a-cylinder id='foot_rh' height=0.01 radius=0.01 position= "0.07 -0.02 -0.08" ></a-cylinder>
    </a-box>
    </a-entity>
</a-entity>
<a-entity id=score position='0 2.4 -0.8'></a-entity>
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
