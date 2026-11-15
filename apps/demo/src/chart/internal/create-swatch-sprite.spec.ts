import { TRANSPARENT, toPixel } from '@cassette-canvas/engine';
import { chunk, countBy, last, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { SPRITE_SIZE } from '../../consts';
import { createSwatchSprite } from './create-swatch-sprite';

const SWATCH_COLOR = 3;

const SWATCH_SHADE = 5;

const SWATCH_PIXEL = toPixel(SWATCH_COLOR, SWATCH_SHADE);

describe('createSwatchSprite', () => {
  it('should give a whole sprite when it paints a swatch', () => {
    expect(size(createSwatchSprite(SWATCH_PIXEL))).toBe(
      SPRITE_SIZE * SPRITE_SIZE,
    );
  });

  it('should give the swatch in its pixel when it fills the square', () => {
    expect(createSwatchSprite(SWATCH_PIXEL)[0]).toBe(SWATCH_PIXEL);
  });

  it('should leave a transparent gap along the bottom when it paints a swatch', () => {
    const rows = chunk(createSwatchSprite(SWATCH_PIXEL), SPRITE_SIZE);

    expect(countBy(last(rows))).toEqual({ [TRANSPARENT]: SPRITE_SIZE });
  });

  it('should leave a transparent gap along the right edge when it paints a swatch', () => {
    const rows = chunk(createSwatchSprite(SWATCH_PIXEL), SPRITE_SIZE);

    expect(rows[0]?.[SPRITE_SIZE - 1]).toBe(TRANSPARENT);
  });
});
