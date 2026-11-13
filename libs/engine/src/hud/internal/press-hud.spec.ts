import { map } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { addHudWindow } from '../add-hud-window';
import { createHud } from '../create-hud';
import type { Hud } from '../types/hud';
import type { HudWidget } from '../types/hud-widget';
import { pressHud } from './press-hud';

const WIDGETS: readonly HudWidget[] = Object.freeze([
  {
    kind: 'button',
    id: 'skip',
    page: '',
    row: 0,
    column: 0,
    width: 30,
    text: 'SKIP',
  },
]);

const createStreetHud = (): Hud =>
  addHudWindow(createHud(), {
    id: 'street',
    title: 'STREET',
    row: 10,
    column: 20,
    width: 90,
    height: 76,
    widgets: WIDGETS,
  });

const createTwoWindows = (): Hud =>
  addHudWindow(createStreetHud(), {
    id: 'notes',
    title: 'NOTES',
    row: 100,
    column: 20,
    width: 90,
    height: 76,
  });

describe('pressHud', () => {
  it('should take hold of a title bar, keeping the spot under the pointer', () => {
    expect(pressHud(createStreetHud(), 16, 30).hud.grab).toEqual({
      kind: 'drag',
      window: 'street',
      widget: '',
      row: 6,
      column: 10,
    });
  });

  it('should take hold of a close box', () => {
    expect(pressHud(createStreetHud(), 16, 101).hud.grab).toMatchObject({
      kind: 'close',
      window: 'street',
    });
  });

  it('should take hold of a button', () => {
    expect(pressHud(createStreetHud(), 30, 30).hud.grab).toMatchObject({
      kind: 'press',
      window: 'street',
      widget: 'skip',
    });
  });

  it('should hold nothing when it presses the body', () => {
    expect(pressHud(createStreetHud(), 80, 100).hud.grab).toBeUndefined();
  });

  it('should report nothing happening when it takes hold', () => {
    expect(pressHud(createStreetHud(), 16, 30).actions).toEqual([]);
  });

  it('should bring the window it presses to the top', () => {
    expect(
      map(
        pressHud(createTwoWindows(), 16, 30).hud.windows,
        (window) => window.id,
      ),
    ).toEqual(['notes', 'street']);
  });

  it('should give up the keys when it presses outside every window', () => {
    expect(
      pressHud(
        { ...createStreetHud(), focus: { window: 'notes', widget: 'note' } },
        0,
        0,
      ).hud.focus,
    ).toBeUndefined();
  });

  it('should not change the HUD it is given', () => {
    const hud = createStreetHud();

    pressHud(hud, 16, 30);

    expect(hud).toEqual(createStreetHud());
  });
});
