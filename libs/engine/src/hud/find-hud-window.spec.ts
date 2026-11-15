import { describe, expect, it } from 'vitest';

import { addHudWindow } from './add-hud-window';
import { createHud } from './create-hud';
import { findHudWindow } from './find-hud-window';
import type { Hud } from './types/hud';

const createStreetHud = (): Hud =>
  addHudWindow(createHud(), {
    id: 'street',
    title: 'STREET',
    row: 10,
    column: 20,
    width: 90,
    height: 76,
  });

describe('findHudWindow', () => {
  it('should return the window when the HUD holds the id', () => {
    expect(findHudWindow(createStreetHud(), 'street')).toMatchObject({
      title: 'STREET',
    });
  });

  it('should return no window when none has the id', () => {
    expect(findHudWindow(createStreetHud(), 'ghost')).toBeUndefined();
  });

  it('should return no window when the HUD holds none', () => {
    expect(findHudWindow(createHud(), 'street')).toBeUndefined();
  });

  it('should not change the HUD it is given when it looks for a window', () => {
    const hud = createStreetHud();

    findHudWindow(hud, 'street');

    expect(hud).toEqual(createStreetHud());
  });
});
