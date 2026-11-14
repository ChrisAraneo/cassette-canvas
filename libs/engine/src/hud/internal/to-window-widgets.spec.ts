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

/** A play button three rows down an item and 40 columns across it. */
const toPlay = (id: string): HudItemWidget => ({
  kind: 'button',
  id: `play-${id}`,
  page: '',
  row: 3,
  column: 40,
  width: 20,
  text: 'PLAY',
});

const toItem = (id: string): HudListItem => ({
  id,
  lines: [`SIDE ${id}`],
  height: 20,
  widgets: [toPlay(id)],
  selectable: true,
});

/** A list 48 rows tall, which shows two of its three items at once. */
const LIST: HudList = Object.freeze({
  kind: 'list',
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

/** A readout on the open page, and one on a page the window does not show. */
const PLAYING: HudLabel = Object.freeze({
  kind: 'label',
  id: 'playing',
  page: 'deck',
  row: 0,
  column: 0,
  text: '',
});

const HIDDEN: HudLabel = Object.freeze({
  kind: 'label',
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
  it('should return the list and the buttons of the items it shows after the widgets of the page', () => {
    expect(toIds(WINDOW)).toEqual(['playing', 'tracks', 'play-a', 'play-b']);
  });

  it('should leave out the widgets of a page the window does not show', () => {
    expect(toIds(WINDOW)).not.toContain('hidden');
  });

  it('should leave out the widgets of the items the list does not show', () => {
    expect(toIds(WINDOW)).not.toContain('play-c');
  });

  it('should return the widgets of the items the list is scrolled to when it is scrolled', () => {
    expect(toIds({ ...WINDOW, widgets: [{ ...LIST, scroll: 1 }] })).toEqual([
      'tracks',
      'play-b',
      'play-c',
    ]);
  });

  it('should return a widget of an item where it sits in the window', () => {
    const rect = computeListLayout(LIST).items[1]?.rect;

    expect(
      computeWidgetRect(toWindowWidgets(WINDOW)[3]?.widget ?? LIST),
    ).toEqual({
      row: (rect?.row ?? 0) + 3,
      column: (rect?.column ?? 0) + 40,
      width: 20,
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
});
