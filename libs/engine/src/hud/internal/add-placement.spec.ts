import { size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { HUD_DIVIDER_HEIGHT, HUD_PADDING } from '../consts';
import type { HudListItem } from '../types/hud-list-item';
import type { HudRect } from '../types/hud-rect';
import { addPlacement } from './add-placement';
import { computeItemHeight } from './compute-item-height';
import { computeItemWidth } from './compute-item-width';
import type { HudListPlacement } from './types/hud-list-placement';

const RECT: HudRect = Object.freeze({
  row: 20,
  column: 10,
  width: 80,
  height: 48,
});

const ITEM: HudListItem = Object.freeze({
  id: 'track-1',
  lines: Object.freeze(['TRACK 1']),
  height: 0,
  widgets: Object.freeze([]),
  selectable: true,
});

const TALL_ITEM: HudListItem = Object.freeze({
  ...ITEM,
  id: 'track-2',
  lines: Object.freeze(['TRACK 2', '3:42']),
});

const createPlaced = (): HudListPlacement[] => [];

describe('addPlacement', () => {
  it('should place the first item inside the top padding of the list when it adds one', () => {
    expect(addPlacement(createPlaced(), ITEM, RECT)[0]?.rect).toEqual({
      row: 20 + HUD_PADDING,
      column: 10 + HUD_PADDING,
      width: computeItemWidth(RECT),
      height: computeItemHeight(ITEM),
    });
  });

  it('should place the next item below the one before it and its divider when it adds one', () => {
    expect(
      addPlacement(addPlacement(createPlaced(), ITEM, RECT), TALL_ITEM, RECT)[1]
        ?.rect.row,
    ).toBe(20 + HUD_PADDING + computeItemHeight(ITEM) + HUD_DIVIDER_HEIGHT);
  });

  it('should carry the item itself on the placement when it adds one', () => {
    expect(addPlacement(createPlaced(), ITEM, RECT)[0]?.item).toBe(ITEM);
  });

  it('should keep the placements it was given when it adds one', () => {
    expect(
      size(
        addPlacement(addPlacement(createPlaced(), ITEM, RECT), TALL_ITEM, RECT),
      ),
    ).toBe(2);
  });

  it('should not change the placements it was given when it adds one', () => {
    const placed = createPlaced();

    addPlacement(placed, ITEM, RECT);

    expect(placed).toEqual(createPlaced());
  });
});
