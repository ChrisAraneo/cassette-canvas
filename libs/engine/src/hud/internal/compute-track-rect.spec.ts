import { describe, expect, it } from 'vitest';

import { HUD_LIST_BAR_WIDTH } from '../consts';
import type { HudRect } from '../types/hud-rect';
import { computeTrackRect } from './compute-track-rect';

const BAR: HudRect = Object.freeze({
  row: 21,
  column: 67,
  width: HUD_LIST_BAR_WIDTH,
  height: 46,
});

describe('computeTrackRect', () => {
  it('should leave the two arrows out of the track when it places one', () => {
    expect(computeTrackRect(BAR)).toEqual({
      row: 21 + HUD_LIST_BAR_WIDTH,
      column: 67,
      width: HUD_LIST_BAR_WIDTH,
      height: 46 - 2 * HUD_LIST_BAR_WIDTH,
    });
  });

  it('should leave the track no height when the bar holds only its two arrows', () => {
    expect(
      computeTrackRect({ ...BAR, height: 2 * HUD_LIST_BAR_WIDTH }).height,
    ).toBe(0);
  });
});
