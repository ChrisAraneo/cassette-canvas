import { size, times } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { SPRITE_SIZE } from '../../consts';
import { computeTileBands } from './compute-tile-bands';

const LEGEND = Object.freeze({ a: 0x14 });

const createArt = (rows: number): readonly (readonly string[])[] =>
  times(rows, () => times(SPRITE_SIZE, () => 'a'));

describe('computeTileBands', () => {
  it('should give one band when the art is one sprite tall', () => {
    expect(
      size(
        computeTileBands({ art: createArt(SPRITE_SIZE), legend: LEGEND }).bands,
      ),
    ).toBe(1);
  });

  it('should give one band per sprite when the art is two sprites tall', () => {
    expect(
      size(
        computeTileBands({ art: createArt(2 * SPRITE_SIZE), legend: LEGEND })
          .bands,
      ),
    ).toBe(2);
  });

  it('should give every row of the band when it cuts the art', () => {
    expect(
      size(
        computeTileBands({ art: createArt(SPRITE_SIZE), legend: LEGEND })
          .bands[0] ?? [],
      ),
    ).toBe(SPRITE_SIZE);
  });

  it('should give no bands when there is no art', () => {
    expect(computeTileBands({ art: [], legend: LEGEND }).bands).toEqual([]);
  });

  it('should pass the legend on when it cuts the art', () => {
    expect(computeTileBands({ art: [], legend: LEGEND }).legend).toBe(LEGEND);
  });
});
