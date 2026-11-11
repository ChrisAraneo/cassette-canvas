import { describe, expect, it } from 'vitest';

import { patchSprite } from './patch-sprite';
import type { Screen } from './types/screen';
import type { SpritePlacement } from './types/sprite-placement';

const HERO_WALKING = Object.freeze([0x16, 0x17]);

const HERO: SpritePlacement = Object.freeze({
  id: 'hero',
  sprite: [0x14, 0x15],
  row: 3,
  column: 4,
  castsShadow: false,
});

const COIN: SpritePlacement = Object.freeze({
  id: 'coin',
  sprite: [0x34],
  row: 2,
  column: 5,
  castsShadow: false,
});

const createGameScreen = (): Screen => ({
  background: 0x91,
  ambient: 0,
  sprites: [HERO, COIN],
  lights: [],
});

describe('patchSprite', () => {
  it('should move the sprite when it gets a new row and column', () => {
    expect(
      patchSprite(createGameScreen(), 'hero', { row: 10, column: 20 })
        .sprites[0],
    ).toEqual({ ...HERO, row: 10, column: 20 });
  });

  it('should swap the sprite when it gets a new one', () => {
    expect(
      patchSprite(createGameScreen(), 'hero', { sprite: HERO_WALKING })
        .sprites[0],
    ).toEqual({ ...HERO, sprite: HERO_WALKING });
  });

  it('should make the sprite cast shadows when it is told to', () => {
    expect(
      patchSprite(createGameScreen(), 'hero', { castsShadow: true }).sprites[0]
        ?.castsShadow,
    ).toBe(true);
  });

  it('should leave the other sprites as they are when it changes one', () => {
    expect(
      patchSprite(createGameScreen(), 'hero', { row: 10 }).sprites[1],
    ).toBe(COIN);
  });

  it('should keep the drawing order when it changes a sprite', () => {
    expect(
      patchSprite(createGameScreen(), 'hero', { row: 10 }).sprites[0]?.id,
    ).toBe('hero');
  });

  it('should change nothing when no sprite carries the id', () => {
    expect(
      patchSprite(createGameScreen(), 'ghost', { row: 10 }).sprites,
    ).toEqual([HERO, COIN]);
  });

  it('should keep the background when it changes a sprite', () => {
    expect(
      patchSprite(createGameScreen(), 'hero', { row: 10 }).background,
    ).toBe(0x91);
  });

  it('should not change the old screen when it changes a sprite', () => {
    const screen = createGameScreen();

    patchSprite(screen, 'hero', { row: 10, column: 20 });

    expect(screen).toEqual(createGameScreen());
  });
});
