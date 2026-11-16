import { map, times } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { HUD_LIST_ITEM_PITCH } from '../consts';
import type { HudList } from '../types/hud-list';
import type { HudListItem } from '../types/hud-list-item';
import { countListCapacity } from './count-list-capacity';

const createItems = (count: number, lines = 1): readonly HudListItem[] =>
  map(times(count), (index) => ({
    id: `${index}`,
    lines: map(times(lines), (line) => `TRACK ${index} ${line}`),
    height: 0,
    widgets: [],
    selectable: true,
  }));

const createList = (
  height: number,
  items: readonly HudListItem[] = createItems(9),
): HudList => ({
  kind: 'LIST',
  id: 'tracks',
  page: '',
  row: 0,
  column: 0,
  width: 80,
  height,
  items,
  scroll: 0,
  selected: '',
});

describe('countListCapacity', () => {
  it('should return four items when the list is 48 rows tall', () => {
    expect(countListCapacity(createList(48), 0)).toBe(4);
  });

  it('should return one item when the list is only as tall as one', () => {
    expect(countListCapacity(createList(13), 0)).toBe(1);
  });

  it('should return one more item when the list grows by a whole item', () => {
    expect(countListCapacity(createList(48 + HUD_LIST_ITEM_PITCH), 0)).toBe(5);
  });

  it('should return no items when the list is too short for one', () => {
    expect(countListCapacity(createList(8), 0)).toBe(0);
  });

  it('should return no items when the list has no height at all', () => {
    expect(countListCapacity(createList(0), 0)).toBe(0);
  });

  it('should return no items when the list holds none at all', () => {
    expect(countListCapacity(createList(48, []), 0)).toBe(0);
  });

  it('should return the items left when the scroll is near the end of the list', () => {
    expect(countListCapacity(createList(48), 7)).toBe(2);
  });

  it('should return no items when the scroll is past the last of them', () => {
    expect(countListCapacity(createList(48), 9)).toBe(0);
  });

  it('should return half as many items when each one holds two lines', () => {
    expect(countListCapacity(createList(48, createItems(9, 2)), 0)).toBe(2);
  });

  it('should return as many items as fit when they are not all the same height', () => {
    expect(
      countListCapacity(
        createList(48, [
          ...createItems(1),
          ...map(createItems(1, 2), (item) => ({ ...item, id: 'tall' })),
          ...createItems(3),
        ]),
        0,
      ),
    ).toBe(3);
  });

  it('should return the item it is given the height of when one asks for a height of its own', () => {
    expect(
      countListCapacity(
        createList(
          48,
          map(createItems(9), (item) => ({ ...item, height: 20 })),
        ),
        0,
      ),
    ).toBe(2);
  });
});
