import type { NextPage } from 'next';
import Head from 'next/head';
import { useMemo, useState } from 'react';
import styles from '../styles/Home.module.scss';
import PITCHES from 'data/notes';
import Knob from 'components/Knob';
import { getWaveFunction, normaliseWave } from 'utils/waves';

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

const Synth: NextPage = () => {
  const [knobValue, setKnobValue] = useState<number>(50);
  // const [waveform, setWaveform] = useState<'square'>

  const audioContext = useMemo(() => {
    const context = new AudioContext();

    return context;
  }, []);

  const playSoundWave = ({
    wave = (t) => {
      // return Math.sin(2 * Math.PI * t); // Senoidal

      // return Math.sin(2 * Math.PI * t) !== 0
      //   ? 1 * Math.sign(Math.sin(2 * Math.PI * t)) // Quadrada
      //   : 0;

      return Math.abs(((2 * t + 0.5) % 2) - 1) * 1 - 0.5; // Triangulo
    },
    note = 'A',
    octave = 3,
  }: {
    wave?: (num: number) => number | Array<number>;
    note?: typeof NOTES[number];
    octave?: number;
  }) => {
    if (Array.isArray(wave)) {
      if (wave.length == 0) {
        // Do nothing if we have a nothing-lengthed wave.
        return;
      }
    }
    const baseVolume = 0.8 * (knobValue / 100);
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
        <div>Current waveform: TRIANGLE WAVE</div>
        <div>
          {knobValue}
          <Knob
            value={knobValue}
            setValue={setKnobValue}
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
                className={isBlackKey ? styles.keyBlack : styles.keyWhite}
                onMouseDown={() =>
                  playSoundWave({
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
