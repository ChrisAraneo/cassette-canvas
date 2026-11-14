import { describe, expect, it } from 'vitest';

import { HUD_CONTROL_HEIGHT, HUD_LIST_ITEM_HEIGHT } from '../consts';
import type { HudItemWidget } from '../types/hud-item-widget';
import type { HudListItem } from '../types/hud-list-item';
import { computeItemHeight } from './compute-item-height';

/** A play button three rows down the item it sits on. */
const PLAY: HudItemWidget = Object.freeze({
  kind: 'button',
  id: 'play',
  page: '',
  row: 3,
  column: 40,
  width: 30,
  text: 'PLAY',
});

const ITEM: HudListItem = Object.freeze({
  id: 'neon',
  lines: ['NEON RAIN'],
  height: 0,
  widgets: [],
  selectable: true,
});

describe('computeItemHeight', () => {
  it('should return the rows one line takes when the item holds one line', () => {
    expect(computeItemHeight(ITEM)).toBe(HUD_LIST_ITEM_HEIGHT);
  });

  it('should return twice that when the item holds two lines', () => {
    expect(computeItemHeight({ ...ITEM, lines: ['NEON RAIN', '3:42'] })).toBe(
      2 * HUD_LIST_ITEM_HEIGHT,
    );
  });

  it('should return the rows one line takes when the item holds no lines at all', () => {
    expect(computeItemHeight({ ...ITEM, lines: [] })).toBe(
      HUD_LIST_ITEM_HEIGHT,
    );
  });

  it('should return the height the item asks for when it asks for one', () => {
    expect(computeItemHeight({ ...ITEM, height: 24 })).toBe(24);
  });

  it('should return as far as a widget reaches when it needs more room than the lines', () => {
    expect(computeItemHeight({ ...ITEM, widgets: [PLAY] })).toBe(
      3 + HUD_CONTROL_HEIGHT,
    );
  });

  it('should return the rows the lines take when they need more room than the widgets', () => {
    expect(
      computeItemHeight({
        ...ITEM,
        lines: ['NEON RAIN', '3:42'],
        widgets: [PLAY],
      }),
    ).toBe(2 * HUD_LIST_ITEM_HEIGHT);
  });

  it('should return the height the item asks for even when a widget reaches past it', () => {
    expect(computeItemHeight({ ...ITEM, height: 10, widgets: [PLAY] })).toBe(
      10,
    );
  });
});
