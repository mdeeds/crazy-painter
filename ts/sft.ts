import * as Tone from "tone";
import { Positron, PositronConfig } from "./positron";

export class SFX {
  private pointTones = ['E4', 'G4', 'A4', 'C5', 'E5']
  private pointSounds: Positron[] = [];
  private constructor(pointConfig: PositronConfig) {
    for (const note of this.pointTones) {
      const p = new Positron(pointConfig);
      p.setVolume(0.05);
      this.pointSounds.push(p);
    }
  }

  private static singleton: SFX = null;
  static async make(): Promise<SFX> {
    if (SFX.singleton) { return SFX.singleton; }
    return new Promise<SFX>((resolve, reject) => {
      document.querySelector('body').addEventListener('pointerdown',
        async () => {
          if (SFX.singleton) { resolve(SFX.singleton); return; }
          console.log('starting...');
          await Tone.start();
          const synth = new Tone.Synth().toDestination();
          //play a middle 'C' for the duration of an 8th note
          synth.triggerAttackRelease("C4", "8n");
          console.log('started.');
          SFX.singleton = new SFX(PositronConfig.patchPlucky);
          resolve(SFX.singleton);
        });
    });
  }

  point() {
    const i = Math.trunc(Math.random() * this.pointTones.length);
    this.pointSounds[i].triggerAttackRelease(
      this.pointTones[i], '8n', null);
  }
}