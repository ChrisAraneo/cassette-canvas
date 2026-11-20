import { describe, expect, it } from 'vitest';

import type { HudRect } from '../types/hud-rect';
import { computeScrolledThumb } from './compute-scrolled-thumb';

const TRACK: HudRect = Object.freeze({
  row: 32,
  column: 67,
  width: 11,
  height: 24,
});

const THUMB_HEIGHT = 12;

const LAST_PAGE = 3;

describe('computeScrolledThumb', () => {
  it('should put the thumb at the top of the track when the list shows its first page', () => {
    expect(computeScrolledThumb(TRACK, THUMB_HEIGHT, 0, LAST_PAGE)).toEqual({
      row: 32,
      column: 67,
      width: 11,
      height: THUMB_HEIGHT,
    });
  });

  it('should put the thumb at the bottom of the track when the list shows its last page', () => {
    expect(
      computeScrolledThumb(TRACK, THUMB_HEIGHT, LAST_PAGE, LAST_PAGE).row,
    ).toBe(32 + 24 - THUMB_HEIGHT);
  });

  it('should put the thumb partway down the track when the list is scrolled partway', () => {
    expect(computeScrolledThumb(TRACK, THUMB_HEIGHT, 1, LAST_PAGE).row).toBe(
      TRACK.row + (TRACK.height - THUMB_HEIGHT) / LAST_PAGE,
    );
  });

  it('should keep the height it was given when it places the thumb', () => {
    expect(computeScrolledThumb(TRACK, THUMB_HEIGHT, 1, LAST_PAGE).height).toBe(
      THUMB_HEIGHT,
    );
  });
});
