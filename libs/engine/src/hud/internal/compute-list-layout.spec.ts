import { map, size, times } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import {
  HUD_CONTENT_LEFT,
  HUD_CONTENT_TOP,
  HUD_LIST_BAR_WIDTH,
  HUD_LIST_ITEM_HEIGHT,
  HUD_LIST_ITEM_PITCH,
} from '../consts';
import type { HudList } from '../types/hud-list';
import type { HudListItem } from '../types/hud-list-item';
import { computeListLayout } from './compute-list-layout';

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

/** Six tracks of two lines each, in the same list. */
const TALL_ITEMS: readonly HudListItem[] = Object.freeze(
  map(toItems(6), (item) => ({ ...item, lines: [...item.lines, '3:42'] })),
);

describe('computeListLayout', () => {
  it('should return as many items as the list holds at once when it lays one out', () => {
    expect(size(computeListLayout(LIST).items)).toBe(4);
  });

  it('should return the first item at the top left of the list when it lays one out', () => {
    expect(computeListLayout(LIST).items[0]?.rect).toEqual({
      row: HUD_CONTENT_TOP + 2,
      column: HUD_CONTENT_LEFT + 2,
      width: 66,
      height: HUD_LIST_ITEM_HEIGHT,
    });
  });

  it('should return the next item one item and one divider below the one before it', () => {
    expect(computeListLayout(LIST).items[1]?.rect.row).toBe(
      HUD_CONTENT_TOP + 2 + HUD_LIST_ITEM_PITCH,
    );
  });

  it('should return the items the scroll starts at when the list is scrolled', () => {
    expect(
      map(computeListLayout({ ...LIST, scroll: 2 }).items, 'item.id'),
    ).toEqual(['2', '3', '4', '5']);
  });

  it('should return the scroll fitted to the list when it is past the last page', () => {
    expect(computeListLayout({ ...LIST, scroll: 9 }).scroll).toBe(2);
  });

  it('should return the up arrow inside the top right corner when it lays a list out', () => {
    expect(computeListLayout(LIST).up).toEqual({
      row: HUD_CONTENT_TOP + 1,
      column: HUD_CONTENT_LEFT + 68,
      width: HUD_LIST_BAR_WIDTH,
      height: HUD_LIST_BAR_WIDTH,
    });
  });

  it('should return the down arrow inside the bottom right corner when it lays a list out', () => {
    expect(computeListLayout(LIST).down).toMatchObject({
      row: HUD_CONTENT_TOP + 36,
      height: HUD_LIST_BAR_WIDTH,
    });
  });

  it('should return the track between the two arrows when it lays a list out', () => {
    expect(computeListLayout(LIST).track).toMatchObject({
      row: HUD_CONTENT_TOP + 12,
      height: 24,
    });
  });

  it('should return a thumb as tall a part of the track as the items it shows are of the items it holds', () => {
    expect(computeListLayout(LIST).thumb.height).toBe(16);
  });

  it('should return the thumb at the top of the track when the list is not scrolled', () => {
    expect(computeListLayout(LIST).thumb.row).toBe(
      computeListLayout(LIST).track.row,
    );
  });

  it('should return the thumb at the bottom of the track when the list is on its last page', () => {
    const layout = computeListLayout({ ...LIST, scroll: 2 });

    expect(layout.thumb.row + layout.thumb.height).toBe(
      layout.track.row + layout.track.height,
    );
  });

  it('should return no thumb at all when every item fits in the list', () => {
    expect(computeListLayout({ ...LIST, items: toItems(4) }).thumb.height).toBe(
      0,
    );
  });

  it('should return no thumb at all when the list is too short for a track', () => {
    expect(
      computeListLayout({ ...LIST, height: 26, items: toItems(9) }).thumb
        .height,
    ).toBe(0);
  });

  it('should return the item the last page starts at when it lays a list out', () => {
    expect(computeListLayout(LIST).lastPage).toBe(2);
  });

  it('should return no last page at all when every item fits in the list', () => {
    expect(computeListLayout({ ...LIST, items: toItems(4) }).lastPage).toBe(0);
  });

  it('should return an item as tall as its lines when one holds more than one', () => {
    expect(
      computeListLayout({ ...LIST, items: TALL_ITEMS }).items[0]?.rect.height,
    ).toBe(2 * HUD_LIST_ITEM_HEIGHT);
  });

  it('should return fewer items when each one holds two lines', () => {
    expect(size(computeListLayout({ ...LIST, items: TALL_ITEMS }).items)).toBe(
      2,
    );
  });

  it('should return the item below a tall one a divider under it', () => {
    const layout = computeListLayout({ ...LIST, items: TALL_ITEMS });

    expect(layout.items[1]?.rect.row).toBe(
      (layout.items[0]?.rect.row ?? 0) + 2 * HUD_LIST_ITEM_HEIGHT + 2,
    );
  });

  it('should return the item the height it asks for when one asks for a height of its own', () => {
    expect(
      computeListLayout({
        ...LIST,
        items: map(toItems(6), (item) => ({ ...item, height: 20 })),
      }).items[0]?.rect.height,
    ).toBe(20);
  });

  it('should return the thumb at the bottom of the track when a list of taller items is on its last page', () => {
    const layout = computeListLayout({
      ...LIST,
      items: TALL_ITEMS,
      scroll: 4,
    });

    expect(layout.thumb.row + layout.thumb.height).toBe(
      layout.track.row + layout.track.height,
    );
  });

  it('should return no items at all when the list is empty', () => {
    expect(computeListLayout({ ...LIST, items: [] }).items).toEqual([]);
  });
});
