import { describe, expect, it } from 'vitest';

import { HUD_LIST_BAR_WIDTH } from '../consts';
import type { HudRect } from '../types/hud-rect';
import { computeDownRect } from './compute-down-rect';

const BAR: HudRect = Object.freeze({
  row: 21,
  column: 67,
  width: HUD_LIST_BAR_WIDTH,
  height: 46,
});

describe('computeDownRect', () => {
  it('should put a square at the bottom of the scroll bar when it places the down arrow', () => {
    expect(computeDownRect(BAR)).toEqual({
      row: 21 + 46 - HUD_LIST_BAR_WIDTH,
      column: 67,
      width: HUD_LIST_BAR_WIDTH,
      height: HUD_LIST_BAR_WIDTH,
    });
  });

  it('should put the arrow where the up arrow sits when the bar holds one square', () => {
    expect(computeDownRect({ ...BAR, height: HUD_LIST_BAR_WIDTH }).row).toBe(
      21,
    );
  });
});
