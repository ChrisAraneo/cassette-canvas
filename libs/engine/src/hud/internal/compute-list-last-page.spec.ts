import { map, times } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import type { HudList } from '../types/hud-list';
import type { HudListItem } from '../types/hud-list-item';
import { computeListLastPage } from './compute-list-last-page';

const toItems = (count: number): readonly HudListItem[] =>
  map(times(count), (index) => ({
    id: `${index}`,
    lines: [`TRACK ${index}`],
    height: 0,
    widgets: [],
    selectable: true,
  }));

/** A list 48 rows tall, which shows four items of one line at once. */
const LIST: HudList = Object.freeze({
  kind: 'list',
  id: 'tracks',
  page: '',
  row: 0,
  column: 0,
  width: 80,
  height: 48,
  items: toItems(6),
  scroll: 0,
  selected: '',
});

/** The same six items, with a second line on the last of them. */
const TALL_ITEMS: readonly HudListItem[] = Object.freeze([
  ...toItems(5),
  {
    id: '5',
    lines: ['TRACK 5', '3:42'],
    height: 0,
    widgets: [],
    selectable: true,
  },
]);

describe('computeListLastPage', () => {
  it('should return the item the last page starts at when the list holds more than it shows', () => {
    expect(computeListLastPage(LIST)).toBe(2);
  });

  it('should return the first item when every item fits in the list at once', () => {
    expect(computeListLastPage({ ...LIST, items: toItems(4) })).toBe(0);
  });

  it('should return the first item when the list holds nothing', () => {
    expect(computeListLastPage({ ...LIST, items: [] })).toBe(0);
  });

  it('should return a later item when the last items take more rows than the others', () => {
    expect(computeListLastPage({ ...LIST, items: TALL_ITEMS })).toBe(3);
  });

  it('should return the last page of a taller list when the list grows', () => {
    expect(computeListLastPage({ ...LIST, height: 48 + 11 })).toBe(1);
  });
});
