import { beforeEach, describe, expect, it, vi } from 'vitest';
import { PATCHES } from './patches';

class FakeAudioNode {
  connect(target: FakeAudioNode) { return target; }
  disconnect() {}
}
class FakeGain extends FakeAudioNode { gain = { value: 0.7, setValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn(), cancelScheduledValues: vi.fn() }; }
class FakeOscillator extends FakeAudioNode { frequency = { value: 440, setValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn() }; detune = { value: 0 }; type: OscillatorType = 'sine'; onended: (() => void) | null = null; start() {} stop() {} }
class FakeBufferSource extends FakeAudioNode { buffer: AudioBuffer | null = null; onended: (() => void) | null = null; start() {} stop() {} }
class FakeFilter extends FakeAudioNode { type: BiquadFilterType = 'lowpass'; frequency = { value: 1000 }; }
class FakeAnalyser extends FakeAudioNode { fftSize = 128; smoothingTimeConstant = 0; get frequencyBinCount() { return 64; } getByteFrequencyData() {} }
class FakeContext {
  currentTime = 0; sampleRate = 44100; destination = new FakeAudioNode(); state = 'running';
  async resume() {}
  createGain() { return new FakeGain(); } createDynamicsCompressor() { return Object.assign(new FakeAudioNode(), { threshold: { value: 0 }, knee: { value: 0 }, ratio: { value: 0 } }); }
  createAnalyser() { return new FakeAnalyser(); } createOscillator() { return new FakeOscillator(); } createBiquadFilter() { return new FakeFilter(); } createBufferSource() { return new FakeBufferSource(); }
  createBuffer(_channels: number, length: number) { return { sampleRate: this.sampleRate, getChannelData: () => new Float32Array(length) } as unknown as AudioBuffer; }
  createWaveShaper() { return Object.assign(new FakeAudioNode(), { curve: null as Float32Array | null, oversample: 'none' as OverSampleType }); }
}

describe('audio engine state snapshots', () => {
  beforeEach(() => { vi.resetModules(); Object.defineProperty(window, 'AudioContext', { configurable: true, value: FakeContext }); });
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
});
