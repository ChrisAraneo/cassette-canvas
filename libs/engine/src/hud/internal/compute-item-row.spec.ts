import { describe, expect, it } from 'vitest';

import { HUD_DIVIDER_HEIGHT, HUD_PADDING } from '../consts';
import type { HudRect } from '../types/hud-rect';
import { computeItemRow } from './compute-item-row';
import type { HudListPlacement } from './types/hud-list-placement';

const RECT: HudRect = Object.freeze({
  row: 20,
  column: 10,
  width: 80,
  height: 48,
});

const PLACEMENT: HudListPlacement = Object.freeze({
  item: {
    id: 'track-1',
    lines: ['TRACK 1'],
    height: 0,
    widgets: [],
    selectable: true,
  },
  rect: { row: 22, column: 12, width: 60, height: 9 },
});

describe('computeItemRow', () => {
  it('should put the first item inside the top padding of the list when nothing is placed yet', () => {
    expect(computeItemRow([], RECT)).toBe(20 + HUD_PADDING);
  });

  it('should put the next item below the item before it and its divider when one is placed', () => {
    expect(computeItemRow([PLACEMENT], RECT)).toBe(22 + 9 + HUD_DIVIDER_HEIGHT);
  });

  it('should measure from the last item placed when several are placed', () => {
    expect(
      computeItemRow(
        [PLACEMENT, { ...PLACEMENT, rect: { ...PLACEMENT.rect, row: 33 } }],
        RECT,
      ),
    ).toBe(33 + 9 + HUD_DIVIDER_HEIGHT);
  });
});
