import { describe, expect, it } from 'vitest';

import { patchSpriteByOffset } from './patch-sprite-by-offset';
import type { Screen } from './types/screen';

const HERO = Object.freeze([0x14, 0x15]);

const createHeroScreen = (): Screen => ({
  background: 0x91,
  ambient: 0,
  sprites: [
    { id: 'hero', sprite: HERO, row: 3, column: 4, castsShadow: false },
  ],
  lights: [],
  overlays: [],
});

describe('patchSpriteByOffset', () => {
  it('should move the sprite down and right when the offsets are positive', () => {
    expect(
      patchSpriteByOffset(createHeroScreen(), 'hero', 2, 5).sprites,
    ).toEqual([
      { id: 'hero', sprite: HERO, row: 5, column: 9, castsShadow: false },
    ]);
  });

  it('should move the sprite up and left when the offsets are negative', () => {
    expect(
      patchSpriteByOffset(createHeroScreen(), 'hero', -4, -6).sprites,
    ).toEqual([
      { id: 'hero', sprite: HERO, row: -1, column: -2, castsShadow: false },
    ]);
  });

  it('should give back the very same screen when no sprite carries the id', () => {
    const screen = createHeroScreen();

    expect(patchSpriteByOffset(screen, 'ghost', 2, 5)).toBe(screen);
  });

  it('should not change the old screen when it moves a sprite', () => {
    const screen = createHeroScreen();

    patchSpriteByOffset(screen, 'hero', 2, 5);

    expect(screen).toEqual(createHeroScreen());
  });
});
