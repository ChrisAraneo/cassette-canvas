import { map } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { addHudWindow } from '../add-hud-window';
import { createHud } from '../create-hud';
import type { Hud } from '../types/hud';
import type { HudGrab } from '../types/hud-grab';
import { computeCloseRect } from './compute-close-rect';
import { handleCloseRelease } from './handle-close-release';
import { toHudWindow } from './to-hud-window';

const GRAB: HudGrab = Object.freeze({
  kind: 'CLOSE',
  window: 'deck',
  widget: '',
  row: 2,
  column: 2,
});

const SETTINGS = Object.freeze({
  id: 'deck',
  title: 'DECK',
  row: 0,
  column: 0,
  width: 120,
  height: 90,
});

const createDeckHud = (): Hud => ({
  ...addHudWindow(createHud(), SETTINGS),
  grab: GRAB,
});

const CLOSE_RECT = computeCloseRect(toHudWindow(createHud(), SETTINGS));

const ON_BOX_ROW = CLOSE_RECT.row + 2;

const ON_BOX_COLUMN = CLOSE_RECT.column + 2;

describe('handleCloseRelease', () => {
  it('should return a CLOSE when the close box is still under the pointer', () => {
    expect(
      handleCloseRelease(createDeckHud(), GRAB, ON_BOX_ROW, ON_BOX_COLUMN)
        .actions,
    ).toEqual([{ kind: 'CLOSE', window: 'deck', widget: '', value: '' }]);
  });

  it('should remove the window when the close box is still under the pointer', () => {
    expect(
      handleCloseRelease(createDeckHud(), GRAB, ON_BOX_ROW, ON_BOX_COLUMN).hud
        .windows,
    ).toEqual([]);
  });

  it('should keep the window when the pointer has moved off the close box', () => {
    expect(
      map(
        handleCloseRelease(createDeckHud(), GRAB, 80, 100).hud.windows,
        (window) => window.id,
      ),
    ).toEqual(['deck']);
  });

  it('should return no actions when the pointer has moved off the close box', () => {
    expect(handleCloseRelease(createDeckHud(), GRAB, 80, 100).actions).toEqual(
      [],
    );
  });

  it('should let the grab go when the pointer is over no window at all', () => {
    expect(
      handleCloseRelease(createDeckHud(), GRAB, 999, 999).hud.grab,
    ).toBeUndefined();
  });

  it('should let the grab go when it closes a window', () => {
    expect(
      handleCloseRelease(createDeckHud(), GRAB, ON_BOX_ROW, ON_BOX_COLUMN).hud
        .grab,
    ).toBeUndefined();
  });

  it('should not change the old HUD when it closes a window', () => {
    const hud = createDeckHud();

    handleCloseRelease(hud, GRAB, ON_BOX_ROW, ON_BOX_COLUMN);

    expect(hud).toEqual(createDeckHud());
  });
});
