import FFT from 'fft.js';
import { slurp } from './math';

export const getFourierData = (points: number[]) => {
  if (points.length == 0) {
    return [];
  }

  const numPoints = points.length / 2;
  const fft = new FFT(numPoints);

  const out = fft.createComplexArray();
  fft.transform(out, points);

  // Transform into an API of points I find friendlier.
  const fftData = [];
  for (let i = 0; i < numPoints; i++) {
    // to reorder the frequencies a little nicer, we pick from the front and back altermatively
    const j = i % 2 == 0 ? i / 2 : numPoints - (i + 1) / 2;
    const x = out[2 * j];
    const y = out[2 * j + 1];
    const freq = ((j + numPoints / 2) % numPoints) - numPoints / 2;
    fftData.push({
      freq: freq,
      // a little expensive
      amplitude: Math.sqrt(x * x + y * y) / numPoints,
      // a lottle expensive :(
      phase: Math.atan2(y, x),
    });
  }
  // fftData.sort((a, b) => b.amplitude - a.amplitude);
  return fftData;
};

// Generates a wave from a function in the range [0, 1)
export function getWave(fn: (t: number) => number, numSamples = 128) {
  let points = [];
  for (let i = 0; i < numSamples; i++) {
    const amt = i / numSamples;
    points.push(fn(amt));
  }
  return points;
}

/**
 * @param {Array<number>} wave
 * @returns {Array<number>} Normalised wave (in the range -1 to 1)
 */
export function normaliseWave(wave: number[]): number[] {
  const min = Math.min(...wave);
  const max = Math.max(...wave);
  return wave.map((sample) => slurp(-1, 1, (sample - min) / (max - min)));
}

/**
 * Creates a function that gives the value of a wave at a certain point. Does some interpolation.
 * @param {Array<number>} wave
 * @returns {function(number):number} A wave function (mainly to be used by the playSoundWave thing)
 */
export function getWaveFunction(wave: number[]) {
  return (t: number) => {
    t %= 1;
    if (t < 0) {
      t++;
    }
    const index = Math.floor(wave.length * t);
    const nextIndex = (index + 1) % wave.length;
    // The remainder from doing the divide
    const extra = (wave.length * t) % 1;

    return slurp(wave[index], wave[nextIndex], extra);
  };
}

export function squareWave(t: number) {
  return t < 0.5 ? -1 : 1;
}
