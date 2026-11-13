import { TRANSPARENT } from '@cassette-canvas/engine';
import { chunk, countBy, last, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { SPRITE_SIZE } from '../../consts';
import { createSwatchSprite } from './create-swatch-sprite';

describe('createSwatchSprite', () => {
  it('should fill a whole sprite when it paints a swatch', () => {
    expect(size(createSwatchSprite(0x35))).toBe(SPRITE_SIZE * SPRITE_SIZE);
  });

  it('should paint the swatch in its pixel when it fills the square', () => {
    expect(createSwatchSprite(0x35)[0]).toBe(0x35);
  });

  it('should leave a transparent gap along the bottom when it paints a swatch', () => {
    const rows = chunk(createSwatchSprite(0x35), SPRITE_SIZE);

    expect(countBy(last(rows))).toEqual({ [TRANSPARENT]: SPRITE_SIZE });
  });

  it('should leave a transparent gap along the right edge when it paints a swatch', () => {
    const rows = chunk(createSwatchSprite(0x35), SPRITE_SIZE);

    expect(rows[0]?.[SPRITE_SIZE - 1]).toBe(TRANSPARENT);
  });
});
