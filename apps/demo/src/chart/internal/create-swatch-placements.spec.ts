import { COLOR_COUNT, SHADE_COUNT } from '@cassette-canvas/engine';
import { find, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { SPRITE_SIZE } from '../../consts';
import { SWATCH_LEFT, SWATCH_TOP } from '../consts';
import { createSwatchPlacements } from './create-swatch-placements';

describe('createSwatchPlacements', () => {
  it('should lay out one swatch per shade of every color when it builds the chart', () => {
    expect(size(createSwatchPlacements())).toBe(COLOR_COUNT * SHADE_COUNT);
  });

  it('should put the colors in columns and the shades in rows when it builds the chart', () => {
    const swatch = find(
      createSwatchPlacements(),
      (placement) => placement.id === 'swatch-3-5',
    );

    expect([swatch?.row, swatch?.column]).toEqual([
      SWATCH_TOP + 5 * SPRITE_SIZE,
      SWATCH_LEFT + 3 * SPRITE_SIZE,
    ]);
  });

  it('should paint each swatch in its own color and shade when it builds the chart', () => {
    const swatch = find(
      createSwatchPlacements(),
      (placement) => placement.id === 'swatch-3-5',
    );

    expect(swatch?.sprite[0]).toBe(0x35);
  });
});
