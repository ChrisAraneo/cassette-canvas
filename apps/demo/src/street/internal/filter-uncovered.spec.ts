import { type SpritePlacement, TRANSPARENT } from '@cassette-canvas/engine';
import { constant, map, times } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { SPRITE_SIZE } from '../../consts';
import { filterUncovered } from './filter-uncovered';

const SOLID = Object.freeze(times(SPRITE_SIZE * SPRITE_SIZE, constant(0x14)));

const DOT = Object.freeze([
  0x54,
  ...times(SPRITE_SIZE * SPRITE_SIZE - 1, constant(TRANSPARENT)),
]);

const createPlacement = (
  id: string,
  sprite: readonly number[],
  row: number,
  column: number,
): SpritePlacement => ({ id, sprite, row, column, castsShadow: false });

const WALL = Object.freeze([createPlacement('wall', SOLID, 10, 10)]);

describe('filterUncovered', () => {
  it('should return no placement when every one of its pixels is covered', () => {
    expect(
      filterUncovered([createPlacement('behind', SOLID, 10, 10)], WALL),
    ).toEqual([]);
  });

  it('should return the placement when one of its pixels shows', () => {
    expect(
      map(
        filterUncovered([createPlacement('peeking', SOLID, 10, 12)], WALL),
        'id',
      ),
    ).toEqual(['peeking']);
  });

  it('should return no placement when only its visible pixels are covered', () => {
    expect(
      filterUncovered([createPlacement('dot', DOT, 17, 17)], WALL),
    ).toEqual([]);
  });

  it('should return every placement when nothing covers them', () => {
    expect(
      map(filterUncovered([createPlacement('free', SOLID, 10, 10)], []), 'id'),
    ).toEqual(['free']);
  });
});
