import { describe, expect, it } from 'vitest';

import { TRANSPARENT } from '../palette/consts';
import { createOverlay } from './create-overlay';

describe('createOverlay', () => {
  it('should hold one pixel for every place when it makes an overlay', () => {
    expect(createOverlay(3, 2, 0x35)).toEqual({
      width: 3,
      height: 2,
      pixels: [0x35, 0x35, 0x35, 0x35, 0x35, 0x35],
    });
  });

  it('should draw nothing when it is given no pixel', () => {
    expect(createOverlay(2, 1).pixels).toEqual([TRANSPARENT, TRANSPARENT]);
  });

  it('should give an empty overlay when a size is below one', () => {
    expect(createOverlay(-4, 10, 0x35)).toEqual({
      width: 0,
      height: 10,
      pixels: [],
    });
  });

  it('should cut a fraction down to a whole pixel', () => {
    expect(createOverlay(2.9, 1.5, 0x10)).toEqual({
      width: 2,
      height: 1,
      pixels: [0x10, 0x10],
    });
  });
});
