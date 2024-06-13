import { clear } from 'console';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import styles from 'styles/Knob.module.scss';
import { pythagorean, radiansToDegrees } from 'utils/math';

interface SliderProps {
  value: number;
  setValue: (newValue: number) => void;
  maxValue: number;
  minValue: number;
}

const Slider: React.FC<Slider> = ({ value }) => {
  const [dragging, setDragging] = useState<boolean>(false);
  const knobRef = useRef<HTMLDivElement>(null!);
  return (
    <div
      ref={knobRef}
      className={styles.knobContainer}
      onMouseDown={() => {
        setDragging(true);
      }}
      onMouseUp={() => {
        setDragging(false);
      }}
    >
      <div className={styles.handle}></div>
    </div>
  );
};

export default Slider;
