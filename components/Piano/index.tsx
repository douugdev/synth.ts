import styles from './Piano.module.scss';

type PianoProps = {
  onPress?: (note: NoteWithOctave) => void;
  onPressDown?: (note: NoteWithOctave) => void;
  onPressUp?: (note: NoteWithOctave) => void;
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

const CScale = ({ octave, onPress, onPressDown, onPressUp }: CScaleProps) => {
  return (
    <>
      {C_SCALE.map((note) => {
        const isBlackKey = note.includes('#');
        const noteWithOctave: NoteWithOctave = `${note}${octave}`;
        return (
          <div
            key={note + octave}
            className={
              isBlackKey ? styles.keyContainerBlack : styles.keyContainerWhite
            }
          >
            <div
              className={isBlackKey ? styles.keyBlack : styles.keyWhite}
              onClick={() => onPress?.(noteWithOctave)}
              onMouseDown={() => onPressDown?.(noteWithOctave)}
              onMouseUp={() => onPressUp?.(noteWithOctave)}
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
