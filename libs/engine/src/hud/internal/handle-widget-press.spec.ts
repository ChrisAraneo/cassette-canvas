import { describe, expect, it } from 'vitest';

import { addHudWindow } from '../add-hud-window';
import { createHud } from '../create-hud';
import { findHudWidget } from '../find-hud-widget';
import { findHudWindow } from '../find-hud-window';
import type { Hud } from '../types/hud';
import type { HudChange } from '../types/hud-change';
import type { HudWidget } from '../types/hud-widget';
import { computeTabRects } from './compute-tab-rects';
import { handleWidgetPress } from './handle-widget-press';

const TABS: HudWidget = Object.freeze({
  kind: 'TABS',
  id: 'tabs',
  page: '',
  row: 0,
  column: 0,
  tabs: [
    { id: 'scene', text: 'SCENE' },
    { id: 'light', text: 'LIGHT' },
  ],
});

const WIDGETS: readonly HudWidget[] = Object.freeze([
  TABS,
  {
    kind: 'BUTTON',
    id: 'skip',
    page: '',
    row: 16,
    column: 0,
    width: 30,
    text: 'SKIP',
  },
  {
    kind: 'INPUT',
    id: 'note',
    page: '',
    row: 32,
    column: 0,
    width: 60,
    text: '',
  },
  { kind: 'LABEL', id: 'fps', page: '', row: 52, column: 0, text: 'FPS' },
  {
    kind: 'LIST',
    id: 'tracks',
    page: '',
    row: 64,
    column: 0,
    width: 80,
    height: 48,
    items: [
      {
        id: 'a',
        lines: ['SIDE A'],
        height: 0,
        widgets: [
          {
            kind: 'BUTTON',
            id: 'play-a',
            page: '',
            row: 0,
            column: 40,
            width: 20,
            text: 'PLAY',
          },
        ],
        selectable: true,
      },
      { id: 'b', lines: ['SIDE B'], height: 0, widgets: [], selectable: true },
    ],
    scroll: 0,
    selected: '',
  },
  {
    kind: 'PANEL',
    id: 'meters',
    page: '',
    row: 120,
    column: 0,
    width: 60,
    height: 20,
  },
  { kind: 'DIVIDER', id: 'line', page: '', row: 144, column: 0, width: 60 },
]);

const createStreetHud = (): Hud =>
  addHudWindow(createHud(), {
    id: 'street',
    title: 'STREET',
    row: 0,
    column: 0,
    width: 90,
    height: 160,
    widgets: WIDGETS,
  });

const handlePressOn = (
  widget: string,
  row: number,
  column: number,
): HudChange =>
  handleWidgetPress(
    createStreetHud(),
    { window: 'street', part: 'WIDGET', widget },
    row,
    column,
  );

describe('handleWidgetPress', () => {
  it('should return a grab on the button when a press lands on one', () => {
    expect(handlePressOn('skip', 33, 10).hud.grab).toMatchObject({
      kind: 'PRESS',
      window: 'street',
      widget: 'skip',
    });
  });

  it('should return the focus on the field when a press lands on one', () => {
    expect(handlePressOn('note', 50, 10).hud.focus).toEqual({
      window: 'street',
      widget: 'note',
    });
  });

  it('should return no grab when a field takes the focus', () => {
    expect(handlePressOn('note', 50, 10).hud.grab).toBeUndefined();
  });

  it('should return the page of the tab when the press lands on one', () => {
    const second = computeTabRects(TABS)[1];

    expect(
      findHudWindow(
        handlePressOn('tabs', second?.row ?? 0, second?.column ?? 0).hud,
        'street',
      )?.page,
    ).toBe('light');
  });

  it('should return a tab action with the page when the press opens one', () => {
    const second = computeTabRects(TABS)[1];

    expect(
      handlePressOn('tabs', second?.row ?? 0, second?.column ?? 0).actions,
    ).toEqual([
      { kind: 'TAB', window: 'street', widget: 'tabs', value: 'light' },
    ]);
  });

  it('should return no actions when the press misses every tab', () => {
    expect(handlePressOn('tabs', 20, 500).actions).toEqual([]);
  });

  it('should return no grab when the press lands on a label', () => {
    expect(handlePressOn('fps', 68, 10).hud.grab).toBeUndefined();
  });

  it('should return a select action with the item when the press lands on one in a list', () => {
    expect(handlePressOn('tracks', 84, 10).actions).toEqual([
      { kind: 'SELECT', window: 'street', widget: 'tracks', value: 'a' },
    ]);
  });

  it('should return the item selected when the press lands on one in a list', () => {
    expect(
      findHudWidget(handlePressOn('tracks', 84, 10).hud, 'street', 'tracks'),
    ).toMatchObject({ selected: 'a' });
  });

  it('should return a grab on the button when a press lands on one that sits on an item of a list', () => {
    expect(handlePressOn('play-a', 84, 50).hud.grab).toMatchObject({
      kind: 'PRESS',
      window: 'street',
      widget: 'play-a',
    });
  });

  it('should return no actions when a press lands on a button that sits on an item', () => {
    expect(handlePressOn('play-a', 84, 50).actions).toEqual([]);
  });

  it('should return nothing selected when a press lands on a button that sits on an item', () => {
    expect(
      findHudWidget(handlePressOn('play-a', 84, 50).hud, 'street', 'tracks'),
    ).toMatchObject({ selected: '' });
  });

  it('should return no grab when the press lands on a panel', () => {
    expect(handlePressOn('meters', 140, 10).hud.grab).toBeUndefined();
  });

  it('should return no actions when the press lands on a panel', () => {
    expect(handlePressOn('meters', 140, 10).actions).toEqual([]);
  });

  it('should return no grab when the press lands on a divider', () => {
    expect(handlePressOn('line', 148, 10).hud.grab).toBeUndefined();
  });

  it('should return no actions when the press lands on a divider', () => {
    expect(handlePressOn('line', 148, 10).actions).toEqual([]);
  });
});
