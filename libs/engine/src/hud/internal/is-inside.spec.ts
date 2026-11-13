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
  it('should hold the top-left pixel', () => {
    expect(isInside(BOX, 2, 3)).toBe(true);
  });

  it('should hold the bottom-right pixel', () => {
    expect(isInside(BOX, 6, 6)).toBe(true);
  });

  it('should leave out the row just past the bottom', () => {
    expect(isInside(BOX, 7, 4)).toBe(false);
  });

  it('should leave out the column just past the right', () => {
    expect(isInside(BOX, 4, 7)).toBe(false);
  });

  it('should leave out a pixel above and left of it', () => {
    expect(isInside(BOX, 1, 2)).toBe(false);
  });

  it('should hold nothing when it has no width', () => {
    expect(isInside({ ...BOX, width: 0 }, 2, 3)).toBe(false);
  });
});
