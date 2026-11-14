import { map, times } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import type { HudList } from '../types/hud-list';
import type { HudListItem } from '../types/hud-list-item';
import { computeListScroll } from './compute-list-scroll';

const toItems = (count: number): readonly HudListItem[] =>
  map(times(count), (index) => ({
    id: `${index}`,
    lines: [`TRACK ${index}`],
    height: 0,
    widgets: [],
    selectable: true,
  }));

/** A list 48 rows tall, which shows four of its six items at once. */
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

describe('computeListScroll', () => {
  it('should return the scroll it is given when the list can hold it', () => {
    expect(computeListScroll(LIST, 1)).toBe(1);
  });

  it('should return the last page when the scroll is past it', () => {
    expect(computeListScroll(LIST, 5)).toBe(2);
  });

  it('should return the first item when the scroll is below it', () => {
    expect(computeListScroll(LIST, -3)).toBe(0);
  });

  it('should return a whole item when the scroll is a fraction', () => {
    expect(computeListScroll(LIST, 1.8)).toBe(1);
  });

  it('should return no scroll at all when every item fits in the list', () => {
    expect(computeListScroll({ ...LIST, items: toItems(3) }, 2)).toBe(0);
  });

  it('should return no scroll at all when the list is empty', () => {
    expect(computeListScroll({ ...LIST, items: [] }, 2)).toBe(0);
  });
});
