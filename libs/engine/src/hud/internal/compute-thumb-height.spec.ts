import { describe, expect, it } from 'vitest';

import { HUD_LIST_THUMB_HEIGHT } from '../consts';
import type { HudRect } from '../types/hud-rect';
import { computeThumbHeight } from './compute-thumb-height';

const TRACK: HudRect = Object.freeze({
  row: 32,
  column: 67,
  width: 11,
  height: 24,
});

describe('computeThumbHeight', () => {
  it('should make the thumb the share of the track the page takes of the list', () => {
    expect(computeThumbHeight(TRACK, 3, 6)).toBe(12);
  });

  it('should make the thumb fill the track when the page holds every item', () => {
    expect(computeThumbHeight(TRACK, 6, 6)).toBe(24);
  });

  it('should keep the thumb at its shortest when the list holds far more than it shows', () => {
    expect(computeThumbHeight(TRACK, 1, 100)).toBe(HUD_LIST_THUMB_HEIGHT);
  });

  it('should keep the thumb at its shortest when the track has no height', () => {
    expect(computeThumbHeight({ ...TRACK, height: 0 }, 3, 6)).toBe(
      HUD_LIST_THUMB_HEIGHT,
    );
  });
});
