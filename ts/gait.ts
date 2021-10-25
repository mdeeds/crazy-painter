import * as AFRAME from "aframe";
import { Feet } from "./feet";
import { Foot } from "./foot";
import { Pod } from "./pod";
import { Wall } from "./wall";



var feet: Feet = null;
var dogObject = null;

function walk() {
  // #########.......
  // #.......########
  // #########.......
  // #.......########  
  feet = new Feet(0.30, 600, document.querySelector('#body'));
  feet.add(new Foot(
    new Pod([9, 7]), document.querySelector('#foot1')));
  feet.add(new Foot(
    new Pod([1, 7, 8]), document.querySelector('#foot2')));
  feet.add(new Foot(
    new Pod([9, 7]), document.querySelector('#foot3')));
  feet.add(new Foot(
    new Pod([1, 7, 8]), document.querySelector('#foot4')));
}

function scamper() {
  // #########.......
  // #.......########
  // .#########......
  // .......#########  
  feet = new Feet(0.30, 600, document.querySelector('#body'));
  feet.add(new Foot(
    new Pod([9, 7]), document.querySelector('#foot1')));
  feet.add(new Foot(
    new Pod([1, 7, 8]), document.querySelector('#foot2')));
  feet.add(new Foot(
    new Pod([0, 9, 6]), document.querySelector('#foot3')));
  feet.add(new Foot(
    new Pod([0, 7, 9]), document.querySelector('#foot4')));
}

function stomp() {
  // ####.#####
  // #########.
  feet = new Feet(0.30, 600, document.querySelector('#body'));
  feet.add(new Foot(
    new Pod([4, 1, 5]), document.querySelector('#foot1')));
  feet.add(new Foot(
    new Pod([9, 1]), document.querySelector('#foot2')));
  feet.add(new Foot(
    new Pod([4, 1, 5]), document.querySelector('#foot3')));
  feet.add(new Foot(
    new Pod([9, 1]), document.querySelector('#foot4')));
}

function frogWalk() {
  // ####.#####
  // .#######..
  feet = new Feet(0.30, 600, document.querySelector('#body'));
  feet.add(new Foot(
    new Pod([4, 1, 5]), document.querySelector('#foot1')));
  feet.add(new Foot(
    new Pod([0, 1, 7, 2]), document.querySelector('#foot2')));
  feet.add(new Foot(
    new Pod([9, 1]), document.querySelector('#foot3')));
  feet.add(new Foot(
    new Pod([4, 1, 5]), document.querySelector('#foot4')));
}

// function run() {
//   // ##....
//   // ...##.
//   feet.push(new Foot(
//     new Pod([2, 4]), document.querySelector('#foot1')));
//   feet.push(new Foot(
//     new Pod([0, 3, 2, 1]), document.querySelector('#foot2')));
// }

// function skip() {
//   // ##....
//   // .##...
//   feet.push(new Foot(
//     new Pod([2, 4]), document.querySelector('#foot1')));
//   feet.push(new Foot(
//     new Pod([0, 1, 2, 3]), document.querySelector('#foot2')));
// }

// function amble() {
//   // ##..
//   // .##.
//   // #..#
//   // ..##
//   feet.push(new Foot(
//     new Pod([2, 2]), document.querySelector('#foot1')));
//   feet.push(new Foot(
//     new Pod([0, 1, 2, 1]), document.querySelector('#foot2')));
//   feet.push(new Foot(
//     new Pod([1, 2, 1]), document.querySelector('#foot3')));
//   feet.push(new Foot(
//     new Pod([0, 2, 2]), document.querySelector('#foot4')));
// }

function lizardTrot() {
  feet = new Feet(0.15, 600, document.querySelector('#body'));
  // https://www.researchgate.net/figure/Hildebrand-style-gait-diagrams-A-and-B-and-axial-skeleton-displacement-patterns-C-and_fig3_236460049
  // LH ###########.........
  // LF ##........##########
  // RF ###########........#
  // RH .........###########
  feet.add(new Foot(
    new Pod([11, 9]), document.querySelector('#foot1')));
  feet.add(new Foot(
    new Pod([2, 9, 9]), document.querySelector('#foot2')));
  feet.add(new Foot(
    new Pod([11, 8, 1]), document.querySelector('#foot3')));
  feet.add(new Foot(
    new Pod([0, 9, 11]), document.querySelector('#foot4')));
}

// function trot() {
//   // ##..
//   // ..##
//   // ..##
//   // ##..
//   feet.push(new Foot(
//     new Pod([2, 2]), document.querySelector('#foot1')));
//   feet.push(new Foot(
//     new Pod([0, 2, 2]), document.querySelector('#foot2')));
//   feet.push(new Foot(
//     new Pod([0, 2, 2]), document.querySelector('#foot3')));
//   feet.push(new Foot(
//     new Pod([2, 2]), document.querySelector('#foot4')));
// }

// function bound() {
//   // ...#
//   // ...#
//   // ###.
//   // ###.
//   feet.push(new Foot(
//     new Pod([0, 3, 1]), document.querySelector('#foot1')));
//   feet.push(new Foot(
//     new Pod([0, 3, 1]), document.querySelector('#foot2')));
//   feet.push(new Foot(
//     new Pod([3, 1]), document.querySelector('#foot3')));
//   feet.push(new Foot(
//     new Pod([3, 1]), document.querySelector('#foot4')));
// }


var leftHand = null;
var leftBrush;
var rightHand;
var rightBrush;

var leftMinusRight = new AFRAME.THREE.Vector3();

var clamp = function (vec: any) {
  if (vec.y < 0) {
    vec.y = 0;
  }
  if (vec.z < -2) {
    vec.z = -2;
  }
}

var wall: Wall = null;

AFRAME.registerComponent("go", {
  init: async function () {
    wall = new Wall();
    stomp();
    dogObject = document.querySelector('#dog').object3D;
    leftHand = document.querySelector('#leftHand').object3D;
    leftBrush = document.querySelector('#leftBrush').object3D;
    rightHand = document.querySelector('#rightHand').object3D;
    rightBrush = document.querySelector('#rightBrush').object3D;
  },
  tick: function (timeMs, timeDeltaMs) {
    if (feet != null) {
      feet.setPositions(timeMs);
    }
    if (leftHand != null) {
      leftMinusRight.copy(leftHand.position);
      leftMinusRight.sub(rightHand.position);
      leftMinusRight.multiplyScalar(3);
      leftBrush.position.copy(leftHand.position);
      leftBrush.position.add(leftMinusRight);
      rightBrush.position.copy(rightHand.position);
      rightBrush.position.sub(leftMinusRight);
      clamp(leftBrush.position);
      clamp(rightBrush.position);
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
  <a-entity id='dog'>
    <a-box id='body' width=0.2 depth=0.08 height=0.01 position="0 1.5 -1" >
      <a-cylinder id='foot1' height=0.01 radius=0.01 position= "0.07 -0.02  0.08" ></a-cylinder>
      <a-cylinder id='foot2' height=0.01 radius=0.01 position="-0.07 -0.02  0.08" ></a-cylinder>
      <a-cylinder id='foot3' height=0.01 radius=0.01 position="-0.07 -0.02 -0.08" ></a-cylinder>
      <a-cylinder id='foot4' height=0.01 radius=0.01 position= "0.07 -0.02 -0.08" ></a-cylinder>
    </a-box>
    </a-entity>
</a-entity>
<a-entity id='player'>
  <a-camera id="camera" position="0 1.6 0">
    <a-entity light="type:point; intensity: 0.1; distance: 4; decay: 2" position="0 0.1 -0.1">
  </a-camera>
  <a-entity id="leftHand" hand-controls="hand: left; handModelStyle: lowPoly; color: #ffcccc">
  </a-entity>
  <a-sphere id="leftBrush" radius=0.05> </a-sphere>
  <a-entity id="rightHand" hand-controls="hand: right; handModelStyle: lowPoly; color: #ffcccc">
  </a-entity>
  <a-sphere id="rightBrush" radius=0.05> </a-sphere>
  </a-entity>

</a-scene>
`;
