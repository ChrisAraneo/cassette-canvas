import { map } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { GLYPH_PITCH } from './consts';
import { toTextPlacements } from './to-text-placements';
import type { Font } from './types/font';

const FONT: Font = Object.freeze({
  A: [{ sprite: [0x14], row: 0, column: 0 }],
  B: [{ sprite: [0x54], row: 0, column: 0 }],
});

const PLACE = Object.freeze({ id: 'label', row: 4, column: 10 });

describe('toTextPlacements', () => {
  it('should give the characters one pitch apart when it writes a line', () => {
    expect(map(toTextPlacements('AB', FONT, PLACE), 'column')).toEqual([
      10,
      10 + GLYPH_PITCH,
    ]);
  });

  it('should give each character in its own glyph when it writes a line', () => {
    expect(map(toTextPlacements('BA', FONT, PLACE), 'sprite')).toEqual([
      [0x54],
      [0x14],
    ]);
  });

  it('should leave a gap when the font does not know a character', () => {
    expect(map(toTextPlacements('A B', FONT, PLACE), 'id')).toEqual([
      'label-0-0-0',
      'label-2-0-0',
    ]);
  });

  it('should cast no shadow when it writes a line', () => {
    expect(toTextPlacements('A', FONT, PLACE)[0]?.castsShadow).toBe(false);
  });

  it('should give nothing when there is no text', () => {
    expect(toTextPlacements('', FONT, PLACE)).toEqual([]);
  });

  it('should not change the old font when it writes a line', () => {
    toTextPlacements('AB', FONT, PLACE);

    expect(FONT).toEqual({
      A: [{ sprite: [0x14], row: 0, column: 0 }],
      B: [{ sprite: [0x54], row: 0, column: 0 }],
    });
  });
});
