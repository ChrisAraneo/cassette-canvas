import { map } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { HUD_CONTROL_HEIGHT } from '../consts';
import type { HudItemWidget } from '../types/hud-item-widget';
import type { HudLabel } from '../types/hud-label';
import type { HudList } from '../types/hud-list';
import type { HudListItem } from '../types/hud-list-item';
import type { HudWindow } from '../types/hud-window';
import { computeListLayout } from './compute-list-layout';
import { computeWidgetRect } from './compute-widget-rect';
import { toWindowWidgets } from './to-window-widgets';

const PLAY_ROW = 3;

const PLAY_COLUMN = 40;

const PLAY_WIDTH = 20;

const SECOND_ITEM_INDEX = 1;

const SECOND_ITEM_BUTTON_INDEX = 3;

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

const PLAYING: HudLabel = Object.freeze({
  kind: 'LABEL',
  id: 'playing',
  page: 'deck',
  row: 0,
  column: 0,
  text: '',
});

const HIDDEN: HudLabel = Object.freeze({
  kind: 'LABEL',
  id: 'hidden',
  page: 'sides',
  row: 0,
  column: 0,
  text: '',
});

const WINDOW: HudWindow = Object.freeze({
  id: 'tape',
  title: 'TAPE',
  row: 0,
  column: 0,
  width: 90,
  height: 80,
  color: 15,
  closable: true,
  page: 'deck',
  widgets: [PLAYING, HIDDEN, LIST],
});

const toIds = (window: HudWindow): readonly string[] =>
  map(toWindowWidgets(window), (placed) => placed.widget.id);

describe('toWindowWidgets', () => {
  it('should return the list and the buttons of the items it shows after the widgets of the page when it lays a window out', () => {
    expect(toIds(WINDOW)).toEqual(['playing', 'tracks', 'play-a', 'play-b']);
  });

  it('should return no widget of a page when the window does not show that page', () => {
    expect(toIds(WINDOW)).not.toContain('hidden');
  });

  it('should return no widget of an item when the list does not show that item', () => {
    expect(toIds(WINDOW)).not.toContain('play-c');
  });

  it('should return the widgets of the items the list is scrolled to when it is scrolled', () => {
    expect(toIds({ ...WINDOW, widgets: [{ ...LIST, scroll: 1 }] })).toEqual([
      'tracks',
      'play-b',
      'play-c',
    ]);
  });

  it('should return a widget of an item where it sits when the list shows that item', () => {
    const rect = computeListLayout(LIST).items[SECOND_ITEM_INDEX]?.rect;

    expect(
      computeWidgetRect(
        toWindowWidgets(WINDOW)[SECOND_ITEM_BUTTON_INDEX]?.widget ?? LIST,
      ),
    ).toEqual({
      row: (rect?.row ?? 0) + PLAY_ROW,
      column: (rect?.column ?? 0) + PLAY_COLUMN,
      width: PLAY_WIDTH,
      height: HUD_CONTROL_HEIGHT,
    });
  });

  it('should name the item a widget sits on when it lists what a window shows', () => {
    expect(map(toWindowWidgets(WINDOW), (placed) => placed.item)).toEqual([
      '',
      '',
      'a',
      'b',
    ]);
  });

  it('should return no widgets when the window holds none', () => {
    expect(toIds({ ...WINDOW, widgets: [] })).toEqual([]);
  });

  it('should return the list alone when it holds no items', () => {
    expect(toIds({ ...WINDOW, widgets: [{ ...LIST, items: [] }] })).toEqual([
      'tracks',
    ]);
  });
});
