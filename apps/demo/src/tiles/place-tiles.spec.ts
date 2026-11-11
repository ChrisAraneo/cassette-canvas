import { describe, expect, it } from 'vitest';

import { placeTiles } from './place-tiles';

const TILES = Object.freeze([
  { sprite: [0x14], row: 0, column: 0 },
  { sprite: [0x54], row: 8, column: 16 },
]);

describe('placeTiles', () => {
  it('should move every tile by the place of the art when it places the tiles', () => {
    expect(
      placeTiles(TILES, {
        id: 'tree',
        row: 100,
        column: 40,
        castsShadow: true,
      }),
    ).toEqual([
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

  it('should place nothing when there are no tiles', () => {
    expect(
      placeTiles([], { id: 'tree', row: 0, column: 0, castsShadow: false }),
    ).toEqual([]);
  });
});
