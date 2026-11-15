import { COLOR_COUNT, SHADE_COUNT, toPixel } from '@cassette-canvas/engine';
import { find, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { SPRITE_SIZE } from '../../consts';
import { SWATCH_LEFT, SWATCH_TOP } from '../consts';
import { createSwatchPlacements } from './create-swatch-placements';

const SWATCH_COLOR = 3;

const SWATCH_SHADE = 5;

const SWATCH_ID = `swatch-${SWATCH_COLOR}-${SWATCH_SHADE}`;

describe('createSwatchPlacements', () => {
  it('should give one swatch per shade of every color when it builds the chart', () => {
    expect(size(createSwatchPlacements())).toBe(COLOR_COUNT * SHADE_COUNT);
  });

  it('should give the colors in columns and the shades in rows when it builds the chart', () => {
    const swatch = find(
      createSwatchPlacements(),
      (placement) => placement.id === SWATCH_ID,
    );

    expect([swatch?.row, swatch?.column]).toEqual([
      SWATCH_TOP + SWATCH_SHADE * SPRITE_SIZE,
      SWATCH_LEFT + SWATCH_COLOR * SPRITE_SIZE,
    ]);
  });

  it('should give each swatch in its own color and shade when it builds the chart', () => {
    const swatch = find(
      createSwatchPlacements(),
      (placement) => placement.id === SWATCH_ID,
    );

    expect(swatch?.sprite[0]).toBe(toPixel(SWATCH_COLOR, SWATCH_SHADE));
  });
});
