import { map } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { GLYPH_PITCH, placeText } from './place-text';

const FONT = Object.freeze({
  A: [{ sprite: [0x14], row: 0, column: 0 }],
  B: [{ sprite: [0x54], row: 0, column: 0 }],
});

describe('placeText', () => {
  it('should return the characters one pitch apart when it writes a line', () => {
    expect(
      map(placeText('AB', FONT, { id: 'label', row: 4, column: 10 }), 'column'),
    ).toEqual([10, 10 + GLYPH_PITCH]);
  });

  it('should return each character in its own glyph when it writes a line', () => {
    expect(
      map(placeText('BA', FONT, { id: 'label', row: 4, column: 10 }), 'sprite'),
    ).toEqual([[0x54], [0x14]]);
  });

  it('should return a gap when the font does not know a character', () => {
    expect(
      map(placeText('A B', FONT, { id: 'label', row: 4, column: 10 }), 'id'),
    ).toEqual(['label-0-0-0', 'label-2-0-0']);
  });

  it('should return no shadow casters when it writes a line', () => {
    expect(
      placeText('A', FONT, { id: 'label', row: 4, column: 10 })[0]?.castsShadow,
    ).toBe(false);
  });
});
