import { type SpritePlacement, TRANSPARENT } from '@cassette-canvas/engine';
import { constant, map, times } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { SPRITE_SIZE } from '../../consts';
import { rejectCovered } from './reject-covered';

const SOLID = Object.freeze(times(SPRITE_SIZE * SPRITE_SIZE, constant(0x14)));

const DOT = Object.freeze([
  0x54,
  ...times(SPRITE_SIZE * SPRITE_SIZE - 1, constant(TRANSPARENT)),
]);

const place = (
  id: string,
  sprite: readonly number[],
  row: number,
  column: number,
): SpritePlacement => ({ id, sprite, row, column, castsShadow: false });

const WALL = Object.freeze([place('wall', SOLID, 10, 10)]);

describe('rejectCovered', () => {
  it('should leave out a placement when every one of its pixels is covered', () => {
    expect(rejectCovered([place('behind', SOLID, 10, 10)], WALL)).toEqual([]);
  });

  it('should keep a placement when one of its pixels shows', () => {
    expect(
      map(rejectCovered([place('peeking', SOLID, 10, 12)], WALL), 'id'),
    ).toEqual(['peeking']);
  });

  it('should only look at visible pixels when it checks a placement', () => {
    expect(rejectCovered([place('dot', DOT, 17, 17)], WALL)).toEqual([]);
  });

  it('should keep everything when nothing covers it', () => {
    expect(
      map(rejectCovered([place('free', SOLID, 10, 10)], []), 'id'),
    ).toEqual(['free']);
  });
});
