import * as AFRAME from "aframe";
import { Feet } from "./feet";
import { Foot } from "./foot";
import { Pod } from "./pod";

export class Gait {
  public static walkingGait = [[9, 7], [1, 7, 8]];

  private footEntities: AFRAME.Entity[] = [];
  private feet: Feet;
  constructor(private gaitDescriptor: number[][],
    body: AFRAME.Entity) {
    this.feet = new Feet(0.3, 600, body);
  }

  addFoot(entity: AFRAME.Entity) {
    this.footEntities.push(entity);
    const i = this.footEntities.length % this.gaitDescriptor.length;
    this.feet.add(new Foot(new Pod(this.gaitDescriptor[i]), entity));
  }

  setPositions(timeMs: number) {
    this.feet.setPositions(timeMs);
  }
};


// function scamper() {
//   // #########.......
//   // #.......########
//   // .#########......
//   // .......#########  
//   feet = new Feet(0.30, 600, document.querySelector('#body'));
//   feet.add(new Foot(
//     new Pod([9, 7]), document.querySelector('#foot1')));
//   feet.add(new Foot(
//     new Pod([1, 7, 8]), document.querySelector('#foot2')));
//   feet.add(new Foot(
//     new Pod([0, 9, 6]), document.querySelector('#foot3')));
//   feet.add(new Foot(
//     new Pod([0, 7, 9]), document.querySelector('#foot4')));
// }

// function stomp() {
//   // ####.#####
//   // #########.
//   feet = new Feet(0.30, 600, document.querySelector('#body'));
//   feet.add(new Foot(
//     new Pod([4, 1, 5]), document.querySelector('#foot1')));
//   feet.add(new Foot(
//     new Pod([9, 1]), document.querySelector('#foot2')));
//   feet.add(new Foot(
//     new Pod([4, 1, 5]), document.querySelector('#foot3')));
//   feet.add(new Foot(
//     new Pod([9, 1]), document.querySelector('#foot4')));
// }

// function frogWalk() {
//   // ####.#####
//   // .#######..
//   feet = new Feet(0.30, 600, document.querySelector('#body'));
//   feet.add(new Foot(
//     new Pod([4, 1, 5]), document.querySelector('#foot1')));
//   feet.add(new Foot(
//     new Pod([0, 1, 7, 2]), document.querySelector('#foot2')));
//   feet.add(new Foot(
//     new Pod([9, 1]), document.querySelector('#foot3')));
//   feet.add(new Foot(
//     new Pod([4, 1, 5]), document.querySelector('#foot4')));
// }

// // function run() {
// //   // ##....
// //   // ...##.
// //   feet.push(new Foot(
// //     new Pod([2, 4]), document.querySelector('#foot1')));
// //   feet.push(new Foot(
// //     new Pod([0, 3, 2, 1]), document.querySelector('#foot2')));
// // }

// // function skip() {
// //   // ##....
// //   // .##...
// //   feet.push(new Foot(
// //     new Pod([2, 4]), document.querySelector('#foot1')));
// //   feet.push(new Foot(
// //     new Pod([0, 1, 2, 3]), document.querySelector('#foot2')));
// // }

// // function amble() {
// //   // ##..
// //   // .##.
// //   // #..#
// //   // ..##
// //   feet.push(new Foot(
// //     new Pod([2, 2]), document.querySelector('#foot1')));
// //   feet.push(new Foot(
// //     new Pod([0, 1, 2, 1]), document.querySelector('#foot2')));
// //   feet.push(new Foot(
// //     new Pod([1, 2, 1]), document.querySelector('#foot3')));
// //   feet.push(new Foot(
// //     new Pod([0, 2, 2]), document.querySelector('#foot4')));
// // }

// function lizardTrot() {
//   feet = new Feet(0.15, 600, document.querySelector('#body'));
//   // https://www.researchgate.net/figure/Hildebrand-style-gait-diagrams-A-and-B-and-axial-skeleton-displacement-patterns-C-and_fig3_236460049
//   // LH ###########.........
//   // LF ##........##########
//   // RF ###########........#
//   // RH .........###########
//   feet.add(new Foot(
//     new Pod([11, 9]), document.querySelector('#foot1')));
//   feet.add(new Foot(
//     new Pod([2, 9, 9]), document.querySelector('#foot2')));
//   feet.add(new Foot(
//     new Pod([11, 8, 1]), document.querySelector('#foot3')));
//   feet.add(new Foot(
//     new Pod([0, 9, 11]), document.querySelector('#foot4')));
// }

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
