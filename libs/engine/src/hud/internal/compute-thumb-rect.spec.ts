import { describe, expect, it } from 'vitest';

import { HUD_LIST_THUMB_HEIGHT } from '../consts';
import type { HudRect } from '../types/hud-rect';
import { computeThumbRect } from './compute-thumb-rect';

const TRACK: HudRect = Object.freeze({
  row: 32,
  column: 67,
  width: 11,
  height: 24,
});

describe('computeThumbRect', () => {
  it('should put the thumb at the top of the track when the list shows its first page', () => {
    expect(computeThumbRect(TRACK, 3, 6, 0, 3)).toMatchObject({
      row: 32,
      height: 12,
    });
  });

  it('should put the thumb at the bottom of the track when the list shows its last page', () => {
    expect(computeThumbRect(TRACK, 3, 6, 3, 3).row).toBe(32 + 24 - 12);
  });

  it('should leave the thumb no height when every item of the list fits in it at once', () => {
    expect(computeThumbRect(TRACK, 6, 6, 0, 0).height).toBe(0);
  });

  it('should leave the thumb no height when the track is shorter than the shortest thumb', () => {
    expect(
      computeThumbRect(
        { ...TRACK, height: HUD_LIST_THUMB_HEIGHT - 1 },
        3,
        6,
        0,
        3,
      ).height,
    ).toBe(0);
  });

  it('should keep the column and the width of the track when it places the thumb', () => {
    expect(computeThumbRect(TRACK, 3, 6, 0, 3)).toMatchObject({
      column: 67,
      width: 11,
    });
  });
});
