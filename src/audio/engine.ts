import type { PatchId } from '../domain/types';
import { BELL_PARTIALS, PATCHES, patchCycleLength, stepTime, type NoteEvent, type Patch, type Voice } from './patches';
import { generateImpulse } from './impulse';

export interface AudioState { playingKey: string | null; muted: boolean; supported: boolean }
interface Session { token: number; key: string; patch: Patch; gain: GainNode; send: GainNode | null; timer: number; cycleStart: number; nextStep: number; nextTime: number; }

const listeners = new Set<() => void>();
let state: AudioState = { playingKey: null, muted: false, supported: Boolean(contextConstructor()) };
let context: AudioContext | null = null;
let master: GainNode | null = null;
let analyser: AnalyserNode | null = null;
let reverb: ConvolverNode | null = null;
let impulseBuffer: AudioBuffer | null = null;
let session: Session | null = null;
let sessionToken = 0;
let noiseBuffer: AudioBuffer | null = null;
let distortion: WaveShaperNode | null = null;

function notify(): void { for (const listener of listeners) listener(); }
function updateState(next: Partial<AudioState>): void { state = { ...state, ...next }; notify(); }
function contextConstructor(): typeof AudioContext | undefined {
  if (typeof window === 'undefined') return undefined;
  return window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
}
function setPlaying(key: string | null): void { if (state.playingKey !== key) updateState({ playingKey: key }); }

function createGraph(): AudioContext | null {
  if (context) return context;
  const Constructor = contextConstructor();
  if (!Constructor) { if (state.supported) updateState({ supported: false }); return null; }
  context = new Constructor();
  master = context.createGain(); master.gain.value = state.muted ? 0.0001 : 0.7;
  const compressor = context.createDynamicsCompressor(); compressor.threshold.value = -10; compressor.knee.value = 12; compressor.ratio.value = 8;
  analyser = context.createAnalyser(); analyser.fftSize = 128; analyser.smoothingTimeConstant = 0.78;
  master.connect(compressor).connect(analyser).connect(context.destination);
  if (typeof context.createConvolver === 'function') {
    reverb = context.createConvolver();
    if (!impulseBuffer || impulseBuffer.sampleRate !== context.sampleRate) {
      const [left, right] = generateImpulse(2.2, context.sampleRate);
      impulseBuffer = context.createBuffer(2, left.length, context.sampleRate);
      impulseBuffer.getChannelData(0).set(left);
      impulseBuffer.getChannelData(1).set(right);
    }
    reverb.buffer = impulseBuffer;
    reverb.connect(master);
  }
  if (!state.supported) updateState({ supported: true });
  return context;
}

function midiFrequency(midi: number): number { return 440 * Math.pow(2, (midi - 69) / 12); }
export function eventTime(cycleStart: number, step: number, patch: Patch): number { return cycleStart + stepTime(step, patch); }
function envelope(node: GainNode, when: number, attack: number, release: number, peak: number): void {
  const safePeak = Math.max(0.0001, peak);
  node.gain.setValueAtTime(0.0001, when);
  node.gain.exponentialRampToValueAtTime(safePeak, when + attack);
  node.gain.exponentialRampToValueAtTime(0.0001, when + Math.max(attack + 0.01, release));
}
function connectOscillator(osc: OscillatorNode, voiceGain: GainNode, when: number, end: number, peak: number, attack: number): void {
  envelope(voiceGain, when, attack, end - when, peak);
  osc.start(when);
  osc.stop(end + 0.03);
  osc.onended = () => { osc.disconnect(); voiceGain.disconnect(); };
}
function getNoiseBuffer(ctx: AudioContext): AudioBuffer {
  if (noiseBuffer && noiseBuffer.sampleRate === ctx.sampleRate) return noiseBuffer;
  noiseBuffer = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
  const data = noiseBuffer.getChannelData(0);
  for (let i = 0; i < data.length; i += 1) data[i] = Math.random() * 2 - 1;
  return noiseBuffer;
}
function getDistortion(ctx: AudioContext): WaveShaperNode {
  if (distortion) return distortion;
  distortion = ctx.createWaveShaper();
  const curve = new Float32Array(256);
  for (let i = 0; i < curve.length; i += 1) { const x = (i * 2) / curve.length - 1; curve[i] = Math.tanh(x * 4); }
  distortion.curve = curve; distortion.oversample = '2x';
  return distortion;
}

function scheduleOsc(ctx: AudioContext, parent: GainNode, event: NoteEvent, when: number, stepSeconds: number, type: OscillatorType, peak: number, attack: number, detune = 0, filter?: BiquadFilterType): void {
  if (event.midi === undefined) return;
  const osc = ctx.createOscillator(); osc.type = type; osc.frequency.value = midiFrequency(event.midi); osc.detune.value = detune;
  const gain = ctx.createGain(); gain.gain.value = 0.0001;
  if (filter) { const filterNode = ctx.createBiquadFilter(); filterNode.type = filter; filterNode.frequency.value = type === 'sawtooth' ? 2800 : 4200; osc.connect(filterNode); filterNode.connect(gain); }
  else osc.connect(gain);
  const end = when + Math.max(0.06, event.durSteps * stepSeconds);
  gain.connect(parent); connectOscillator(osc, gain, when, end, peak * event.vel, attack);
}

function scheduleFrequencyOsc(ctx: AudioContext, parent: GainNode, when: number, end: number, frequency: number, type: OscillatorType, peak: number, attack: number, detune = 0, filter?: BiquadFilterType, filterFrequency = 4200): OscillatorNode {
  const osc = ctx.createOscillator(); osc.type = type; osc.frequency.value = frequency; osc.detune.value = detune;
  const gain = ctx.createGain(); gain.gain.value = 0.0001;
  if (filter) { const filterNode = ctx.createBiquadFilter(); filterNode.type = filter; filterNode.frequency.value = filterFrequency; osc.connect(filterNode); filterNode.connect(gain); }
  else osc.connect(gain);
  gain.connect(parent); connectOscillator(osc, gain, when, end, peak, attack);
  return osc;
}

function scheduleBoneFlute(ctx: AudioContext, parent: GainNode, event: NoteEvent, when: number, stepSeconds: number): void {
  if (event.midi === undefined) return;
  const end = when + Math.max(0.18, event.durSteps * stepSeconds);
  const frequency = midiFrequency(event.midi);
  const base = scheduleFrequencyOsc(ctx, parent, when, end, frequency, 'sine', 0.2 * event.vel, 0.06, -30);
  base.detune.setValueAtTime(-30, when); base.detune.linearRampToValueAtTime(0, when + 0.06);
  const second = scheduleFrequencyOsc(ctx, parent, when, end, frequency * 2, 'sine', 0.07 * event.vel, 0.06, -18);
  const third = scheduleFrequencyOsc(ctx, parent, when, end, frequency * 3, 'triangle', 0.045 * event.vel, 0.06, -12);
  const depth = ctx.createGain(); depth.gain.value = 15;
  const lfo = ctx.createOscillator(); lfo.type = 'sine'; lfo.frequency.value = 5; lfo.connect(depth); depth.connect(base.detune); depth.connect(second.detune); depth.connect(third.detune);
  const baseEnded = base.onended;
  base.onended = () => { baseEnded?.call(base, new Event('ended')); depth.disconnect(base.detune); depth.disconnect(second.detune); depth.disconnect(third.detune); };
  lfo.start(when); lfo.stop(end + 0.03); lfo.onended = () => lfo.disconnect();
  scheduleNoise(ctx, parent, event, when, stepSeconds, false, Math.min(0.22, end - when));
}

function scheduleBronzeBell(ctx: AudioContext, parent: GainNode, event: NoteEvent, when: number): void {
  if (event.midi === undefined) return;
  const fundamental = midiFrequency(event.midi);
  BELL_PARTIALS.forEach((partial, index) => {
    const end = when + 2.5 / (1 + index * 0.5);
    const detunes = index === 0 ? [-3, 3] : [0];
    detunes.forEach((detune) => scheduleFrequencyOsc(ctx, parent, when, end, fundamental * partial, 'sine', (0.16 / (index + 1)) * event.vel, 0.003, detune));
  });
  scheduleNoise(ctx, parent, event, when, 0, false, 0.06);
}

function scheduleStringPluck(ctx: AudioContext, parent: GainNode, event: NoteEvent, when: number, duration: number, resonance: number): void {
  if (event.midi === undefined) return;
  const end = when + duration;
  const frequency = midiFrequency(event.midi);
  scheduleNoise(ctx, parent, event, when, 0, false, 0.008);
  scheduleFrequencyOsc(ctx, parent, when, end, frequency, 'triangle', 0.18 * event.vel, 0.002, 0, 'bandpass', resonance);
  scheduleFrequencyOsc(ctx, parent, when, end, frequency * 2, 'triangle', 0.07 * event.vel, 0.002, 0, 'bandpass', resonance);
  scheduleFrequencyOsc(ctx, parent, when, end, frequency * 3, 'triangle', 0.04 * event.vel, 0.002, 0, 'bandpass', resonance);
}

function scheduleOrgan(ctx: AudioContext, parent: GainNode, event: NoteEvent, when: number, stepSeconds: number): void {
  if (event.midi === undefined) return;
  const end = when + Math.max(0.2, event.durSteps * stepSeconds);
  const frequency = midiFrequency(event.midi);
  scheduleFrequencyOsc(ctx, parent, when, end, frequency, 'sine', 0.14 * event.vel, 0.05, -6, 'lowpass', 2200);
  scheduleFrequencyOsc(ctx, parent, when, end, frequency * 2, 'sine', 0.1 * event.vel, 0.05, 0, 'lowpass', 2200);
  scheduleFrequencyOsc(ctx, parent, when, end, frequency * 3, 'sine', 0.06 * event.vel, 0.05, 6, 'lowpass', 2200);
}

function scheduleFrameDrum(ctx: AudioContext, parent: GainNode, event: NoteEvent, when: number, stepSeconds: number): void {
  const end = when + Math.max(0.12, event.durSteps * stepSeconds);
  const osc = ctx.createOscillator(); osc.type = 'sine'; osc.frequency.setValueAtTime(140, when); osc.frequency.exponentialRampToValueAtTime(60, end);
  const gain = ctx.createGain(); gain.connect(parent); connectOscillator(osc, gain, when, end, 0.3 * event.vel, 0.002);
  scheduleNoise(ctx, parent, event, when, stepSeconds, false, Math.min(0.08, end - when));
}

function scheduleNoise(ctx: AudioContext, parent: GainNode, event: NoteEvent, when: number, stepSeconds: number, high: boolean, duration?: number): void {
  const source = ctx.createBufferSource(); source.buffer = getNoiseBuffer(ctx);
  const filter = ctx.createBiquadFilter(); filter.type = high ? 'highpass' : 'bandpass'; filter.frequency.value = high ? 6500 : 1800;
  const gain = ctx.createGain(); const end = when + Math.max(0.04, duration ?? event.durSteps * stepSeconds); gain.connect(parent); source.connect(filter); filter.connect(gain);
  envelope(gain, when, 0.002, end - when, 0.16 * event.vel); source.start(when); source.stop(end); source.onended = () => { source.disconnect(); filter.disconnect(); gain.disconnect(); };
}

function scheduleVoice(ctx: AudioContext, parent: GainNode, event: NoteEvent, when: number, stepSeconds: number, voice: Voice): void {
  const end = when + Math.max(0.06, event.durSteps * stepSeconds);
  if (voice === 'boneFlute') { scheduleBoneFlute(ctx, parent, event, when, stepSeconds); return; }
  if (voice === 'bronzeBell') { scheduleBronzeBell(ctx, parent, event, when); return; }
  if (voice === 'lyre') { scheduleStringPluck(ctx, parent, event, when, 1.2, 800); return; }
  if (voice === 'ud') { scheduleStringPluck(ctx, parent, event, when, 0.5, 1100); return; }
  if (voice === 'organ') { scheduleOrgan(ctx, parent, event, when, stepSeconds); return; }
  if (voice === 'frameDrum') { scheduleFrameDrum(ctx, parent, event, when, stepSeconds); return; }
  if (voice === 'kick') {
    const osc = ctx.createOscillator(); const gain = ctx.createGain(); osc.type = 'sine'; osc.frequency.setValueAtTime(150, when); osc.frequency.exponentialRampToValueAtTime(45, end); gain.connect(parent); connectOscillator(osc, gain, when, end, 0.72 * event.vel, 0.002); return;
  }
  if (voice === 'snare' || voice === 'hat') { scheduleNoise(ctx, parent, event, when, stepSeconds, voice === 'hat'); return; }
  if (voice === 'djembeLow' || voice === 'djembeHigh' || voice === 'bell') {
    if (voice === 'bell') scheduleOsc(ctx, parent, event, when, stepSeconds, 'sine', 0.3, 0.002, 0);
    else scheduleNoise(ctx, parent, event, when, stepSeconds, voice === 'djembeHigh');
    return;
  }
  if (voice === 'strings') {
    scheduleOsc(ctx, parent, event, when, stepSeconds, 'sawtooth', 0.16, 0.08, -7, 'lowpass');
    scheduleOsc(ctx, parent, event, when, stepSeconds, 'sawtooth', 0.13, 0.08, 7, 'lowpass'); return;
  }
  if (voice === 'distGuitar') {
    const distorted = getDistortion(ctx); const osc = ctx.createOscillator(); const gain = ctx.createGain(); osc.type = 'sawtooth'; osc.frequency.value = midiFrequency(event.midi ?? 40); gain.connect(distorted).connect(parent); const endTime = when + Math.max(0.08, event.durSteps * stepSeconds); connectOscillator(osc, gain, when, endTime, 0.2 * event.vel, 0.004); return;
  }
  if (voice === 'synthPulse') {
    scheduleOsc(ctx, parent, event, when, stepSeconds, 'square', 0.13, 0.003, 0, 'lowpass'); return;
  }
  const type: OscillatorType = voice === 'harpsichord' ? 'sawtooth' : voice === 'pluck' ? 'triangle' : voice === 'drone' ? 'sine' : voice === 'bass' ? 'triangle' : 'sine';
  const attack = voice === 'drone' ? 0.18 : 0.004;
  scheduleOsc(ctx, parent, event, when, stepSeconds, type, voice === 'bass' ? 0.18 : 0.2, attack, 0, voice === 'harpsichord' ? 'highpass' : undefined);
}

function fadeSession(old: Session | null): void {
  if (!old || !context) return;
  window.clearInterval(old.timer);
  const now = context.currentTime;
  old.gain.gain.cancelScheduledValues(now); old.gain.gain.setValueAtTime(Math.max(0.0001, old.gain.gain.value), now); old.gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.03);
  window.setTimeout(() => { old.gain.disconnect(); old.send?.disconnect(); }, 50);
}

function scheduler(active: Session): void {
  if (!context || !master || active.token !== sessionToken) return;
  const now = context.currentTime; const lookAhead = now + 0.12; const stepSeconds = 60 / active.patch.bpm / active.patch.stepsPerBeat; const length = patchCycleLength(active.patch); const cycleSeconds = 60 / active.patch.bpm * active.patch.beatsPerBar * active.patch.bars;
  while (active.nextTime < lookAhead) {
    const when = eventTime(active.cycleStart, active.nextStep, active.patch);
    for (const event of active.patch.events) if (event.step === active.nextStep) scheduleVoice(context, active.gain, event, when, stepSeconds, event.voice);
    active.nextStep += 1;
    if (active.nextStep >= length) { active.nextStep = 0; active.cycleStart += cycleSeconds; }
    active.nextTime = eventTime(active.cycleStart, active.nextStep, active.patch);
  }
}

export const audioEngine = {
  async play(key: string, patchId: PatchId): Promise<void> {
    const token = ++sessionToken; const ctx = createGraph();
    if (!ctx) return;
    try { await ctx.resume(); } catch { return; }
    if (token !== sessionToken || !master) return;
    fadeSession(session);
    const patch = PATCHES[patchId];
    const gain = ctx.createGain(); gain.gain.setValueAtTime(0.0001, ctx.currentTime); gain.gain.exponentialRampToValueAtTime(1, ctx.currentTime + 0.03); gain.connect(master);
    let send: GainNode | null = null;
    if (patch.wet > 0 && reverb) {
      send = ctx.createGain(); send.gain.value = patch.wet; send.connect(reverb); gain.connect(send);
    }
    const cycleStart = ctx.currentTime + 0.05; const active: Session = { token, key, patch, gain, send, timer: 0, cycleStart, nextStep: 0, nextTime: cycleStart };
    session = active; setPlaying(key); scheduler(active); active.timer = window.setInterval(() => scheduler(active), 25);
  },
  stop(): void {
    sessionToken += 1; fadeSession(session); session = null; setPlaying(null);
  },
  setMuted(muted: boolean): void {
    if (master && context) { const now = context.currentTime; master.gain.cancelScheduledValues(now); master.gain.setValueAtTime(Math.max(0.0001, master.gain.value), now); master.gain.exponentialRampToValueAtTime(muted ? 0.0001 : 0.7, now + 0.03); }
    if (state.muted !== muted) updateState({ muted });
  },
  getAnalyser(): AnalyserNode | null { return analyser; },
  getState(): AudioState { return state; },
  subscribe(listener: () => void): () => void { listeners.add(listener); return () => listeners.delete(listener); },
};

if (typeof document !== 'undefined') document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') audioEngine.stop(); });
