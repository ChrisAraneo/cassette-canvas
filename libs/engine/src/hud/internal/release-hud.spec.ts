import { size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { addHudWindow } from '../add-hud-window';
import { createHud } from '../create-hud';
import { findHudWindow } from '../find-hud-window';
import type { Hud } from '../types/hud';
import type { HudWidget } from '../types/hud-widget';
import { releaseHud } from './release-hud';

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

const createPressingHud = (): Hud => ({
  ...createStreetHud(),
  grab: { kind: 'press', window: 'street', widget: 'skip', row: 0, column: 0 },
});

const createClosingHud = (): Hud => ({
  ...createStreetHud(),
  grab: { kind: 'close', window: 'street', widget: '', row: 0, column: 0 },
});

describe('releaseHud', () => {
  it('should return a click action when the pointer is still on the button', () => {
    expect(releaseHud(createPressingHud(), 30, 30).actions).toEqual([
      { kind: 'click', window: 'street', widget: 'skip', value: '' },
    ]);
  });

  it('should return no actions when the pointer slid off the button', () => {
    expect(releaseHud(createPressingHud(), 80, 100).actions).toEqual([]);
  });

  it('should return no grab when the pointer is still on the button and when it slid off', () => {
    expect(releaseHud(createPressingHud(), 80, 100).hud.grab).toBeUndefined();
  });

  it('should return the HUD without the window when the pointer is still on the close box', () => {
    expect(
      findHudWindow(releaseHud(createClosingHud(), 16, 101).hud, 'street'),
    ).toBeUndefined();
  });

  it('should return a close action with the window when it closes one', () => {
    expect(releaseHud(createClosingHud(), 16, 101).actions).toEqual([
      { kind: 'close', window: 'street', widget: '', value: '' },
    ]);
  });

  it('should return the window when the pointer slid off the close box', () => {
    expect(size(releaseHud(createClosingHud(), 80, 100).hud.windows)).toBe(1);
  });

  it('should return no grab and no actions when a drag ends', () => {
    const change = releaseHud(
      {
        ...createStreetHud(),
        grab: {
          kind: 'drag',
          window: 'street',
          widget: '',
          row: 0,
          column: 0,
        },
      },
      40,
      60,
    );

    expect([change.hud.grab, change.actions]).toEqual([undefined, []]);
  });
});
