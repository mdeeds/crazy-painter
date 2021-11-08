import * as Tone from "tone";
import { Positron, PositronConfig } from "./positron";

export class SFX {
  private pointSounds: Positron[] = [];
  private synth: Tone.AMSynth;
  private constructor(pointConfig: PositronConfig) {
    for (let i = 0; i < 6; ++i) {
      const p = new Positron(pointConfig);
      p.setVolume(0.05);
      this.pointSounds.push(p);
    }
  }

  private static singleton: SFX = null;

  private static waitForContext(callback: () => void) {
    const AudioContext = window.AudioContext;
    const audioCtx = new AudioContext();
    if (audioCtx.state === 'running') {
      callback();
    } else {
      setTimeout(() => { this.waitForContext(callback); }, 500);
    }
  }

  static async make(): Promise<SFX> {
    if (SFX.singleton) { return SFX.singleton; }

    return new Promise<SFX>((resolve, reject) => {
      SFX.waitForContext(async () => {
        console.log('starting...');
        await Tone.start();
        console.log('started.');
        SFX.singleton = new SFX(PositronConfig.patchPlucky);
        SFX.singleton.synth = new Tone.AMSynth().toDestination();
        SFX.singleton.synth.triggerAttackRelease("C4", "8n");
        resolve(SFX.singleton);
      });
    });
  }

  private pointTones = ['C5', 'C5', 'A5', 'G5', 'E5', 'G5', 'C6', 'A5', 'C5', 'C5', 'A5', 'G5', 'C5', 'E5'];
  private pointIndex = 0;
  point() {
    this.pointSounds[this.pointIndex % this.pointSounds.length].triggerAttackRelease(
      this.pointTones[this.pointIndex], '8n', null);
    this.pointIndex = (this.pointIndex + 1) % this.pointTones.length;
  }

  minusPoint() {
    const notes = [
      'C3', 'C3', 'B2'
    ];
    let t = Tone.now();
    for (const n of notes) {
      SFX.singleton.synth.triggerAttackRelease(n, 0.4, t);
      t += 0.050;
    }
  }

  complete() {
    const notes = [
      'A4', 'C5', 'E5', 'G5',
      'Bb4', 'Db5', 'F5', 'Ab5',
      'B4', 'D5', 'F#5', 'A5',
      'C5', 'E5', 'G5', 'B5', 'C6'
    ];
    let t = Tone.now();
    for (const n of notes) {
      SFX.singleton.synth.triggerAttackRelease(n, 0.4, t);
      t += 0.050;
    }
  }
}