import { describe, expect, it } from 'vitest';

import { addHudWindow } from './add-hud-window';
import { createHud } from './create-hud';
import { findHudWidget } from './find-hud-widget';
import { patchHudWidget } from './patch-hud-widget';
import type { Hud } from './types/hud';
import type { HudWidget } from './types/hud-widget';

const WIDGETS: readonly HudWidget[] = Object.freeze([
  { kind: 'label', id: 'fps', page: '', row: 0, column: 0, text: 'FPS 60' },
  { kind: 'label', id: 'clock', page: '', row: 8, column: 0, text: '12:00' },
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

describe('patchHudWidget', () => {
  it('should return the new text when it names the widget', () => {
    expect(
      findHudWidget(
        patchHudWidget(createStreetHud(), 'street', 'fps', { text: 'FPS 30' }),
        'street',
        'fps',
      ),
    ).toMatchObject({ text: 'FPS 30' });
  });

  it('should return the other widgets unchanged when it changes one', () => {
    expect(
      findHudWidget(
        patchHudWidget(createStreetHud(), 'street', 'fps', { text: 'FPS 30' }),
        'street',
        'clock',
      ),
    ).toBe(WIDGETS[1]);
  });

  it('should return the same HUD when no window has the id', () => {
    expect(
      patchHudWidget(createStreetHud(), 'ghost', 'fps', { text: 'FPS 30' }),
    ).toEqual(createStreetHud());
  });

  it('should return the same HUD when no widget has the id', () => {
    expect(
      patchHudWidget(createStreetHud(), 'street', 'ghost', { text: 'X' }),
    ).toEqual(createStreetHud());
  });

  it('should not change the HUD it is given when it changes a widget', () => {
    const hud = createStreetHud();

    patchHudWidget(hud, 'street', 'fps', { text: 'FPS 30' });

    expect(hud).toEqual(createStreetHud());
  });
});
