import { describe, expect, it } from 'vitest';

import type { SpritePlacement } from '../types/sprite-placement';
import { filterOtherSprites } from './filter-other-sprites';

const placeSprite = (id: string, pixel: number): SpritePlacement => ({
  id,
  sprite: [pixel],
  row: 0,
  column: 0,
  castsShadow: false,
});

const HERO = placeSprite('hero', 0x14);

const COIN = placeSprite('coin', 0x34);

const BAT = placeSprite('bat', 0x04);

describe('filterOtherSprites', () => {
  it('should drop the sprite when it carries the id', () => {
    expect(filterOtherSprites([HERO, COIN, BAT], 'coin')).toEqual([HERO, BAT]);
  });

  it('should keep every sprite in order when none carries the id', () => {
    expect(filterOtherSprites([HERO, COIN, BAT], 'ghost')).toEqual([
      HERO,
      COIN,
      BAT,
    ]);
  });

  it('should give no sprites when there are none', () => {
    expect(filterOtherSprites([], 'hero')).toEqual([]);
  });
});
