import { useEffect } from 'react';
import styles from './Piano.module.scss';

type PianoProps = {
  isPressing?: boolean;
  onPress?: (note: NoteWithOctave) => void;
  onMouseEnter?: (note: NoteWithOctave) => void;
  onMouseLeave?: (note: NoteWithOctave) => void;
};

type CScaleProps = {
  octave: number;
} & PianoProps;

export const NOTES = [
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

export type NoteWithOctave = `${(typeof NOTES)[number]}${number}`;

export const C_SCALE = [
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
] as const;

const CScale = ({
  octave,
  onPress,
  onMouseEnter,
  onMouseLeave,
  isPressing,
}: CScaleProps) => {
  return (
    <>
      {C_SCALE.map((note) => {
        const isBlackKey = note.includes('#');
        const noteWithOctave: NoteWithOctave = `${note}${octave}`;
        return (
          <div
            key={note + octave}
            className={`${isPressing ? styles.pressing : ''} ${
              isBlackKey ? styles.keyContainerBlack : styles.keyContainerWhite
            }`}
          >
            <div
              className={isBlackKey ? styles.keyBlack : styles.keyWhite}
              onClick={() => isPressing && onPress?.(noteWithOctave)}
              onMouseDown={() => onMouseEnter?.(noteWithOctave)}
              onMouseEnter={() => isPressing && onMouseEnter?.(noteWithOctave)}
              onMouseLeave={() => onMouseLeave?.(noteWithOctave)}
              onMouseUp={() => onMouseLeave?.(noteWithOctave)}
            >
              <p>{note + octave}</p>
            </div>
          </div>
        );
      })}
    </>
  );
};

const AllScales = new Array(3).fill(0).map((_, index) => {
  return index + 3;
});
const Piano = (props: PianoProps) => {
  return (
    <div className={styles.piano}>
      {AllScales.map((octave) => {
        return (
          <CScale key={`scale_octave_${octave}`} octave={octave} {...props} />
        );
      })}
    </div>
  );
};

export default Piano;
