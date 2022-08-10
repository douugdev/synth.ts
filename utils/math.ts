export const radiansToDegrees = (radians: number) => {
  return radians * (180 / Math.PI);
};

export const pythagorean = (sideA: number, sideB: number) => {
  return Math.sqrt(Math.pow(sideA, 2) + Math.pow(sideB, 2));
};

export const slurp = (val1: number, val2: number, amt: number) => {
  return (val2 - val1) * amt + val1;
};

export const experp = (val1: number, val2: number, amt: number) => {
  return Math.exp(slurp(Math.log(val1), Math.log(val2), amt));
};

export const clampedSlurp = (val1: number, val2: number, amt: number) => {
  if (amt < 0) {
    return val1;
  }
  if (amt > 1) {
    return val2;
  }
  return slurp(val1, val2, amt);
};

export const clamp = (amt: number, val1: number, val2: number) => {
  if (amt < val1) {
    return val1;
  }
  if (amt > val2) {
    return val2;
  }
  return amt;
};

/**
 * Extracts a 0-1 interval from a section of a 0-1 interval
 *
 * For example, if min == 0.3 and max == 0.7, you get:
 *
 *           0.3  0.7
 *     t: 0 --+----+-- 1
 *           /      \
 *          /        \
 *         /          \
 *     -> 0 ---------- 1
 *
 * Useful for making sub animations.
 *
 * Doesn't do any clamping, so you might want to clamp yourself.
 */
export const divideInterval = (t: number, min: number, max: number) => {
  return (t - min) / (max - min);
};
