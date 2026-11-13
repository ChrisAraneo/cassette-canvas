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
  it('should keep the spot the pointer took hold of under the pointer', () => {
    expect(
      findHudWindow(moveHud(createDraggingHud(), 40, 60).hud, 'street'),
    ).toMatchObject({ row: 34, column: 50 });
  });

  it('should let a window go beyond the edge of the screen', () => {
    expect(
      findHudWindow(moveHud(createDraggingHud(), 0, 0).hud, 'street'),
    ).toMatchObject({ row: -6, column: -10 });
  });

  it('should report nothing happening while it drags', () => {
    expect(moveHud(createDraggingHud(), 40, 60).actions).toEqual([]);
  });

  it('should move nothing when the pointer holds a button', () => {
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

  it('should give back the very same HUD when the pointer holds nothing', () => {
    const hud = createStreetHud();

    expect(moveHud(hud, 40, 60).hud).toBe(hud);
  });
});
