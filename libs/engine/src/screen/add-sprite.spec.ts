import { map } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { addSprite } from './add-sprite';
import type { Screen } from './types/screen';

const HERO = Object.freeze([0x14, 0x15]);

const COIN = Object.freeze([0x34]);

const createCoinScreen = (): Screen => ({
  background: 0x91,
  ambient: 0,
  sprites: [{ id: 'coin', sprite: COIN, row: 2, column: 5, castsShadow: true }],
  lights: [],
});

describe('addSprite', () => {
  it('should place the sprite at the row and column when it adds it', () => {
    const screen = addSprite(createCoinScreen(), 'hero', HERO, 3, 4);

    expect(screen.sprites[1]).toEqual({
      id: 'hero',
      sprite: HERO,
      row: 3,
      column: 4,
      castsShadow: false,
    });
  });

  it('should put the sprite on top when the screen already holds others', () => {
    const screen = addSprite(createCoinScreen(), 'hero', HERO, 3, 4);

    expect(map(screen.sprites, (placement) => placement.id)).toEqual([
      'coin',
      'hero',
    ]);
  });

  it('should take the old sprite off when one with the same id is placed again', () => {
    const screen = addSprite(createCoinScreen(), 'coin', COIN, 9, 9);

    expect(screen.sprites).toEqual([
      { id: 'coin', sprite: COIN, row: 9, column: 9, castsShadow: false },
    ]);
  });

  it('should keep the background when it adds a sprite', () => {
    expect(addSprite(createCoinScreen(), 'hero', HERO, 3, 4).background).toBe(
      0x91,
    );
  });

  it('should keep the very same lights when it adds a sprite', () => {
    const screen = createCoinScreen();

    expect(addSprite(screen, 'hero', HERO, 3, 4).lights).toBe(screen.lights);
  });

  it('should place the sprite when the screen is empty', () => {
    const screen = addSprite(
      { ...createCoinScreen(), sprites: [] },
      'hero',
      HERO,
      0,
      0,
    );

    expect(screen.sprites).toEqual([
      { id: 'hero', sprite: HERO, row: 0, column: 0, castsShadow: false },
    ]);
  });

  it('should not change the old screen when it adds a sprite', () => {
    const screen = createCoinScreen();

    addSprite(screen, 'hero', HERO, 3, 4);

    expect(screen).toEqual(createCoinScreen());
  });
});
