import { map, times } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { HUD_LIST_ITEM_PITCH } from '../consts';
import type { HudListItem } from '../types/hud-list-item';
import { countFittingItems } from './count-fitting-items';

const toItems = (count: number): readonly HudListItem[] =>
  map(times(count), (index) => ({
    id: `${index}`,
    lines: [`TRACK ${index}`],
    height: 0,
    widgets: [],
    selectable: true,
  }));

const toItem = (height: number): HudListItem => ({
  id: `${height}`,
  lines: [],
  height,
  widgets: [],
  selectable: true,
});

describe('countFittingItems', () => {
  it('should return every item when they all fit in the room', () => {
    expect(countFittingItems(toItems(3), 3 * HUD_LIST_ITEM_PITCH)).toBe(3);
  });

  it('should return the items that fit when the room runs out', () => {
    expect(countFittingItems(toItems(6), 3 * HUD_LIST_ITEM_PITCH)).toBe(3);
  });

  it('should return no items when the room is too small for the first one', () => {
    expect(countFittingItems(toItems(6), 4)).toBe(0);
  });

  it('should return no items when there are none to count', () => {
    expect(countFittingItems([], 46)).toBe(0);
  });

  it('should return the items down to the first one that does not fit, whatever follows it', () => {
    expect(countFittingItems([toItem(4), toItem(40), toItem(4)], 20)).toBe(1);
  });

  it('should count each item as tall as it asks to be when they differ', () => {
    expect(countFittingItems([toItem(4), toItem(4), toItem(40)], 20)).toBe(2);
  });
});
