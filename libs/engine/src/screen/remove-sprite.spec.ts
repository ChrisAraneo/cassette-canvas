import { describe, expect, it } from 'vitest';

import { removeSprite } from './remove-sprite';
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

const createGameScreen = (): Screen => ({
  background: 0x91,
  ambient: 0,
  sprites: [HERO, COIN],
  lights: [],
  overlays: [],
});

describe('removeSprite', () => {
  it('should take the sprite off when the screen holds it', () => {
    expect(removeSprite(createGameScreen(), 'hero').sprites).toEqual([COIN]);
  });

  it('should keep every sprite when none carries the id', () => {
    expect(removeSprite(createGameScreen(), 'ghost').sprites).toEqual([
      HERO,
      COIN,
    ]);
  });

  it('should keep the background when it takes a sprite off', () => {
    expect(removeSprite(createGameScreen(), 'hero').background).toBe(0x91);
  });

  it('should give an empty screen when the screen is already empty', () => {
    expect(
      removeSprite({ ...createGameScreen(), sprites: [] }, 'hero').sprites,
    ).toEqual([]);
  });

  it('should not change the old screen when it takes a sprite off', () => {
    const screen = createGameScreen();

    removeSprite(screen, 'hero');

    expect(screen).toEqual(createGameScreen());
  });
});
