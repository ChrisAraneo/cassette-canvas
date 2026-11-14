import { map } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { addHudWindow } from './add-hud-window';
import { createHud } from './create-hud';
import type { Hud } from './types/hud';

const STREET = Object.freeze({
  id: 'street',
  title: 'STREET',
  row: 10,
  column: 20,
  width: 90,
  height: 76,
});

const NOTES = Object.freeze({
  id: 'notes',
  title: 'NOTES',
  row: 30,
  column: 40,
  width: 70,
  height: 40,
});

const createStreetHud = (): Hud => addHudWindow(createHud(), STREET);

describe('addHudWindow', () => {
  it('should return the window it is given when it adds one', () => {
    expect(createStreetHud().windows[0]).toMatchObject(STREET);
  });

  it('should return the window last when the HUD already holds others', () => {
    expect(
      map(
        addHudWindow(createStreetHud(), NOTES).windows,
        (window) => window.id,
      ),
    ).toEqual(['street', 'notes']);
  });

  it('should return only the new window when one with the same id is added', () => {
    expect(
      addHudWindow(createStreetHud(), { ...STREET, title: 'AGAIN' }).windows,
    ).toHaveLength(1);
  });

  it('should return the same theme when it adds a window', () => {
    expect(createStreetHud().theme).toEqual(createHud().theme);
  });

  it('should not change the HUD it is given when it adds a window', () => {
    const hud = createHud();

    addHudWindow(hud, STREET);

    expect(hud.windows).toEqual([]);
  });
});
