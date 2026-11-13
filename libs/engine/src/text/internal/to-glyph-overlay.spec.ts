import { describe, expect, it } from 'vitest';

import { TRANSPARENT } from '../../palette/consts';
import { toGlyphOverlay } from './to-glyph-overlay';

const DOT = Object.freeze({ advance: 2, top: 6, rows: ['#.', '.#'] });

describe('toGlyphOverlay', () => {
  it('should draw the ink of the glyph in the pixel it is given', () => {
    expect(toGlyphOverlay(DOT, 0x15)).toEqual({
      width: 2,
      height: 2,
      pixels: [0x15, TRANSPARENT, TRANSPARENT, 0x15],
    });
  });

  it('should give an empty overlay for a glyph with no art', () => {
    expect(
      toGlyphOverlay({ advance: 3, top: 0, rows: [] }, 0x15).pixels,
    ).toEqual([]);
  });
});
