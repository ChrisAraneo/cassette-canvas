import { describe, expect, it } from 'vitest';

import { HUD_EDGE, HUD_LIST_BAR_WIDTH } from '../consts';
import type { HudRect } from '../types/hud-rect';
import { computeBarRect } from './compute-bar-rect';

const RECT: HudRect = Object.freeze({
  row: 20,
  column: 10,
  width: 80,
  height: 48,
});

describe('computeBarRect', () => {
  it('should put the scroll bar inside the right edge of the list when it places one', () => {
    expect(computeBarRect(RECT)).toEqual({
      row: 20 + HUD_EDGE,
      column: 10 + 80 - HUD_EDGE - HUD_LIST_BAR_WIDTH,
      width: HUD_LIST_BAR_WIDTH,
      height: 48 - 2 * HUD_EDGE,
    });
  });

  it('should leave the bar no height when the list is as tall as its two edges', () => {
    expect(computeBarRect({ ...RECT, height: 2 * HUD_EDGE }).height).toBe(0);
  });
});
