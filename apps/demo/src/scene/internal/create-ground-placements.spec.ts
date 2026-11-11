import { every, first, last, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { GRASS } from '../../art/consts';
import { GROUND_ROW, SCREEN_WIDTH, SPRITE_SIZE } from '../consts';
import { createGroundPlacements } from './create-ground-placements';

describe('createGroundPlacements', () => {
  it('should tile the ground across the whole width when it lays the grass', () => {
    expect(size(createGroundPlacements())).toBe(SCREEN_WIDTH / SPRITE_SIZE);
  });

  it('should run the tiles from the left edge to the right one when it lays the grass', () => {
    const tiles = createGroundPlacements();

    expect(first(tiles)?.column).toBe(0);
    expect(last(tiles)?.column).toBe(SCREEN_WIDTH - SPRITE_SIZE);
  });

  it('should lay every tile on the bottom row in grass when it lays the ground', () => {
    expect(
      every(
        createGroundPlacements(),
        (tile) => tile.row === GROUND_ROW && tile.sprite === GRASS,
      ),
    ).toBe(true);
  });
});
