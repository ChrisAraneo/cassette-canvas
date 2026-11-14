import { describe, expect, it } from 'vitest';

import { SPRITE_SIZE } from '../../consts';
import { SIDEWALK_ROW } from '../consts';
import { computeBuildingTop } from './compute-building-top';

describe('computeBuildingTop', () => {
  it('should return the row that stands the building on the sidewalk when it has three rows of tiles', () => {
    expect(computeBuildingTop({ grid: ['ccc', 'xWx', 'xVx'] })).toBe(
      SIDEWALK_ROW - 3 * SPRITE_SIZE,
    );
  });
});
