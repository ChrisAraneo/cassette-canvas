import { map, times } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import type { HudList } from '../types/hud-list';
import type { HudListItem } from '../types/hud-list-item';
import { computeListLayout } from './compute-list-layout';
import { computeListThumbScroll } from './compute-list-thumb-scroll';

const createItems = (count: number): readonly HudListItem[] =>
  map(times(count), (index) => ({
    id: `${index}`,
    lines: [`TRACK ${index}`],
    height: 0,
    widgets: [],
    selectable: true,
  }));

const LIST: HudList = Object.freeze({
  kind: 'LIST',
  id: 'tracks',
  page: '',
  row: 0,
  column: 0,
  width: 80,
  height: 48,
  items: createItems(6),
  scroll: 0,
  selected: '',
});

const LAYOUT = computeListLayout(LIST);

const THUMB_ROOM = LAYOUT.track.height - LAYOUT.thumb.height;

describe('computeListThumbScroll', () => {
  it('should return the first item when the thumb is at the top of the track', () => {
    expect(computeListThumbScroll(LIST, LAYOUT.track.row)).toBe(0);
  });

  it('should return the last page when the thumb is at the bottom of the track', () => {
    expect(computeListThumbScroll(LIST, LAYOUT.track.row + THUMB_ROOM)).toBe(2);
  });

  it('should return the page in between when the thumb is half way down the track', () => {
    expect(
      computeListThumbScroll(LIST, LAYOUT.track.row + THUMB_ROOM / 2),
    ).toBe(1);
  });

  it('should return the nearest page when the thumb is between two of them', () => {
    expect(computeListThumbScroll(LIST, LAYOUT.track.row + 3)).toBe(1);
  });

  it('should return the first item when the thumb is dragged above the track', () => {
    expect(computeListThumbScroll(LIST, LAYOUT.track.row - 40)).toBe(0);
  });

  it('should return the last page when the thumb is dragged below the track', () => {
    expect(computeListThumbScroll(LIST, LAYOUT.track.row + 400)).toBe(2);
  });

  it('should return no scroll at all when every item fits in the list', () => {
    expect(
      computeListThumbScroll({ ...LIST, items: createItems(4) }, 400),
    ).toBe(0);
  });

  it('should return the first item when the list holds no items', () => {
    expect(
      computeListThumbScroll({ ...LIST, items: [] }, LAYOUT.track.row),
    ).toBe(0);
  });

  it('should return the scroll the list has when it is too short for a thumb to drag', () => {
    expect(
      computeListThumbScroll(
        { ...LIST, height: 26, items: createItems(9), scroll: 2 },
        400,
      ),
    ).toBe(2);
  });
});
