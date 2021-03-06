import * as Tone from "tone";

export class PositronConfig {
  env: Tone.EnvelopeOptions;
  filterEnv: Tone.FrequencyEnvelopeOptions;
  osc1: Tone.ToneOscillatorType;
  osc2: Tone.ToneOscillatorType; // Oscilator shape
  osc2Detune: number;
  filter: BiquadFilterType;
  filterScale: number;
  filterQ: number = 0;
  noise: number;
  distortion: number;

  static patch808: PositronConfig = {
    env: {
      attack: 0.01, decay: 0.4, sustain: 0, release: 0.3,
      attackCurve: "exponential", releaseCurve: "exponential", decayCurve: "exponential",
      context: Tone.getContext(),
    },
    filterEnv: {
      attack: 0.01, decay: 0.2, sustain: 0, release: 0.2, baseFrequency: 'a1', octaves: 1.5,
      attackCurve: "exponential", releaseCurve: "exponential", decayCurve: "exponential",
      context: Tone.getContext(), exponent: 2,
    },
    osc1: "square",
    osc2: "sine",
    osc2Detune: 0.5,
    filter: "bandpass",
    filterScale: 1.0,
    noise: 0.2,
    distortion: 2.0,
    filterQ: 0,
  }

  static patchSaw: PositronConfig = {
    env: {
      attack: 0.1, decay: 0.1, sustain: 0.5, release: 0.5,
      attackCurve: "exponential", releaseCurve: "exponential", decayCurve: "exponential",
      context: Tone.getContext(),
    },
    filterEnv: {
      attack: 0, decay: 0, sustain: 0, release: 0, baseFrequency: 'a1', octaves: 0,
      attackCurve: "exponential", releaseCurve: "exponential", decayCurve: "exponential",
      context: Tone.getContext(), exponent: 2,
    },
    osc1: "sawtooth",
    osc2: "sawtooth",
    osc2Detune: 1.0,
    filter: "lowpass",
    filterScale: 32,  // 5 octaves
    noise: 0,
    distortion: 0,
    filterQ: 0,
  }

  static patchSoftBass: PositronConfig = PositronConfig.fromString(`
  {
    "filterQ": 3,
    "env": {
      "attack": 0.25000000000000006,
      "decay": 0.08,
      "sustain": 0.8800000000000006,
      "release": 0.19000000000000006,
      "attackCurve": "exponential",
      "releaseCurve": "exponential",
      "decayCurve": "exponential",
      "context": {}
    },
    "freqEnv": {
      "attack": 0,
      "decay": 0,
      "sustain": 0,
      "release": 0,
      "baseFrequency": "a1",
      "octaves": 0,
      "attackCurve": "exponential",
      "releaseCurve": "exponential",
      "decayCurve": "exponential",
      "context": {},
      "exponent": 2
    },
    "filterEnv": {
      "attack": 0.2,
      "decay": 0,
      "sustain": 1,
      "release": 1,
      "baseFrequency": "a1",
      "octaves": 5,
      "attackCurve": "exponential",
      "releaseCurve": "exponential",
      "decayCurve": "exponential",
      "context": {},
      "exponent": 2
    },
    "osc1": "triangle",
    "osc2": "sine",
    "osc2Detune": 0.5,
    "filter": "lowpass",
    "filterScale": 1,
    "noise": 0.02,
    "distortion": 0.02
  }  `);

  static patchPlucky = PositronConfig.fromString(`
  {
    "env": {
      "attack": 0.26000000000000006,
      "decay": 0.2699999999999999,
      "sustain": 0.48999999999999966,
      "release": 0.7800000000000002,
      "attackCurve": "exponential",
      "releaseCurve": "exponential",
      "decayCurve": "exponential",
      "context": {}
    },
    "freqEnv": {
      "attack": 0,
      "decay": 0,
      "sustain": 0,
      "release": 0,
      "baseFrequency": "a1",
      "octaves": 0,
      "attackCurve": "exponential",
      "releaseCurve": "exponential",
      "decayCurve": "exponential",
      "context": {},
      "exponent": 2
    },
    "filterEnv": {
      "attack": 0,
      "decay": 0.21999999999999997,
      "sustain": 0.1099999999999999,
      "release": 0.29000000000000004,
      "baseFrequency": "a1",
      "octaves": 6,
      "attackCurve": "exponential",
      "releaseCurve": "exponential",
      "decayCurve": "exponential",
      "context": {},
      "exponent": 2
    },
    "osc1": "sawtooth",
    "osc2": "square",
    "osc2Detune": 1,
    "filter": "lowpass",
    "filterScale": 1.7099999999999995,
    "noise": 0,
    "distortion": 0
  }
  `)

  static patchSynthLead = PositronConfig.fromString(`
  {
    "env": {
      "attack": 0.07,
      "decay": 1.0000000000000007,
      "sustain": 0.8000000000000003,
      "release": 1.640000000000001,
      "attackCurve": "exponential",
      "releaseCurve": "exponential",
      "decayCurve": "exponential",
      "context": {}
    },
    "freqEnv": {
      "attack": 0,
      "decay": 0,
      "sustain": 0,
      "release": 0,
      "baseFrequency": "a1",
      "octaves": 0,
      "attackCurve": "exponential",
      "releaseCurve": "exponential",
      "decayCurve": "exponential",
      "context": {},
      "exponent": 2
    },
    "filterEnv": {
      "attack": 0.6300000000000003,
      "decay": 1.270000000000001,
      "sustain": 0.26,
      "release": 0,
      "baseFrequency": "a1",
      "octaves": 0,
      "attackCurve": "exponential",
      "releaseCurve": "exponential",
      "decayCurve": "exponential",
      "context": {},
      "exponent": 2
    },
    "osc1": "sawtooth",
    "osc2": "sine",
    "osc2Detune": 2,
    "filter": "bandpass",
    "filterScale": 2.0599999999999987,
    "noise": 0,
    "distortion": 0
  }
  `);

  static patchPluckedGlass = PositronConfig.fromString(`
  {
    "filterQ": 2,
    "env": {
      "attack": 0.38000000000000017,
      "decay": 0.2800000000000001,
      "sustain": 0.6200000000000003,
      "release": 0.6600000000000005,
      "attackCurve": "exponential",
      "releaseCurve": "exponential",
      "decayCurve": "exponential",
      "context": {}
    },
    "freqEnv": {
      "attack": 0,
      "decay": 0,
      "sustain": 0,
      "release": 0,
      "baseFrequency": "a1",
      "octaves": 0,
      "attackCurve": "exponential",
      "releaseCurve": "exponential",
      "decayCurve": "exponential",
      "context": {},
      "exponent": 2
    },
    "filterEnv": {
      "attack": 0,
      "decay": 0.8000000000000005,
      "sustain": 0.15,
      "release": 0.7799999999999998,
      "baseFrequency": "a1",
      "octaves": 1.1900000000000632,
      "attackCurve": "exponential",
      "releaseCurve": "exponential",
      "decayCurve": "exponential",
      "context": {},
      "exponent": 2
    },
    "osc1": "triangle",
    "osc2": "sine",
    "osc2Detune": 0,
    "filter": "highpass",
    "filterScale": 0.9300000000000006,
    "noise": 0,
    "distortion": 0.1
  }`)

  static fromString(config: string) {
    const result = new PositronConfig();
    Object.assign(result, JSON.parse(config));
    result.env.context = Tone.getContext();
    result.filterEnv.context = Tone.getContext();
    return result;
  }
}

export class Positron {
  private env: Tone.Envelope;
  private filterEnv: Tone.FrequencyEnvelope;
  private filterScale: Tone.Scale;
  private osc1: Tone.Oscillator;
  private harmonic: Tone.Scale;
  private osc2: Tone.Oscillator;
  private filter: Tone.Filter;
  private noiseGain: Tone.Gain;
  private dist: Tone.Distortion;
  private lfo: Tone.LFO;
  private baseFrequency: Tone.Signal<'hertz'>;
  private volume: Tone.Gain;

  constructor(config: PositronConfig) {
    Tone.start();
    this.env = new Tone.Envelope(config.env);
    this.filterEnv = new Tone.FrequencyEnvelope(config.filterEnv);
    this.filterScale = new Tone.Scale(0, config.filterScale);

    this.baseFrequency = new Tone.Signal<'hertz'>(220, 'hertz');
    this.osc1 = new Tone.Oscillator(220, config.osc1).start();
    this.harmonic = new Tone.Scale(0, config.osc2Detune);
    this.baseFrequency.connect(this.osc1.frequency);
    this.baseFrequency.connect(this.harmonic);
    this.osc2 = new Tone.Oscillator(1000, config.osc2).start();
    const noise = new Tone.Noise("white").start();
    this.filter = new Tone.Filter(0, config.filter);
    const gainNode = new Tone.Gain(0);
    this.lfo = new Tone.LFO(2, 0, 1);
    this.lfo.start();
    this.lfo.type = 'triangle';
    const lfoScale = new Tone.Scale(0.5, 1);
    this.lfo.connect(lfoScale);
    const lfoGain = new Tone.Gain(1);
    lfoScale.connect(lfoGain.gain);

    this.noiseGain = new Tone.Gain(config.noise);
    this.dist = new Tone.Distortion(config.distortion);
    this.harmonic.connect(this.osc2.frequency);

    this.filterEnv.connect(this.filterScale);
    this.filterScale.connect(this.filter.frequency);
    this.env.connect(gainNode.gain);
    noise.connect(this.noiseGain);
    this.noiseGain.connect(this.filter);

    this.osc1.connect(this.filter);
    this.osc2.connect(this.filter);
    this.filter.connect(gainNode);
    gainNode.connect(lfoGain);
    lfoGain.connect(this.dist);

    this.volume = new Tone.Gain(1.0);

    this.dist.connect(this.volume);
    this.volume.toDestination();

    this.setConfig(config);
  }

  setVolume(volume: number) {
    this.volume.gain.setValueAtTime(volume, Tone.now());
  }

  private lastSync = -1;
  synchronize(bpm: number, audioTimeS: number) {
    if (audioTimeS > this.lastSync) {
      this.lastSync = audioTimeS;
      // * 4 for sixteeth notes.
      this.lfo.frequency.setValueAtTime(bpm / 60 * 4, audioTimeS);
      this.lfo.start(audioTimeS);
    }
  }

  setConfig(config: PositronConfig) {
    this.env.set(config.env);
    this.filterEnv.set(config.filterEnv);
    this.filterScale.max = config.filterScale;
    this.osc1.type = config.osc1;
    this.harmonic.max = config.osc2Detune;
    this.osc2.type = config.osc2;
    this.filter.type = config.filter;
    this.noiseGain.gain.setValueAtTime(config.noise, Tone.now());
    this.dist.distortion = config.distortion;
    this.filter.Q.setValueAtTime(config.filterQ, Tone.now());
  }

  triggerAttackRelease(note: string, duration: string, time: number) {
    time = time || Tone.now();
    this.baseFrequency.setValueAtTime(
      Tone.Frequency(note).toFrequency(), time);

    this.filterEnv.baseFrequency = note;
    this.env.triggerAttackRelease(duration, time);
    this.filterEnv.triggerAttackRelease(duration, time);
  }

  triggerAttack(note: string, time: number) {
    time = time || Tone.now();
    this.baseFrequency.setValueAtTime(
      Tone.Frequency(note).toFrequency(), time);
    this.filterEnv.baseFrequency = note;
    this.env.triggerAttack(time);
    this.filterEnv.triggerAttack(time);
  }

  triggerRelease(note: string, time: number) {
    time = time || Tone.now();
    this.filterEnv.baseFrequency = note;
    this.env.triggerRelease(time);
    this.filterEnv.triggerRelease(time);
  }
}