import { map, size, times } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { SPRITE_SIZE } from '../../consts';
import { createTileCandidates } from './create-tile-candidates';

const LEGEND = Object.freeze({ a: 0x14, b: 0x54 });

const createBand = (columns: number): readonly (readonly string[])[] =>
  times(SPRITE_SIZE, () => times(columns, () => 'a'));

describe('createTileCandidates', () => {
  it('should give one tile when the band is one sprite wide', () => {
    expect(
      size(
        createTileCandidates({
          bands: [createBand(SPRITE_SIZE)],
          legend: LEGEND,
        }).candidates,
      ),
    ).toBe(1);
  });

  it('should give the tiles left to right when the band is two sprites wide', () => {
    expect(
      map(
        createTileCandidates({
          bands: [createBand(2 * SPRITE_SIZE)],
          legend: LEGEND,
        }).candidates,
        'column',
      ),
    ).toEqual([0, SPRITE_SIZE]);
  });

  it('should give the tiles top to bottom when there are two bands', () => {
    expect(
      map(
        createTileCandidates({
          bands: [createBand(SPRITE_SIZE), createBand(SPRITE_SIZE)],
          legend: LEGEND,
        }).candidates,
        'row',
      ),
    ).toEqual([0, SPRITE_SIZE]);
  });

  it('should read every symbol through the legend when it cuts the tiles', () => {
    expect(
      createTileCandidates({
        bands: [times(SPRITE_SIZE, () => times(SPRITE_SIZE, () => 'b'))],
        legend: LEGEND,
      }).candidates[0]?.sprite[0],
    ).toBe(0x54);
  });

  it('should give no tiles when there are no bands', () => {
    expect(
      createTileCandidates({ bands: [], legend: LEGEND }).candidates,
    ).toEqual([]);
  });
});
