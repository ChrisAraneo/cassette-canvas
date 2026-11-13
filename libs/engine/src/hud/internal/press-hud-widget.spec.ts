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
  it('should take hold of a button', () => {
    expect(press('skip', 33, 10).hud.grab).toMatchObject({
      kind: 'press',
      window: 'street',
      widget: 'skip',
    });
  });

  it('should give the keys to a field', () => {
    expect(press('note', 50, 10).hud.focus).toEqual({
      window: 'street',
      widget: 'note',
    });
  });

  it('should let go of the pointer when a field takes the keys', () => {
    expect(press('note', 50, 10).hud.grab).toBeUndefined();
  });

  it('should open the page of the tab under the pointer', () => {
    const second = computeTabRects(TABS)[1];

    expect(
      findHudWindow(
        press('tabs', second?.row ?? 0, second?.column ?? 0).hud,
        'street',
      )?.page,
    ).toBe('light');
  });

  it('should report which tab was opened', () => {
    const second = computeTabRects(TABS)[1];

    expect(
      press('tabs', second?.row ?? 0, second?.column ?? 0).actions,
    ).toEqual([
      { kind: 'tab', window: 'street', widget: 'tabs', value: 'light' },
    ]);
  });

  it('should leave the page alone when the press misses every tab', () => {
    expect(press('tabs', 20, 500).actions).toEqual([]);
  });

  it('should hold nothing when it presses a label', () => {
    expect(press('fps', 68, 10).hud.grab).toBeUndefined();
  });
});
