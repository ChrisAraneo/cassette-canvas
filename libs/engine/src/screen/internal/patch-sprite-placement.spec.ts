import { describe, expect, it } from 'vitest';

import type { SpritePlacement } from '../types/sprite-placement';
import { patchSpritePlacement } from './patch-sprite-placement';

const HERO_STANDING = Object.freeze([0x14, 0x15]);

const HERO_WALKING = Object.freeze([0x16, 0x17]);

const createHero = (): SpritePlacement => ({
  id: 'hero',
  sprite: HERO_STANDING,
  row: 3,
  column: 4,
  castsShadow: false,
});

const HERO: SpritePlacement = Object.freeze(createHero());

describe('patchSpritePlacement', () => {
  it('should return every change when the sprite carries the id', () => {
    expect(
      patchSpritePlacement(HERO, 'hero', {
        sprite: HERO_WALKING,
        row: 10,
        column: 20,
        castsShadow: true,
      }),
    ).toEqual({
      id: 'hero',
      sprite: HERO_WALKING,
      row: 10,
      column: 20,
      castsShadow: true,
    });
  });

  it('should return the parts that are not changed when only some change', () => {
    expect(patchSpritePlacement(HERO, 'hero', { column: 20 })).toEqual({
      ...HERO,
      column: 20,
    });
  });

  it('should not change the old sprite when it changes one', () => {
    const hero = createHero();

    patchSpritePlacement(hero, 'hero', { column: 20 });

    expect(hero).toEqual(createHero());
  });

  it('should return the very same sprite when it carries another id', () => {
    expect(patchSpritePlacement(HERO, 'coin', { column: 20 })).toBe(HERO);
  });
});
