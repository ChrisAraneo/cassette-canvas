import { describe, expect, it } from 'vitest';

import { TRANSPARENT } from '../../palette/consts';
import { toOverlayPixels } from './to-overlay-pixels';

const LEGEND = Object.freeze({ o: 0x35, x: 0x17 });

const createArt = (): string[] => ['ox', 'xo'];

describe('toOverlayPixels', () => {
  it('should return the art read row by row when it reads the pixels', () => {
    expect(toOverlayPixels(['ox', 'xo'], 2, LEGEND)).toEqual([
      0x35, 0x17, 0x17, 0x35,
    ]);
  });

  it('should return a transparent pixel when the legend does not hold a character', () => {
    expect(toOverlayPixels(['o.o'], 3, LEGEND)).toEqual([
      0x35,
      TRANSPARENT,
      0x35,
    ]);
  });

  it('should return a short row filled out with transparent pixels when it falls short of the width', () => {
    expect(toOverlayPixels(['o', 'oo'], 2, LEGEND)).toEqual([
      0x35,
      TRANSPARENT,
      0x35,
      0x35,
    ]);
  });

  it('should return no pixels when there is no art', () => {
    expect(toOverlayPixels([], 2, LEGEND)).toEqual([]);
  });

  it('should return no pixels when the width is none', () => {
    expect(toOverlayPixels(['ox'], 0, LEGEND)).toEqual([]);
  });

  it('should not change the art it is given when it reads the pixels', () => {
    const art = createArt();

    toOverlayPixels(art, 2, LEGEND);

    expect(art).toEqual(createArt());
  });
});
