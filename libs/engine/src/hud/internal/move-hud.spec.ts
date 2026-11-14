import { describe, expect, it } from 'vitest';

import { addHudWindow } from '../add-hud-window';
import { createHud } from '../create-hud';
import { findHudWindow } from '../find-hud-window';
import type { Hud } from '../types/hud';
import { moveHud } from './move-hud';

const createStreetHud = (): Hud =>
  addHudWindow(createHud(), {
    id: 'street',
    title: 'STREET',
    row: 10,
    column: 20,
    width: 90,
    height: 76,
  });

const createDraggingHud = (): Hud => ({
  ...createStreetHud(),
  grab: { kind: 'drag', window: 'street', widget: '', row: 6, column: 10 },
});

describe('moveHud', () => {
  it('should return the window moved when the pointer drags it, so the grabbed spot stays under the pointer', () => {
    expect(
      findHudWindow(moveHud(createDraggingHud(), 40, 60).hud, 'street'),
    ).toMatchObject({ row: 34, column: 50 });
  });

  it('should return the window beyond the edge of the screen when the pointer goes there', () => {
    expect(
      findHudWindow(moveHud(createDraggingHud(), 0, 0).hud, 'street'),
    ).toMatchObject({ row: -6, column: -10 });
  });

  it('should return no actions when it drags a window', () => {
    expect(moveHud(createDraggingHud(), 40, 60).actions).toEqual([]);
  });

  it('should return the window where it was when the pointer holds a button', () => {
    expect(
      moveHud(
        {
          ...createStreetHud(),
          grab: {
            kind: 'press',
            window: 'street',
            widget: 'skip',
            row: 0,
            column: 0,
          },
        },
        40,
        60,
      ).hud,
    ).toMatchObject({ windows: createStreetHud().windows });
  });

  it('should return the very same HUD when the pointer holds nothing', () => {
    const hud = createStreetHud();

    expect(moveHud(hud, 40, 60).hud).toBe(hud);
  });
});
