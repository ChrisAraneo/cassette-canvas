import { describe, expect, it } from 'vitest';

import { computeRgbMix } from './compute-rgb-mix';

const ORANGE = Object.freeze({ red: 200, green: 100, blue: 0 });

const NAVY = Object.freeze({ red: 0, green: 0, blue: 102 });

describe('computeRgbMix', () => {
  it('should return the color when it mixes in none of the target', () => {
    expect(computeRgbMix(ORANGE, NAVY, 0)).toEqual(ORANGE);
  });

  it('should return the target when it mixes in all of it', () => {
    expect(computeRgbMix(ORANGE, NAVY, 1)).toEqual(NAVY);
  });

  it('should return the color halfway when it mixes in half of the target', () => {
    expect(computeRgbMix(ORANGE, NAVY, 0.5)).toEqual({
      red: 100,
      green: 50,
      blue: 51,
    });
  });

  it('should return each channel rounded to a whole number when the mix falls between two', () => {
    expect(
      computeRgbMix(
        { red: 1, green: 1, blue: 1 },
        { red: 2, green: 2, blue: 2 },
        0.5,
      ),
    ).toEqual({ red: 2, green: 2, blue: 2 });
  });
});
