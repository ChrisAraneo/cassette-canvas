import { describe, expect, it } from 'vitest';

import { computeDisplaySize } from './compute-display-size';

describe('computeDisplaySize', () => {
  it('should count the logical pixels when the canvas splits into them evenly', () => {
    expect(computeDisplaySize({ width: 64, height: 48 }, 4)).toEqual({
      width: 16,
      height: 12,
    });
  });

  it('should leave out the strip that is too thin for a whole pixel when the canvas does not split evenly', () => {
    expect(computeDisplaySize({ width: 66, height: 51 }, 4)).toEqual({
      width: 16,
      height: 12,
    });
  });

  it('should match the canvas when one logical pixel is one canvas pixel', () => {
    expect(computeDisplaySize({ width: 64, height: 48 }, 1)).toEqual({
      width: 64,
      height: 48,
    });
  });

  it('should count no pixels when the canvas is smaller than one pixel', () => {
    expect(computeDisplaySize({ width: 3, height: 3 }, 4)).toEqual({
      width: 0,
      height: 0,
    });
  });
});
