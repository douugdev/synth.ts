import type { NextPage } from 'next';
import Head from 'next/head';
import React, { useMemo, useState } from 'react';
import styles from '../styles/Home.module.scss';
import PITCHES from 'data/notes';
import Knob from 'components/Knob';
import { getWaveFunction, normaliseWave } from 'utils/waves';

type WaveFunction = (timeDomain: number) => number | Array<number>;

const NOTES = [
  'D',
  'D#',
  'E',
  'F',
  'F#',
  'G',
  'G#',
  'A',
  'A#',
  'B',
  'C',
  'C#',
] as const;

const C_SCALE = [
  'C',
  'C#',
  'D',
  'D#',
  'E',
  'F',
  'F#',
  'G',
  'G#',
  'A',
  'A#',
  'B',
];

export const SAMPLE_RATE = 44100;

const triangleWave: WaveFunction = (t) => {
  return Math.abs(((2 * t + 0.5) % 2) - 1) * 1 - 0.5;
};

const squareWave: WaveFunction = (t) => {
  return Math.sign(Math.sin(2 * Math.PI * t));
};

const sineWave: WaveFunction = (t) => {
  return Math.sin(2 * Math.PI * t);
};

const waves = {
  sine: sineWave,
  square: squareWave,
  triangle: triangleWave,
};

const Synth: NextPage = () => {
  const [volume, setVolume] = useState<number>(50);
  const audioContext = useMemo(() => {
    const context = new AudioContext();

    return context;
  }, []);

  const [wave, setWave] = useState<'triangle' | 'sine' | 'square'>('sine');

  const handleWaveChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target;
    if (target.checked) {
      setWave(target.value as typeof wave);
    }
  };

  const playSoundWave = ({
    wave = sineWave,
    note = 'A',
    octave = 3,
  }: {
    wave?: WaveFunction;
    note?: typeof NOTES[number];
    octave?: number;
  }) => {
    if (Array.isArray(wave)) {
      if (wave.length == 0) {
        // Do nothing if we have a nothing-lengthed wave.
        return;
      }
    }
    const baseVolume = 0.8 * (volume / 100);
    const decay = 2;
    const freq = PITCHES[(note + octave) as keyof typeof PITCHES];
    if (wave.constructor === Array) {
      // transform our wave array into a function we can call
      wave = getWaveFunction(normaliseWave(wave));
    }

    if (audioContext === null) {
      return false;
    }

    const buffer = audioContext.createBuffer(1, SAMPLE_RATE, SAMPLE_RATE);

    const channel = buffer.getChannelData(0);
    for (let i = 0; i < buffer.length; i++) {
      // Where we are in the sound, in seconds.
      const t = i / SAMPLE_RATE;
      // The waves are visually at a very low frequency, we need to bump that up a bunch
      channel[i] += Array.isArray(wave) ? wave[freq * t] : wave(freq * t);
    }
    const source = audioContext.createBufferSource();
    source.buffer = buffer;

    const gainNode = audioContext.createGain();

    gainNode.gain.setValueAtTime(baseVolume, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.0001,
      audioContext.currentTime + decay
    );

    source.connect(gainNode);
    gainNode.connect(audioContext.destination);

    source.start();
    source.stop(audioContext.currentTime + decay);
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Synth</title>
        <meta name="description" content="Just a synthesizer" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <div>Current waveform:</div>
        <div>
          <div>
            <input
              onChange={handleWaveChange}
              type="radio"
              value="sine"
              name="wave"
              checked={wave === 'sine'}
            />
            Sine
          </div>
          <div>
            <input
              onChange={handleWaveChange}
              type="radio"
              value="triangle"
              name="wave"
              checked={wave === 'triangle'}
            />
            Triangle
          </div>
          <div>
            <input
              onChange={handleWaveChange}
              type="radio"
              value="square"
              name="wave"
              checked={wave === 'square'}
            />
            Square
          </div>
        </div>

        <div>
          Volume: {volume}
          <Knob
            value={volume}
            setValue={setVolume}
            maxValue={100}
            minValue={0}
          />
        </div>

        <div className={styles.piano}>
          {[...Array(88)].map((_, index) => {
            const note = NOTES[index % NOTES.length];
            const isBlackKey = note.at(-1) === '#';
            return (
              <div
                key={`key_${index}`}
                className={isBlackKey ? styles.keyBlack : styles.keyWhite}
                onMouseDown={() =>
                  playSoundWave({
                    wave: waves[wave],
                    note,
                    octave: Math.floor(Math.min(index + 2, 88) / 12),
                  })
                }
              >
                <p>
                  {NOTES[index % NOTES.length] +
                    Math.floor(Math.min(index + 2, 88) / 12)}
                </p>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default Synth;
