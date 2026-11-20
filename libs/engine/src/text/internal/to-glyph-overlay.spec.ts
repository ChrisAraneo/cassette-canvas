import { describe, expect, it } from 'vitest';

import { TRANSPARENT } from '../../palette/consts';
import { toGlyphOverlay } from './to-glyph-overlay';

const INK = 0x15;

const DOT = Object.freeze({ advance: 2, top: 6, rows: ['#.', '.#'] });

describe('toGlyphOverlay', () => {
  it('should return the ink of the glyph in the pixel it is given when it draws one', () => {
    expect(toGlyphOverlay(DOT, INK)).toEqual({
      width: 2,
      height: 2,
      pixels: [INK, TRANSPARENT, TRANSPARENT, INK],
    });
  });

  it('should return an empty overlay when the glyph has no art', () => {
    expect(
      toGlyphOverlay({ advance: 3, top: 0, rows: [] }, INK).pixels,
    ).toEqual([]);
  });
});
