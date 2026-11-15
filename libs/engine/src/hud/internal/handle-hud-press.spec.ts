import { map } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { addHudWindow } from '../add-hud-window';
import { createHud } from '../create-hud';
import type { Hud } from '../types/hud';
import type { HudWidget } from '../types/hud-widget';
import { handleHudPress } from './handle-hud-press';

const WIDGETS: readonly HudWidget[] = Object.freeze([
  {
    kind: 'BUTTON',
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

describe('handleHudPress', () => {
  it('should return a grab on the title bar with the spot under the pointer when a press lands on it', () => {
    expect(handleHudPress(createStreetHud(), 16, 30).hud.grab).toEqual({
      kind: 'DRAG',
      window: 'street',
      widget: '',
      row: 6,
      column: 10,
    });
  });

  it('should return a grab on the close box when a press lands on one', () => {
    expect(handleHudPress(createStreetHud(), 16, 101).hud.grab).toMatchObject({
      kind: 'CLOSE',
      window: 'street',
    });
  });

  it('should return a grab on the button when a press lands on one', () => {
    expect(handleHudPress(createStreetHud(), 30, 30).hud.grab).toMatchObject({
      kind: 'PRESS',
      window: 'street',
      widget: 'skip',
    });
  });

  it('should return no grab when the press lands on the body', () => {
    expect(handleHudPress(createStreetHud(), 80, 100).hud.grab).toBeUndefined();
  });

  it('should return no actions when it takes a grab', () => {
    expect(handleHudPress(createStreetHud(), 16, 30).actions).toEqual([]);
  });

  it('should return the pressed window last, on top of the others, when a press lands on it', () => {
    expect(
      map(
        handleHudPress(createTwoWindows(), 16, 30).hud.windows,
        (window) => window.id,
      ),
    ).toEqual(['notes', 'street']);
  });

  it('should return no focus when the press lands outside every window', () => {
    expect(
      handleHudPress(
        { ...createStreetHud(), focus: { window: 'notes', widget: 'note' } },
        0,
        0,
      ).hud.focus,
    ).toBeUndefined();
  });

  it('should not change the HUD it is given when it handles a press', () => {
    const hud = createStreetHud();

    handleHudPress(hud, 16, 30);

    expect(hud).toEqual(createStreetHud());
  });
});
