import { describe, expect, it } from 'vitest';

import { TRANSPARENT } from '../palette/consts';
import { toSprite } from './to-sprite';

const LEGEND = Object.freeze({ r: 0x14, g: 0x54 });

describe('toSprite', () => {
  it('should read the rows left to right and top to bottom when it turns art into a sprite', () => {
    expect(toSprite(['rg', 'gr'], LEGEND)).toEqual([0x14, 0x54, 0x54, 0x14]);
  });

  it('should make a pixel transparent when the legend does not know its character', () => {
    expect(toSprite(['r.', '.g'], LEGEND)).toEqual([
      0x14,
      TRANSPARENT,
      TRANSPARENT,
      0x54,
    ]);
  });

  it('should give an empty sprite when there are no rows', () => {
    expect(toSprite([], LEGEND)).toEqual([]);
  });
});
