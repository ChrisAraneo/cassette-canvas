import { describe, expect, it } from 'vitest';

import { HUD_EDGE, HUD_LIST_BAR_WIDTH, HUD_PADDING } from '../consts';
import type { HudRect } from '../types/hud-rect';
import { computeItemWidth } from './compute-item-width';

const RECT: HudRect = Object.freeze({
  row: 20,
  column: 10,
  width: 80,
  height: 48,
});

describe('computeItemWidth', () => {
  it('should leave out the padding, the edge and the scroll bar when it measures an item', () => {
    expect(computeItemWidth(RECT)).toBe(
      80 - HUD_PADDING - HUD_EDGE - HUD_LIST_BAR_WIDTH,
    );
  });

  it('should leave the item less than no width when the list is narrower than its bar', () => {
    expect(computeItemWidth({ ...RECT, width: 0 })).toBeLessThan(0);
  });
});
