import * as AFRAME from "aframe";

import { Critter } from "./critter";
import { Wall } from "./wall";

export class CritterSource {
  constructor(private wall: Wall) { }

  private makeFoot(x: number, y: number): AFRAME.Entity {
    const foot = document.createElement('a-cylinder');
    foot.setAttribute('radius', '0.01');
    foot.setAttribute('height', '0.01');
    foot.setAttribute('position', `${x} ${y} 0`)
    return foot;
  }

  private makeTurtle() {
    const container = document.createElement('a-entity');


    // <a-entity id='dog' rotation='90 0 0' position='0 2 -0.8'>
    // <a-box id='body' width=0.2 depth=0.08 height=0.01 position="0 0.02 0" >
    //   <a-cylinder id='foot_lh' height=0.01 radius=0.01 position= "0.07 -0.02  0.08" ></a-cylinder>
    //   <a-cylinder id='foot_lf' height=0.01 radius=0.01 position="-0.07 -0.02  0.08" ></a-cylinder>
    //   <a-cylinder id='foot_rf' height=0.01 radius=0.01 position="-0.07 -0.02 -0.08" ></a-cylinder>
    //   <a-cylinder id='foot_rh' height=0.01 radius=0.01 position= "0.07 -0.02 -0.08" ></a-cylinder>
    // </a-box>
    // </a-entity>



    const critter = new Critter(
      Critter.walkingGait, document.querySelector('#body'), this.wall);
    critter.addFoot(document.querySelector('#foot_lh'));
    critter.addFoot(document.querySelector('#foot_lf'));
    critter.addFoot(document.querySelector('#foot_rf'));
    critter.addFoot(document.querySelector('#foot_rh'));
    return critter;
  }

  tick(timeMs: number, timeDeltaMs: number) {
  }
}