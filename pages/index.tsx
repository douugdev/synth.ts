import type { NextPage } from 'next';
import Head from 'next/head';
import React, { useCallback, useEffect, useId, useRef, useState } from 'react';
import styles from '../styles/Home.module.scss';
import { MdOutlinePiano } from 'react-icons/md';
import {
  PiWaveTriangleBold,
  PiWaveSineBold,
  PiWaveSquareBold,
} from 'react-icons/pi';
import { Midi } from '@tonejs/midi';
import Piano, { NoteWithOctave } from 'components/Piano';
import * as Tone from 'tone';

const Synth: NextPage = () => {
  const volumeId = useId();
  const sineId = useId();
  const squareId = useId();
  const triangleId = useId();
  const pianoId = useId();

  const [volume, setVolume] = useState<string>('-15');
  const [midi, setMidi] = useState<Midi>();
  const synth = useRef(new Tone.PolySynth(Tone.Synth).toDestination());

  const sampler = useRef(
    new Tone.Sampler({
      urls: {
        C4: 'C4.mp3',
        'D#4': 'Ds4.mp3',
        'F#4': 'Fs4.mp3',
        A4: 'A4.mp3',
      },
      release: 1,
      baseUrl: 'https://tonejs.github.io/audio/salamander/',
      volume: -10,
    }).toDestination()
  );

  const [wave, setWave] = useState<'triangle' | 'sine' | 'square' | 'piano'>(
    'sine'
  );

  const handleWaveChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target;
    if (target.checked) {
      setWave(target.value as typeof wave);
      changeWaveform(target.value as typeof wave);
    }
  };

  const changeWaveform = useCallback((waveForm: typeof wave) => {
    switch (waveForm) {
      case 'piano':
        break;
      case 'sine':
        synth.current.set({
          oscillator: {
            type: 'sine',
          },
        });
        break;
      case 'triangle':
        synth.current.set({
          oscillator: {
            type: 'triangle',
          },
        });
        break;
      case 'square':
        synth.current.set({
          oscillator: {
            type: 'square',
          },
        });
        break;
    }
  }, []);

  const playSoundWave = (note: NoteWithOctave) => {
    switch (wave) {
      case 'piano':
        sampler.current.triggerAttackRelease(note, 1);
        break;
      case 'sine':
      case 'triangle':
      case 'square':
        synth.current.triggerAttackRelease(note, 0.25);
        break;
    }
  };

  const playMidi = () => {
    const now = Tone.now();
    midi?.tracks.forEach((track) => {
      if (track.instrument.percussion) {
        return;
      }
      //schedule all of the events
      track.notes.forEach((note) => {
        if (note.duration <= 0) {
          return;
        }
        if (wave === 'piano') {
          if (note && note.name)
            sampler.current.triggerAttackRelease(
              note.name,
              note.duration,
              note.time + now,
              note.velocity
            );
        } else {
          synth.current.triggerAttackRelease(
            note.name,
            note.duration,
            note.time + now,
            note.velocity
          );
        }
      });
    });
  };

  useEffect(() => {
    if (!volume) {
      return;
    }
    const parsedVolume = parseInt(volume);

    if (Number.isNaN(parsedVolume) || !Number.isFinite(parsedVolume)) {
      return;
    }

    synth.current.set({
      volume: parsedVolume,
    });
    sampler.current.set({
      volume: parsedVolume,
    });
  }, [sampler, synth, volume]);

  useEffect(() => {
    changeWaveform('sine');
    synth.current.set({
      envelope: {
        attack: 0.02,
        decay: 0.5,
        sustain: 0.5,
        release: 1,
      },
    });
  }, [changeWaveform]);

  return (
    <div className={styles.container}>
      <Head>
        <title>Synth</title>
        <meta name="description" content="Just a synthesizer" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <div className={styles.title}>
          <h1>synth.ts</h1>
          <h2>
            A simple synthesizer built with <strong>React</strong> and{' '}
            <strong>TypeScript</strong>
          </h2>
        </div>
        <div className={styles.ui}>
          <div className={styles.waveformContainer}>
            <h2>Waveform/Sample</h2>
            <div className={styles.inputsContainer}>
              <div>
                <input
                  id={sineId}
                  onChange={handleWaveChange}
                  type="radio"
                  value="sine"
                  name="wave"
                  checked={wave === 'sine'}
                />
                <label htmlFor={sineId}>
                  <PiWaveSineBold />
                  Sine
                </label>
              </div>
              <div>
                <input
                  id={triangleId}
                  onChange={handleWaveChange}
                  type="radio"
                  value="triangle"
                  name="wave"
                  checked={wave === 'triangle'}
                />
                <label htmlFor={triangleId}>
                  <PiWaveTriangleBold /> Triangle
                </label>
              </div>
              <div>
                <input
                  id={squareId}
                  onChange={handleWaveChange}
                  type="radio"
                  value="square"
                  name="wave"
                  checked={wave === 'square'}
                />
                <label htmlFor={squareId}>
                  <PiWaveSquareBold /> Square
                </label>
              </div>
              <hr />
              <div>
                <input
                  id={pianoId}
                  onChange={handleWaveChange}
                  type="radio"
                  value="piano"
                  name="wave"
                  checked={wave === 'piano'}
                />
                <label htmlFor={pianoId}>
                  <MdOutlinePiano /> Piano
                </label>
              </div>
            </div>
          </div>

          <div className={styles.midiInputContainer}>
            <div className={styles.boxInput}>
              <input
                className={styles.boxFile}
                type="file"
                name="files[]"
                id="file"
                accept=".mid,.midi"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    file.arrayBuffer().then((midiData) => {
                      setMidi(new Midi(midiData));
                    });
                  }
                }}
              />
              <label htmlFor="file">
                {midi ? (
                  <strong>Midi loaded</strong>
                ) : (
                  <strong>Choose a file</strong>
                )}
              </label>
            </div>
            <button
              disabled={!midi}
              className={styles.play}
              onClick={() => playMidi()}
            >
              Play MIDI
            </button>
          </div>

          <div className={styles.volume}>
            <label htmlFor={volumeId}>Volume</label>
            <div className={styles.fakeInput}>
              <input
                id={volumeId}
                type="text"
                value={volume}
                onChange={(e) => {
                  const parsedText = e.target.value.replaceAll(/[^0-9\-]/g, '');
                  const parsedVolume = parseInt(parsedText);

                  if (Number.isNaN(parsedVolume)) {
                    return setVolume(parsedText);
                  }

                  if (parsedVolume >= 0) {
                    return setVolume('-0');
                  }

                  if (parsedVolume < -100) {
                    return setVolume('-100');
                  }

                  setVolume(parsedText);
                }}
              />
              dB
            </div>
          </div>
        </div>
        <div className={styles.piano}>
          <Piano onPressDown={(note) => playSoundWave(note)} />
        </div>
      </main>
    </div>
  );
};

export default Synth;
