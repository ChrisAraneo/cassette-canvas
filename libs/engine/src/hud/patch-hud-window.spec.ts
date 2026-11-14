import { map } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { addHudWindow } from './add-hud-window';
import { createHud } from './create-hud';
import { findHudWindow } from './find-hud-window';
import { patchHudWindow } from './patch-hud-window';
import type { Hud } from './types/hud';

const createTwoWindows = (): Hud =>
  addHudWindow(
    addHudWindow(createHud(), {
      id: 'street',
      title: 'STREET',
      row: 10,
      column: 20,
      width: 90,
      height: 76,
    }),
    { id: 'notes', title: 'NOTES', row: 0, column: 0, width: 70, height: 40 },
  );

describe('patchHudWindow', () => {
  it('should return the window moved when it gets a new row and column', () => {
    expect(
      findHudWindow(
        patchHudWindow(createTwoWindows(), 'street', { row: 1, column: 2 }),
        'street',
      ),
    ).toMatchObject({ row: 1, column: 2 });
  });

  it('should return the new color when it gets one', () => {
    expect(
      findHudWindow(
        patchHudWindow(createTwoWindows(), 'street', { color: 9 }),
        'street',
      )?.color,
    ).toBe(9);
  });

  it('should return the fields the changes leave out when it changes a window', () => {
    expect(
      findHudWindow(
        patchHudWindow(createTwoWindows(), 'street', { row: 1 }),
        'street',
      )?.column,
    ).toBe(20);
  });

  it('should return the windows in the same order when it changes one', () => {
    expect(
      map(
        patchHudWindow(createTwoWindows(), 'street', { row: 1 }).windows,
        (window) => window.id,
      ),
    ).toEqual(['street', 'notes']);
  });

  it('should return the same HUD when no window has the id', () => {
    expect(patchHudWindow(createTwoWindows(), 'ghost', { row: 1 })).toEqual(
      createTwoWindows(),
    );
  });
});
