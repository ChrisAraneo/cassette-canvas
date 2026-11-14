import { describe, expect, it } from 'vitest';

import type { HudRect } from '../types/hud-rect';
import { isInside } from './is-inside';

const BOX: HudRect = Object.freeze({
  row: 2,
  column: 3,
  width: 4,
  height: 5,
});

describe('isInside', () => {
  it('should return true when the point is the top-left pixel', () => {
    expect(isInside(BOX, 2, 3)).toBe(true);
  });

  it('should return true when the point is the bottom-right pixel', () => {
    expect(isInside(BOX, 6, 6)).toBe(true);
  });

  it('should return false when the row is just past the bottom', () => {
    expect(isInside(BOX, 7, 4)).toBe(false);
  });

  it('should return false when the column is just past the right', () => {
    expect(isInside(BOX, 4, 7)).toBe(false);
  });

  it('should return false when the point is above and left of the rectangle', () => {
    expect(isInside(BOX, 1, 2)).toBe(false);
  });

  it('should return false when the rectangle has no width', () => {
    expect(isInside({ ...BOX, width: 0 }, 2, 3)).toBe(false);
  });
});
