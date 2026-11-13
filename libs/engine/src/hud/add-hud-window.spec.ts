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
  it('should hold the window it is given', () => {
    expect(createStreetHud().windows[0]).toMatchObject(STREET);
  });

  it('should put the window on top of the others', () => {
    expect(
      map(
        addHudWindow(createStreetHud(), NOTES).windows,
        (window) => window.id,
      ),
    ).toEqual(['street', 'notes']);
  });

  it('should take the old window off when one with the same id is added', () => {
    expect(
      addHudWindow(createStreetHud(), { ...STREET, title: 'AGAIN' }).windows,
    ).toHaveLength(1);
  });

  it('should keep the theme when it adds a window', () => {
    expect(createStreetHud().theme).toEqual(createHud().theme);
  });

  it('should not change the HUD it is given', () => {
    const hud = createHud();

    addHudWindow(hud, STREET);

    expect(hud.windows).toEqual([]);
  });
});
