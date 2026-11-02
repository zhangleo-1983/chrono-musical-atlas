export function generateImpulse(seconds: number, sampleRate: number, random: () => number = Math.random): [Float32Array, Float32Array] {
  const length = Math.floor(seconds * sampleRate);
  const left = new Float32Array(length);
  const right = new Float32Array(length);
  for (let i = 0; i < length; i += 1) {
    const decay = Math.pow(10, (-60 * i) / Math.max(1, length - 1) / 20);
    left[i] = (random() * 2 - 1) * decay;
    right[i] = (random() * 2 - 1) * decay;
  }
  return [left, right];
}
