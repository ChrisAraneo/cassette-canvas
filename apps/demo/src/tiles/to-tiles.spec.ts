import { TRANSPARENT } from '@cassette-canvas/engine';
import { constant, map, repeat, size, times } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { SPRITE_SIZE } from '../consts';
import { toTiles } from './to-tiles';

const LEGEND = Object.freeze({ a: 0x14, b: 0x54 });

const FULL_ROW = repeat('a', SPRITE_SIZE);

describe('toTiles', () => {
  it('should return the tiles left to right when the art is two sprites wide', () => {
    expect(
      map(
        toTiles(times(SPRITE_SIZE, constant(FULL_ROW + FULL_ROW)), LEGEND),
        ({ row, column }) => [row, column],
      ),
    ).toEqual([
      [0, 0],
      [0, SPRITE_SIZE],
    ]);
  });

  it('should return the tiles top to bottom when the art is two sprites tall', () => {
    expect(
      map(
        toTiles(times(2 * SPRITE_SIZE, constant(FULL_ROW)), LEGEND),
        ({ row, column }) => [row, column],
      ),
    ).toEqual([
      [0, 0],
      [SPRITE_SIZE, 0],
    ]);
  });

  it('should return each tile read through the legend when it cuts the art', () => {
    expect(toTiles(['ab'], LEGEND)[0]?.sprite[1]).toBe(0x54);
  });

  it('should return short rows and a short last band padded with transparent pixels when the art is small', () => {
    const sprite = toTiles(['ab'], LEGEND)[0]?.sprite ?? [];

    expect([size(sprite), sprite[2], sprite[SPRITE_SIZE]]).toEqual([
      SPRITE_SIZE * SPRITE_SIZE,
      TRANSPARENT,
      TRANSPARENT,
    ]);
  });

  it('should return no tile when it has no visible pixel', () => {
    expect(
      map(
        toTiles(times(SPRITE_SIZE, constant(`${FULL_ROW}........`)), LEGEND),
        'column',
      ),
    ).toEqual([0]);
  });

  it('should return no tiles when there is no art', () => {
    expect(toTiles([], LEGEND)).toEqual([]);
  });
});
