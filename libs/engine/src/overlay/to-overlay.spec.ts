import { describe, expect, it } from 'vitest';

import { TRANSPARENT } from '../palette/consts';
import { toOverlay } from './to-overlay';

const LEGEND = Object.freeze({ o: 0x35, x: 0x17 });

describe('toOverlay', () => {
  it('should return the art read row by row when it builds an overlay', () => {
    expect(toOverlay(['ox', 'xo'], LEGEND)).toEqual({
      width: 2,
      height: 2,
      pixels: [0x35, 0x17, 0x17, 0x35],
    });
  });

  it('should return a transparent pixel when the legend does not hold a character', () => {
    expect(toOverlay(['o.o'], LEGEND).pixels).toEqual([
      0x35,
      TRANSPARENT,
      0x35,
    ]);
  });

  it('should return an overlay as wide as its longest row when the rows differ', () => {
    expect(toOverlay(['o', 'ooo'], LEGEND).width).toBe(3);
  });

  it('should return a short row filled out with transparent pixels when it is shorter than the widest', () => {
    expect(toOverlay(['o', 'oo'], LEGEND).pixels).toEqual([
      0x35,
      TRANSPARENT,
      0x35,
      0x35,
    ]);
  });

  it('should return an empty overlay when there is no art', () => {
    expect(toOverlay([], LEGEND)).toEqual({
      width: 0,
      height: 0,
      pixels: [],
    });
  });
});
