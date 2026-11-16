import { map } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { HUD_CONTROL_HEIGHT } from '../consts';
import type { HudItemWidget } from '../types/hud-item-widget';
import type { HudList } from '../types/hud-list';
import type { HudListItem } from '../types/hud-list-item';
import { computeListLayout } from './compute-list-layout';
import { computeWidgetRect } from './compute-widget-rect';
import { toListWidgets } from './to-list-widgets';

const PLAY_ROW = 3;

const PLAY_COLUMN = 40;

const PLAY_WIDTH = 20;

const FIRST_ITEM_INDEX = 0;

const FIRST_ITEM_BUTTON_INDEX = 1;

const toPlay = (id: string): HudItemWidget => ({
  kind: 'BUTTON',
  id: `play-${id}`,
  page: '',
  row: PLAY_ROW,
  column: PLAY_COLUMN,
  width: PLAY_WIDTH,
  text: 'PLAY',
});

const toItem = (id: string): HudListItem => ({
  id,
  lines: [`SIDE ${id}`],
  height: 20,
  widgets: [toPlay(id)],
  selectable: true,
});

const LIST: HudList = Object.freeze({
  kind: 'LIST',
  id: 'tracks',
  page: '',
  row: 0,
  column: 0,
  width: 80,
  height: 48,
  items: [toItem('a'), toItem('b'), toItem('c')],
  scroll: 0,
  selected: '',
});

const toIds = (list: HudList): readonly string[] =>
  map(toListWidgets(list), (placed) => placed.widget.id);

describe('toListWidgets', () => {
  it('should return the list before the widgets of the items it shows when it lists what a list shows', () => {
    expect(toIds(LIST)).toEqual(['tracks', 'play-a', 'play-b']);
  });

  it('should return no widget of an item when the list does not show that item', () => {
    expect(toIds(LIST)).not.toContain('play-c');
  });

  it('should return the widgets of the items the list is scrolled to when it is scrolled', () => {
    expect(toIds({ ...LIST, scroll: 1 })).toEqual([
      'tracks',
      'play-b',
      'play-c',
    ]);
  });

  it('should return the very same list first when it lists what a list shows', () => {
    expect(toListWidgets(LIST)[0]?.widget).toBe(LIST);
  });

  it('should return a widget of an item where it sits when the list shows that item', () => {
    const rect = computeListLayout(LIST).items[FIRST_ITEM_INDEX]?.rect;

    expect(
      computeWidgetRect(
        toListWidgets(LIST)[FIRST_ITEM_BUTTON_INDEX]?.widget ?? LIST,
      ),
    ).toEqual({
      row: (rect?.row ?? 0) + PLAY_ROW,
      column: (rect?.column ?? 0) + PLAY_COLUMN,
      width: PLAY_WIDTH,
      height: HUD_CONTROL_HEIGHT,
    });
  });

  it('should name the item a widget sits on when it lists what a list shows', () => {
    expect(map(toListWidgets(LIST), (placed) => placed.item)).toEqual([
      '',
      'a',
      'b',
    ]);
  });

  it('should return the list alone when it holds no items', () => {
    expect(toIds({ ...LIST, items: [] })).toEqual(['tracks']);
  });
});
