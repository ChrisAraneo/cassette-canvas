import { describe, expect, it } from 'vitest';

import { addHudWindow } from './add-hud-window';
import { createHud } from './create-hud';
import { findHudWindow } from './find-hud-window';
import { handleHud } from './handle-hud';
import type { Hud } from './types/hud';
import type { HudWidget } from './types/hud-widget';

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
  {
    kind: 'input',
    id: 'note',
    page: '',
    row: 16,
    column: 0,
    width: 60,
    text: '',
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

describe('handleHud', () => {
  it('should take hold of a window on a press of its title bar', () => {
    expect(
      handleHud(createStreetHud(), { kind: 'press', row: 16, column: 30 }).hud
        .grab,
    ).toMatchObject({ kind: 'drag', window: 'street' });
  });

  it('should drag the window along on a move', () => {
    expect(
      findHudWindow(
        handleHud(
          handleHud(createStreetHud(), { kind: 'press', row: 16, column: 30 })
            .hud,
          { kind: 'move', row: 26, column: 40 },
        ).hud,
        'street',
      ),
    ).toMatchObject({ row: 20, column: 30 });
  });

  it('should report a click on a press and a release of a button', () => {
    expect(
      handleHud(
        handleHud(createStreetHud(), { kind: 'press', row: 30, column: 30 })
          .hud,
        { kind: 'release', row: 30, column: 30 },
      ).actions,
    ).toEqual([{ kind: 'click', window: 'street', widget: 'skip', value: '' }]);
  });

  it('should type into the field a press gave the keys to', () => {
    expect(
      handleHud(
        handleHud(createStreetHud(), { kind: 'press', row: 48, column: 30 })
          .hud,
        { kind: 'key', key: 'A' },
      ).actions,
    ).toEqual([{ kind: 'type', window: 'street', widget: 'note', value: 'A' }]);
  });

  it('should close the window on a press and a release of its close box', () => {
    expect(
      handleHud(
        handleHud(createStreetHud(), { kind: 'press', row: 16, column: 101 })
          .hud,
        { kind: 'release', row: 16, column: 101 },
      ).hud.windows,
    ).toEqual([]);
  });

  it('should not change the HUD it is given', () => {
    const hud = createStreetHud();

    handleHud(hud, { kind: 'press', row: 16, column: 30 });

    expect(hud).toEqual(createStreetHud());
  });
});
