import { map, times } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import type { HudList } from '../types/hud-list';
import type { HudListItem } from '../types/hud-list-item';
import { computeListLayout } from './compute-list-layout';
import { toListPress } from './to-list-press';

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

const INSIDE_PART = 2;

describe('toListPress', () => {
  it('should read a press on the up arrow when the pointer sits on it', () => {
    expect(
      toListPress(
        LAYOUT,
        LAYOUT.up.row + INSIDE_PART,
        LAYOUT.up.column + INSIDE_PART,
      ),
    ).toMatchObject({ up: true, down: false });
  });

  it('should read a press on the down arrow when the pointer sits on it', () => {
    expect(
      toListPress(
        LAYOUT,
        LAYOUT.down.row + INSIDE_PART,
        LAYOUT.down.column + INSIDE_PART,
      ),
    ).toMatchObject({ up: false, down: true });
  });

  it('should read a press on the thumb when the pointer sits on it', () => {
    expect(
      toListPress(
        LAYOUT,
        LAYOUT.thumb.row + INSIDE_PART,
        LAYOUT.thumb.column + INSIDE_PART,
      ).thumb,
    ).toBe(true);
  });

  it('should read the item under the pointer when it sits on one', () => {
    const first = LAYOUT.items[0]?.rect;

    expect(
      toListPress(
        LAYOUT,
        (first?.row ?? 0) + INSIDE_PART,
        (first?.column ?? 0) + INSIDE_PART,
      ).item?.id,
    ).toBe('0');
  });

  it('should read nothing at all when the pointer sits on no part of the list', () => {
    expect(toListPress(LAYOUT, 0, 0)).toEqual({
      up: false,
      down: false,
      thumb: false,
      item: undefined,
    });
  });

  it('should read no item when the list shows none', () => {
    expect(
      toListPress(computeListLayout({ ...LIST, items: [] }), 0, 0).item,
    ).toBeUndefined();
  });
});
