import { describe, expect, it } from 'vitest';

import { findSprite } from './find-sprite';
import type { Screen } from './types/screen';
import type { SpritePlacement } from './types/sprite-placement';

const HERO: SpritePlacement = {
  id: 'hero',
  sprite: [0x14],
  row: 0,
  column: 0,
  castsShadow: false,
};

const COIN: SpritePlacement = {
  id: 'coin',
  sprite: [0x34],
  row: 2,
  column: 5,
  castsShadow: false,
};

const createGameScreen = (sprites: SpritePlacement[]): Screen => ({
  background: 0x91,
  ambient: 0,
  sprites,
  lights: [],
  overlays: [],
});

describe('findSprite', () => {
  it('should give the placed sprite when the screen holds it', () => {
    expect(findSprite(createGameScreen([HERO, COIN]), 'coin')).toBe(COIN);
  });

  it('should give nothing when no sprite carries the id', () => {
    expect(findSprite(createGameScreen([HERO, COIN]), 'ghost')).toBeUndefined();
  });

  it('should give nothing when the screen is empty', () => {
    expect(findSprite(createGameScreen([]), 'hero')).toBeUndefined();
  });
});
