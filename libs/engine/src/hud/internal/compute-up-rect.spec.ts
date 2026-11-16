import { describe, expect, it } from 'vitest';

import { HUD_LIST_BAR_WIDTH } from '../consts';
import type { HudRect } from '../types/hud-rect';
import { computeUpRect } from './compute-up-rect';

const BAR: HudRect = Object.freeze({
  row: 21,
  column: 67,
  width: HUD_LIST_BAR_WIDTH,
  height: 46,
});

describe('computeUpRect', () => {
  it('should put a square at the top of the scroll bar when it places the up arrow', () => {
    expect(computeUpRect(BAR)).toEqual({
      row: 21,
      column: 67,
      width: HUD_LIST_BAR_WIDTH,
      height: HUD_LIST_BAR_WIDTH,
    });
  });

  it('should put the arrow at the top of the bar wherever the bar sits', () => {
    expect(computeUpRect({ ...BAR, row: 0 }).row).toBe(0);
  });
});
