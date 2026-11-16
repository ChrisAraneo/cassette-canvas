import { describe, expect, it } from 'vitest';

import { HUD_UP_ART } from '../consts';
import { toArtWidth } from './to-art-width';

describe('toArtWidth', () => {
  it('should return the widest row of the art when it measures one', () => {
    expect(toArtWidth(HUD_UP_ART)).toBe(5);
  });

  it('should return the length of the row when the art holds one row', () => {
    expect(toArtWidth(['###'])).toBe(3);
  });

  it('should return no width when there is no art', () => {
    expect(toArtWidth([])).toBe(0);
  });
});
