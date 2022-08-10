import { clear } from 'console';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import styles from 'styles/Knob.module.scss';
import { pythagorean, radiansToDegrees } from 'utils/math';

interface KnobProps {
  value: number;
  setValue: (newValue: number) => void;
  maxValue: number;
  minValue: number;
}

const Knob: React.FC<KnobProps> = ({ value, setValue, maxValue, minValue }) => {
  const [dragging, setDragging] = useState<boolean>(false);
  const knobRef = useRef<HTMLDivElement>(null!);

  const truncate = useCallback(
    (value: number) => {
      return Math.min(maxValue, Math.max(minValue, value));
    },
    [maxValue, minValue]
  );

  useEffect(() => {
    const upListener = () => {
      setDragging(false);
    };
    document.addEventListener('mouseup', upListener);

    const moveListener = (e: MouseEvent) => {
      const knob = knobRef.current;
      const centerX = knob.offsetLeft + knob.offsetWidth / 2;
      const centerY = knob.offsetTop + knob.offsetHeight / 2;

      const yDiff =
        e.clientX < centerX ? centerY - e.clientY : e.clientY - centerY;
      const xDiff =
        e.clientY < centerY ? e.clientX - centerX : centerX - e.clientX;

      if (dragging) {
        if (yDiff) {
          console.log(pythagorean(yDiff, xDiff));
          setValue(
            Math.floor(truncate(pythagorean(yDiff, xDiff) / 100) * yDiff)
          );
        }
      }
    };
    document.addEventListener('mousemove', moveListener);

    return () => {
      document.removeEventListener('mouseup', upListener);
      document.removeEventListener('mousemove', moveListener);
    };
  }, [document, dragging]);

  return (
    <div
      ref={knobRef}
      className={styles.knob}
      style={{
        transform: `rotate(${radiansToDegrees(value / 31.830988618379067)}deg)`,
      }}
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

export default Knob;
