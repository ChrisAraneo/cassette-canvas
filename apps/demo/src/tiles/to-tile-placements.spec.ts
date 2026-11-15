import { describe, expect, it } from 'vitest';

import { toTilePlacements } from './to-tile-placements';
import type { Tile } from './types/tile';

const TILES: readonly Tile[] = Object.freeze([
  { sprite: [0x14], row: 0, column: 0 },
  { sprite: [0x54], row: 8, column: 16 },
]);

const PLACE = Object.freeze({
  id: 'tree',
  row: 100,
  column: 40,
  castsShadow: true,
});

describe('toTilePlacements', () => {
  it('should move every tile by the place of the art when it places the tiles', () => {
    expect(toTilePlacements(TILES, PLACE)).toEqual([
      {
        id: 'tree-0-0',
        sprite: [0x14],
        row: 100,
        column: 40,
        castsShadow: true,
      },
      {
        id: 'tree-8-16',
        sprite: [0x54],
        row: 108,
        column: 56,
        castsShadow: true,
      },
    ]);
  });

  it('should give no placements when there are no tiles', () => {
    expect(
      toTilePlacements([], {
        id: 'tree',
        row: 0,
        column: 0,
        castsShadow: false,
      }),
    ).toEqual([]);
  });

  it('should not change the old tiles when it places the tiles', () => {
    toTilePlacements(TILES, PLACE);

    expect(TILES).toEqual([
      { sprite: [0x14], row: 0, column: 0 },
      { sprite: [0x54], row: 8, column: 16 },
    ]);
  });
});
