import { size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { toPixel } from '../../palette/to-pixel';
import { HUD_DIVIDER_HEIGHT } from '../consts';
import { createHudTheme } from '../create-hud-theme';
import { drawItemDivider } from './draw-item-divider';
import type { HudListPlacement } from './types/hud-list-placement';

const THEME = createHudTheme();

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

const ITEM_COUNT = 3;

describe('drawItemDivider', () => {
  it('should return the two lines of a groove when another item follows this one', () => {
    expect(size(drawItemDivider(PLACEMENT, 0, ITEM_COUNT, THEME))).toBe(2);
  });

  it('should put the groove right under the item when another item follows it', () => {
    expect(drawItemDivider(PLACEMENT, 0, ITEM_COUNT, THEME)[0]).toEqual({
      pixel: toPixel(THEME.color, THEME.shadow),
      row: 22 + 9,
      column: 12,
      width: 60,
      height: 1,
    });
  });

  it('should paint nothing when this is the last item the list shows', () => {
    expect(
      drawItemDivider(PLACEMENT, ITEM_COUNT - 1, ITEM_COUNT, THEME),
    ).toEqual([]);
  });

  it('should paint nothing when the list shows one item alone', () => {
    expect(drawItemDivider(PLACEMENT, 0, 1, THEME)).toEqual([]);
  });

  it('should make the groove as tall as a divider when it paints one', () => {
    expect(size(drawItemDivider(PLACEMENT, 0, ITEM_COUNT, THEME))).toBe(
      HUD_DIVIDER_HEIGHT,
    );
  });
});
