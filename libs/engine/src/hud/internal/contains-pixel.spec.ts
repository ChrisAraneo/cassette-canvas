import { describe, expect, it } from 'vitest';

import type { HudRect } from '../types/hud-rect';
import { containsPixel } from './contains-pixel';

const BOX: HudRect = Object.freeze({
  row: 2,
  column: 3,
  width: 4,
  height: 5,
});

describe('containsPixel', () => {
  it('should return true when the point is the top-left pixel', () => {
    expect(containsPixel(BOX, 2, 3)).toBe(true);
  });

  it('should return true when the point is the bottom-right pixel', () => {
    expect(containsPixel(BOX, 6, 6)).toBe(true);
  });

  it('should return false when the row is just past the bottom', () => {
    expect(containsPixel(BOX, 7, 4)).toBe(false);
  });

  it('should return false when the column is just past the right', () => {
    expect(containsPixel(BOX, 4, 7)).toBe(false);
  });

  it('should return false when the point is above and left of the rectangle', () => {
    expect(containsPixel(BOX, 1, 2)).toBe(false);
  });

  it('should return false when the rectangle has no width', () => {
    expect(containsPixel({ ...BOX, width: 0 }, 2, 3)).toBe(false);
  });
});
