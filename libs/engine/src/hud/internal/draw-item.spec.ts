import { size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { createHudTheme } from '../create-hud-theme';
import type { HudList } from '../types/hud-list';
import { drawItem } from './draw-item';
import { drawItemDivider } from './draw-item-divider';
import { drawItemLines } from './draw-item-lines';
import { drawSelection } from './draw-selection';
import type { HudListPlacement } from './types/hud-list-placement';

const THEME = createHudTheme();

const PLACEMENT: HudListPlacement = Object.freeze({
  item: {
    id: 'track-1',
    lines: ['TRACK 1'],
    height: 0,
    widgets: [],
    selectable: true,
  },
  rect: { row: 22, column: 12, width: 60, height: 9 },
});

const LIST: HudList = Object.freeze({
  kind: 'LIST',
  id: 'tracks',
  page: '',
  row: 0,
  column: 0,
  width: 80,
  height: 48,
  items: [PLACEMENT.item],
  scroll: 0,
  selected: '',
});

const ITEM_COUNT = 3;

describe('drawItem', () => {
  it('should return the selection, the lines and the divider when it paints an item', () => {
    expect(drawItem(PLACEMENT, 0, ITEM_COUNT, LIST, THEME)).toEqual([
      ...drawSelection(PLACEMENT, LIST, THEME),
      ...drawItemLines(PLACEMENT, LIST, THEME),
      ...drawItemDivider(PLACEMENT, 0, ITEM_COUNT, THEME),
    ]);
  });

  it('should paint the selection behind the lines when the list has the item selected', () => {
    const selected: HudList = { ...LIST, selected: 'track-1' };

    expect(drawItem(PLACEMENT, 0, ITEM_COUNT, selected, THEME)[0]).toEqual(
      drawSelection(PLACEMENT, selected, THEME)[0],
    );
  });

  it('should paint the lines and the divider alone when the list has nothing selected', () => {
    expect(size(drawItem(PLACEMENT, 0, ITEM_COUNT, LIST, THEME))).toBe(3);
  });

  it('should paint no divider when this is the last item the list shows', () => {
    expect(size(drawItem(PLACEMENT, ITEM_COUNT - 1, ITEM_COUNT, LIST, THEME))) //
      .toBe(1);
  });

  it('should paint nothing at all when the item holds no lines and takes no selection', () => {
    expect(
      drawItem(
        { ...PLACEMENT, item: { ...PLACEMENT.item, lines: [] } },
        0,
        1,
        LIST,
        THEME,
      ),
    ).toEqual([]);
  });
});
