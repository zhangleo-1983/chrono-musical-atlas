import { beforeEach, describe, expect, it, vi } from 'vitest';
import { PATCHES } from './patches';

let createdConvolvers = 0;
let createdImpulseBuffers = 0;
let createdOscillators = 0;
let createdBufferSources = 0;
let createdGainValues: Array<{ value: number }> = [];

class FakeAudioNode {
  connect(target: FakeAudioNode) { return target; }
  disconnect() {}
}
class FakeGain extends FakeAudioNode {
  gain = { value: 0.7, setValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn(), cancelScheduledValues: vi.fn() };
  constructor() { super(); createdGainValues.push(this.gain); }
}
class FakeOscillator extends FakeAudioNode { frequency = { value: 440, setValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn() }; detune = { value: 0, setValueAtTime: vi.fn(), linearRampToValueAtTime: vi.fn() }; type: OscillatorType = 'sine'; onended: (() => void) | null = null; start() {} stop() {} }
class FakeBufferSource extends FakeAudioNode { buffer: AudioBuffer | null = null; onended: (() => void) | null = null; start() {} stop() {} }
class FakeConvolver extends FakeAudioNode { buffer: AudioBuffer | null = null; }
class FakeFilter extends FakeAudioNode { type: BiquadFilterType = 'lowpass'; frequency = { value: 1000 }; }
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
  beforeEach(() => { vi.resetModules(); createdConvolvers = 0; createdImpulseBuffers = 0; createdOscillators = 0; createdBufferSources = 0; createdGainValues = []; Object.defineProperty(window, 'AudioContext', { configurable: true, value: FakeContext }); });
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
});
