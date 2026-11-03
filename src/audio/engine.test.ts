import { beforeEach, describe, expect, it, vi } from 'vitest';
import { PATCHES } from './patches';

let createdConvolvers = 0;
let createdImpulseBuffers = 0;
let createdOscillators = 0;
let createdBufferSources = 0;
type FakeParam = { value: number; setValueAtTime: ReturnType<typeof vi.fn>; exponentialRampToValueAtTime: ReturnType<typeof vi.fn>; linearRampToValueAtTime: ReturnType<typeof vi.fn>; cancelScheduledValues: ReturnType<typeof vi.fn> };
let createdGainValues: FakeParam[] = [];
let oscillatorStopTimes: number[] = [];

class FakeAudioNode {
  connect(target: FakeAudioNode) { return target; }
  disconnect() {}
}
class FakeGain extends FakeAudioNode {
  gain = { value: 0.7, setValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn(), linearRampToValueAtTime: vi.fn(), cancelScheduledValues: vi.fn() };
  constructor() { super(); createdGainValues.push(this.gain); }
}
class FakeOscillator extends FakeAudioNode { frequency = { value: 440, setValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn() }; detune = { value: 0, setValueAtTime: vi.fn(), linearRampToValueAtTime: vi.fn() }; type: OscillatorType = 'sine'; onended: (() => void) | null = null; start() {} stop(when?: number) { if (when !== undefined) oscillatorStopTimes.push(when); } }
class FakeBufferSource extends FakeAudioNode { buffer: AudioBuffer | null = null; onended: (() => void) | null = null; start() {} stop() {} }
class FakeConvolver extends FakeAudioNode { buffer: AudioBuffer | null = null; }
class FakeFilter extends FakeAudioNode { type: BiquadFilterType = 'lowpass'; frequency = { value: 1000, setValueAtTime: vi.fn(), linearRampToValueAtTime: vi.fn() }; Q = { value: 0.7 }; }
class FakeAnalyser extends FakeAudioNode { fftSize = 128; smoothingTimeConstant = 0; get frequencyBinCount() { return 64; } getByteFrequencyData() {} }
class FakeContext {
  currentTime = 0; sampleRate = 44100; destination = new FakeAudioNode(); state = 'running';
  async resume() {}
  createGain() { return new FakeGain(); } createDynamicsCompressor() { return Object.assign(new FakeAudioNode(), { threshold: { value: 0 }, knee: { value: 0 }, ratio: { value: 0 } }); }
  createAnalyser() { return new FakeAnalyser(); } createOscillator() { createdOscillators += 1; return new FakeOscillator(); } createBiquadFilter() { return new FakeFilter(); } createBufferSource() { createdBufferSources += 1; return new FakeBufferSource(); } createConvolver() { createdConvolvers += 1; return new FakeConvolver(); }
  createBuffer(channels: number, length: number) { if (channels === 2) createdImpulseBuffers += 1; return { sampleRate: this.sampleRate, getChannelData: () => new Float32Array(length) } as unknown as AudioBuffer; }
  createWaveShaper() { return Object.assign(new FakeAudioNode(), { curve: null as Float32Array | null, oversample: 'none' as OverSampleType }); }
}
const FakeContextWithoutConvolver = class extends FakeContext {};
Object.defineProperty(FakeContextWithoutConvolver.prototype, 'createConvolver', { configurable: true, value: undefined });

describe('audio engine state snapshots', () => {
  beforeEach(() => { vi.resetModules(); createdConvolvers = 0; createdImpulseBuffers = 0; createdOscillators = 0; createdBufferSources = 0; createdGainValues = []; oscillatorStopTimes = []; Object.defineProperty(window, 'AudioContext', { configurable: true, value: FakeContext }); });
  it('replaces the external snapshot across play, stop, and mute', async () => {
    const { audioEngine, eventTime } = await import('./engine');
    const initial = audioEngine.getState();
    await audioEngine.play('test', 'pentatonic-pluck');
    const playing = audioEngine.getState();
    expect(playing).not.toBe(initial); expect(playing.playingKey).toBe('test');
    audioEngine.stop(); const stopped = audioEngine.getState();
    expect(stopped).not.toBe(playing); expect(stopped.playingKey).toBeNull();
    audioEngine.setMuted(true); const muted = audioEngine.getState();
    expect(muted).not.toBe(stopped); expect(muted.muted).toBe(true);
    expect(eventTime(10, 1, PATCHES['swing-jazz'])).toBeGreaterThan(10 + 0.2);
    audioEngine.stop();
  });

  it('builds one cached impulse-backed reverb path when supported', async () => {
    const { audioEngine } = await import('./engine');
    await audioEngine.play('reverb', 'bone-flute');
    await audioEngine.play('reverb-again', 'bone-flute');
    expect(audioEngine.getState().playingKey).toBe('reverb-again');
    expect(createdConvolvers).toBe(1);
    expect(createdImpulseBuffers).toBe(1);
    audioEngine.stop();
  });

  it('plays without a convolver implementation', async () => {
    Object.defineProperty(window, 'AudioContext', { configurable: true, value: FakeContextWithoutConvolver });
    const { audioEngine } = await import('./engine');
    await audioEngine.play('dry', 'pentatonic-pluck');
    expect(audioEngine.getState().playingKey).toBe('dry');
    audioEngine.stop();
  });

  it('routes ancient patches through their dedicated synthesis voices', async () => {
    const { audioEngine } = await import('./engine');
    await audioEngine.play('bells', 'bronze-bells');
    expect(createdOscillators).toBeGreaterThanOrEqual(5);
    audioEngine.stop();

    await audioEngine.play('flute', 'bone-flute');
    expect(createdBufferSources).toBeGreaterThan(0);
    expect(createdOscillators).toBeGreaterThanOrEqual(9);
    expect(createdGainValues.some((gain) => gain.value >= 10 && gain.value <= 25)).toBe(true);
    audioEngine.stop();
  });

  it('finishes a motif and clears the playing key', async () => {
    vi.useFakeTimers();
    const { audioEngine } = await import('./engine');
    await audioEngine.playMotif('motif', { bpm: 600, stepsPerBeat: 1, voice: 'pluck', wet: 0, events: [{ step: 0, midi: 60, durSteps: 0.1 }] });
    expect(audioEngine.getState().playingKey).toBe('motif');
    vi.advanceTimersByTime(250);
    expect(audioEngine.getState().playingKey).toBeNull();
    vi.useRealTimers();
  });

  it('holds string gain until note end before releasing', async () => {
    const { audioEngine } = await import('./engine');
    await audioEngine.playMotif('strings-sustain', { bpm: 60, stepsPerBeat: 1, voice: 'strings', wet: 0, events: [{ step: 0, midi: 60, durSteps: 2, vel: 0.68 }] });
    const noteEnd = 0.05 + 2;
    const peak = 0.07 * 0.68;
    const stringGains = createdGainValues.filter((gain) => gain.setValueAtTime.mock.calls.some(([value, time]) => value === peak && time === noteEnd));
    expect(stringGains).toHaveLength(3);
    expect(Math.min(...oscillatorStopTimes)).toBeGreaterThanOrEqual(noteEnd + 0.18);
    audioEngine.stop();
  });

  it('keeps a harpsichord motif alive through its natural tail', async () => {
    vi.useFakeTimers();
    const { audioEngine } = await import('./engine');
    await audioEngine.playMotif('harpsichord-tail', { bpm: 60, stepsPerBeat: 1, voice: 'harpsichord', wet: 0, events: [{ step: 0, midi: 60, durSteps: 0.3 }] });
    vi.advanceTimersByTime(300);
    expect(audioEngine.getState().playingKey).toBe('harpsichord-tail');
    vi.advanceTimersByTime(1700);
    expect(audioEngine.getState().playingKey).toBeNull();
    audioEngine.stop();
    vi.useRealTimers();
  });

  it('suppresses motif callbacks after stop or session replacement', async () => {
    vi.useFakeTimers();
    const { audioEngine } = await import('./engine');
    const onStep = vi.fn();
    await audioEngine.playMotif('old', { bpm: 60, stepsPerBeat: 1, voice: 'pluck', wet: 0, events: [{ step: 0, midi: 60, durSteps: 1 }] }, { onStep });
    audioEngine.stop();
    vi.advanceTimersByTime(1200);
    expect(onStep).not.toHaveBeenCalled();

    await audioEngine.playMotif('old-again', { bpm: 60, stepsPerBeat: 1, voice: 'pluck', wet: 0, events: [{ step: 0, midi: 60, durSteps: 1 }] }, { onStep });
    await audioEngine.play('new', 'pentatonic-pluck');
    vi.advanceTimersByTime(1200);
    expect(onStep).not.toHaveBeenCalled();
    audioEngine.stop();
    vi.useRealTimers();
  });

  it('schedules every pitch in a motif chord', async () => {
    const { audioEngine } = await import('./engine');
    await audioEngine.playMotif('chord', { bpm: 60, stepsPerBeat: 1, voice: 'strings', wet: 0, events: [{ step: 0, midi: [60, 64, 67], durSteps: 1 }] });
    expect(createdOscillators).toBeGreaterThanOrEqual(6);
    audioEngine.stop();
  });

  it('uses layered piano, harpsichord, and string synthesis voices', async () => {
    const { audioEngine } = await import('./engine');
    await audioEngine.playMotif('piano', { bpm: 60, stepsPerBeat: 1, voice: 'piano', wet: 0, events: [{ step: 0, midi: 60, durSteps: 1 }] });
    expect(createdOscillators).toBeGreaterThanOrEqual(4);
    audioEngine.stop();

    createdOscillators = 0; oscillatorStopTimes = [];
    await audioEngine.playMotif('harpsichord', { bpm: 60, stepsPerBeat: 1, voice: 'harpsichord', wet: 0, events: [{ step: 0, midi: 48, durSteps: 20 }] });
    expect(createdOscillators).toBeGreaterThanOrEqual(6);
    expect(Math.max(...oscillatorStopTimes)).toBeLessThanOrEqual(1.7);
    audioEngine.stop();

    createdOscillators = 0;
    await audioEngine.playMotif('strings', { bpm: 60, stepsPerBeat: 1, voice: 'strings', wet: 0, events: [{ step: 0, midi: 60, durSteps: 1 }] });
    expect(createdOscillators).toBeGreaterThanOrEqual(3);
    expect(createdGainValues.some((gain) => gain.value >= 5 && gain.value <= 10)).toBe(true);
    audioEngine.stop();
  });
});
