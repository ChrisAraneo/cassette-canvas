import { describe, expect, it } from 'vitest';

import { addHudWindow } from '../add-hud-window';
import { createHud } from '../create-hud';
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
]);

const createStreetHud = (): Hud =>
  addHudWindow(createHud(), {
    id: 'street',
    title: 'STREET',
    row: 0,
    column: 0,
    width: 90,
    height: 76,
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
});
