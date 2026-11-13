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
  it('should report a click when the pointer is still on the button', () => {
    expect(releaseHud(createPressingHud(), 30, 30).actions).toEqual([
      { kind: 'click', window: 'street', widget: 'skip', value: '' },
    ]);
  });

  it('should report nothing when the pointer slid off the button', () => {
    expect(releaseHud(createPressingHud(), 80, 100).actions).toEqual([]);
  });

  it('should let go of the button either way', () => {
    expect(releaseHud(createPressingHud(), 80, 100).hud.grab).toBeUndefined();
  });

  it('should close the window when the pointer is still on the close box', () => {
    expect(
      findHudWindow(releaseHud(createClosingHud(), 16, 101).hud, 'street'),
    ).toBeUndefined();
  });

  it('should report the window it closed', () => {
    expect(releaseHud(createClosingHud(), 16, 101).actions).toEqual([
      { kind: 'close', window: 'street', widget: '', value: '' },
    ]);
  });

  it('should keep the window when the pointer slid off the close box', () => {
    expect(size(releaseHud(createClosingHud(), 80, 100).hud.windows)).toBe(1);
  });

  it('should let go after a drag, without reporting anything', () => {
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
