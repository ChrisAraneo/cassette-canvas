import { describe, expect, it } from 'vitest';

import type { SpritePlacement } from '../../screen/types/sprite-placement';
import { computeSpritePixels } from './compute-sprite-pixels';

const HERO: SpritePlacement = Object.freeze({
  id: 'hero',
  sprite: [0x10, 0x11, 0x12, 0x13],
  row: 5,
  column: 7,
  castsShadow: false,
});

describe('computeSpritePixels', () => {
  it('should lay the pixels out row by row from the corner when the sprite is placed', () => {
    expect(computeSpritePixels(HERO, 2)).toEqual([
      { row: 5, column: 7, pixel: 0x10, castsShadow: false },
      { row: 5, column: 8, pixel: 0x11, castsShadow: false },
      { row: 6, column: 7, pixel: 0x12, castsShadow: false },
      { row: 6, column: 8, pixel: 0x13, castsShadow: false },
    ]);
  });

  it('should mark every pixel as a shadow caster when the sprite casts shadows', () => {
    expect(
      computeSpritePixels({ ...HERO, sprite: [0x10], castsShadow: true }, 1),
    ).toEqual([{ row: 5, column: 7, pixel: 0x10, castsShadow: true }]);
  });

  it('should leave out the extra pixels when the sprite holds more than its size', () => {
    expect(
      computeSpritePixels(
        { ...HERO, sprite: [0x10, 0x11, 0x12, 0x13, 0x14] },
        2,
      ),
    ).toHaveLength(4);
  });

  it('should snap the sprite to the pixel grid when it sits between pixels', () => {
    expect(
      computeSpritePixels(
        { ...HERO, sprite: [0x10], row: 2.75, column: -0.5 },
        1,
      ),
    ).toEqual([{ row: 2, column: -1, pixel: 0x10, castsShadow: false }]);
  });

  it('should give no pixels when the sprite is empty', () => {
    expect(computeSpritePixels({ ...HERO, sprite: [] }, 2)).toEqual([]);
  });
});
