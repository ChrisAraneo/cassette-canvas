import { map, times } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import type { HudList } from '../types/hud-list';
import type { HudListItem } from '../types/hud-list-item';
import { computeListCapacity } from './compute-list-capacity';

const toItems = (count: number, lines = 1): readonly HudListItem[] =>
  map(times(count), (index) => ({
    id: `${index}`,
    lines: map(times(lines), (line) => `TRACK ${index} ${line}`),
    height: 0,
    widgets: [],
    selectable: true,
  }));

const createList = (
  height: number,
  items: readonly HudListItem[] = toItems(9),
): HudList => ({
  kind: 'list',
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

describe('computeListCapacity', () => {
  it('should return four items when the list is 48 rows tall', () => {
    expect(computeListCapacity(createList(48), 0)).toBe(4);
  });

  it('should return one item when the list is only as tall as one', () => {
    expect(computeListCapacity(createList(13), 0)).toBe(1);
  });

  it('should return one more item when the list grows by a whole item', () => {
    expect(computeListCapacity(createList(48 + 11), 0)).toBe(5);
  });

  it('should return no items when the list is too short for one', () => {
    expect(computeListCapacity(createList(8), 0)).toBe(0);
  });

  it('should return no items when the list has no height at all', () => {
    expect(computeListCapacity(createList(0), 0)).toBe(0);
  });

  it('should return no items when the list holds none at all', () => {
    expect(computeListCapacity(createList(48, []), 0)).toBe(0);
  });

  it('should return the items left when the scroll is near the end of the list', () => {
    expect(computeListCapacity(createList(48), 7)).toBe(2);
  });

  it('should return no items when the scroll is past the last of them', () => {
    expect(computeListCapacity(createList(48), 9)).toBe(0);
  });

  it('should return half as many items when each one holds two lines', () => {
    expect(computeListCapacity(createList(48, toItems(9, 2)), 0)).toBe(2);
  });

  it('should return as many items as fit when they are not all the same height', () => {
    expect(
      computeListCapacity(
        createList(48, [
          ...toItems(1),
          ...map(toItems(1, 2), (item) => ({ ...item, id: 'tall' })),
          ...toItems(3),
        ]),
        0,
      ),
    ).toBe(3);
  });

  it('should return the item it is given the height of when one asks for a height of its own', () => {
    expect(
      computeListCapacity(
        createList(
          48,
          map(toItems(9), (item) => ({ ...item, height: 20 })),
        ),
        0,
      ),
    ).toBe(2);
  });
});
