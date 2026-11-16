import { map, times } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import type { HudList } from '../types/hud-list';
import type { HudListItem } from '../types/hud-list-item';
import { computeListLayout } from './compute-list-layout';
import { findItem } from './find-item';

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

const HEADING_LAYOUT = computeListLayout({
  ...LIST,
  items: [
    {
      id: 'side',
      lines: ['SIDE A'],
      height: 0,
      widgets: [],
      selectable: false,
    },
    ...createItems(3),
  ],
});

const INSIDE_ITEM = 2;

describe('findItem', () => {
  it('should find the item under the pointer when it sits on one', () => {
    const first = LAYOUT.items[0]?.rect;

    expect(
      findItem(
        LAYOUT,
        (first?.row ?? 0) + INSIDE_ITEM,
        (first?.column ?? 0) + INSIDE_ITEM,
      )?.id,
    ).toBe('0');
  });

  it('should find a later item when the pointer sits on that one', () => {
    const second = LAYOUT.items[1]?.rect;

    expect(
      findItem(
        LAYOUT,
        (second?.row ?? 0) + INSIDE_ITEM,
        (second?.column ?? 0) + INSIDE_ITEM,
      )?.id,
    ).toBe('1');
  });

  it('should find nothing when the pointer sits on no item at all', () => {
    expect(findItem(LAYOUT, 0, 0)).toBeUndefined();
  });

  it('should find nothing when the item under the pointer takes no selection', () => {
    const heading = HEADING_LAYOUT.items[0]?.rect;

    expect(
      findItem(
        HEADING_LAYOUT,
        (heading?.row ?? 0) + INSIDE_ITEM,
        (heading?.column ?? 0) + INSIDE_ITEM,
      ),
    ).toBeUndefined();
  });

  it('should find nothing when the list shows no items', () => {
    expect(
      findItem(computeListLayout({ ...LIST, items: [] }), 0, 0),
    ).toBeUndefined();
  });
});
