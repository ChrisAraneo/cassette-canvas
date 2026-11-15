import { describe, expect, it } from 'vitest';

import type { SpritePlacement } from '../types/sprite-placement';
import { filterOtherSprites } from './filter-other-sprites';

const createSpritePlacement = (id: string, pixel: number): SpritePlacement => ({
  id,
  sprite: [pixel],
  row: 0,
  column: 0,
  castsShadow: false,
});

const HERO = createSpritePlacement('hero', 0x14);

const COIN = createSpritePlacement('coin', 0x34);

const BAT = createSpritePlacement('bat', 0x04);

describe('filterOtherSprites', () => {
  it('should return the other sprites when one carries the id', () => {
    expect(filterOtherSprites([HERO, COIN, BAT], 'coin')).toEqual([HERO, BAT]);
  });

  it('should return every sprite in order when none carries the id', () => {
    expect(filterOtherSprites([HERO, COIN, BAT], 'ghost')).toEqual([
      HERO,
      COIN,
      BAT,
    ]);
  });

  it('should return no sprites when there are none', () => {
    expect(filterOtherSprites([], 'hero')).toEqual([]);
  });
});
