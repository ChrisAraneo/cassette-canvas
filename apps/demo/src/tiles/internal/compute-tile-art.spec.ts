import { repeat, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { SPRITE_SIZE } from '../../consts';
import { computeTileArt } from './compute-tile-art';

const LEGEND = Object.freeze({ a: 0x14 });

const ROWS: readonly string[] = Object.freeze(['ab']);

describe('computeTileArt', () => {
  it('should pad the art to whole sprites when the art is smaller than one sprite', () => {
    const { art } = computeTileArt({ rows: ['ab'], legend: LEGEND });

    expect([size(art), size(art[0] ?? [])]).toEqual([SPRITE_SIZE, SPRITE_SIZE]);
  });

  it('should pad the short rows with blanks when the rows differ in width', () => {
    expect(computeTileArt({ rows: ['ab'], legend: LEGEND }).art[0]).toEqual([
      'a',
      'b',
      '.',
      '.',
      '.',
      '.',
      '.',
      '.',
    ]);
  });

  it('should keep the art as wide as the widest row when the art is wider than one sprite', () => {
    const wide = repeat('a', SPRITE_SIZE + 1);

    expect(
      size(computeTileArt({ rows: [wide], legend: LEGEND }).art[0] ?? []),
    ).toBe(2 * SPRITE_SIZE);
  });

  it('should give no rows when there is no art', () => {
    expect(computeTileArt({ rows: [], legend: LEGEND }).art).toEqual([]);
  });

  it('should pass the legend on when it pads the art', () => {
    expect(computeTileArt({ rows: ROWS, legend: LEGEND }).legend).toBe(LEGEND);
  });

  it('should not change the old rows when it pads the art', () => {
    computeTileArt({ rows: ROWS, legend: LEGEND });

    expect(ROWS).toEqual(['ab']);
  });
});
