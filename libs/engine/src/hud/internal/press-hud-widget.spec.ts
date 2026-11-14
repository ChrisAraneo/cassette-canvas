import { describe, expect, it } from 'vitest';

import { addHudWindow } from '../add-hud-window';
import { createHud } from '../create-hud';
import { findHudWidget } from '../find-hud-widget';
import { findHudWindow } from '../find-hud-window';
import type { Hud } from '../types/hud';
import type { HudWidget } from '../types/hud-widget';
import { computeTabRects } from './compute-tab-rects';
import { pressHudWidget } from './press-hud-widget';

const TABS: HudWidget = Object.freeze({
  kind: 'tabs',
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
    kind: 'button',
    id: 'skip',
    page: '',
    row: 16,
    column: 0,
    width: 30,
    text: 'SKIP',
  },
  {
    kind: 'input',
    id: 'note',
    page: '',
    row: 32,
    column: 0,
    width: 60,
    text: '',
  },
  { kind: 'label', id: 'fps', page: '', row: 52, column: 0, text: 'FPS' },
  {
    kind: 'list',
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
            kind: 'button',
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
    kind: 'panel',
    id: 'meters',
    page: '',
    row: 120,
    column: 0,
    width: 60,
    height: 20,
  },
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

const press = (widget: string, row: number, column: number) =>
  pressHudWidget(
    createStreetHud(),
    { window: 'street', part: 'widget', widget },
    row,
    column,
  );

describe('pressHudWidget', () => {
  it('should return a grab on the button when a press lands on one', () => {
    expect(press('skip', 33, 10).hud.grab).toMatchObject({
      kind: 'press',
      window: 'street',
      widget: 'skip',
    });
  });

  it('should return the focus on the field when a press lands on one', () => {
    expect(press('note', 50, 10).hud.focus).toEqual({
      window: 'street',
      widget: 'note',
    });
  });

  it('should return no grab when a field takes the focus', () => {
    expect(press('note', 50, 10).hud.grab).toBeUndefined();
  });

  it('should return the page of the tab when the press lands on one', () => {
    const second = computeTabRects(TABS)[1];

    expect(
      findHudWindow(
        press('tabs', second?.row ?? 0, second?.column ?? 0).hud,
        'street',
      )?.page,
    ).toBe('light');
  });

  it('should return a tab action with the page when the press opens one', () => {
    const second = computeTabRects(TABS)[1];

    expect(
      press('tabs', second?.row ?? 0, second?.column ?? 0).actions,
    ).toEqual([
      { kind: 'tab', window: 'street', widget: 'tabs', value: 'light' },
    ]);
  });

  it('should return no actions when the press misses every tab', () => {
    expect(press('tabs', 20, 500).actions).toEqual([]);
  });

  it('should return no grab when the press lands on a label', () => {
    expect(press('fps', 68, 10).hud.grab).toBeUndefined();
  });

  it('should return a select action with the item when the press lands on one in a list', () => {
    expect(press('tracks', 84, 10).actions).toEqual([
      { kind: 'select', window: 'street', widget: 'tracks', value: 'a' },
    ]);
  });

  it('should return the item selected when the press lands on one in a list', () => {
    expect(
      findHudWidget(press('tracks', 84, 10).hud, 'street', 'tracks'),
    ).toMatchObject({ selected: 'a' });
  });

  it('should return a grab on the button when a press lands on one that sits on an item of a list', () => {
    expect(press('play-a', 84, 50).hud.grab).toMatchObject({
      kind: 'press',
      window: 'street',
      widget: 'play-a',
    });
  });

  it('should return no actions when a press lands on a button that sits on an item', () => {
    expect(press('play-a', 84, 50).actions).toEqual([]);
  });

  it('should return nothing selected when a press lands on a button that sits on an item', () => {
    expect(
      findHudWidget(press('play-a', 84, 50).hud, 'street', 'tracks'),
    ).toMatchObject({ selected: '' });
  });

  it('should return no grab when the press lands on a panel', () => {
    expect(press('meters', 140, 10).hud.grab).toBeUndefined();
  });

  it('should return no actions when the press lands on a panel', () => {
    expect(press('meters', 140, 10).actions).toEqual([]);
  });
});
