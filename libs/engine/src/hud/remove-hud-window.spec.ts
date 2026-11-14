import { map } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { addHudWindow } from './add-hud-window';
import { createHud } from './create-hud';
import { removeHudWindow } from './remove-hud-window';
import type { Hud } from './types/hud';

const createTwoWindows = (): Hud =>
  addHudWindow(
    addHudWindow(createHud(), {
      id: 'street',
      title: 'STREET',
      row: 0,
      column: 0,
      width: 90,
      height: 76,
    }),
    { id: 'notes', title: 'NOTES', row: 0, column: 0, width: 70, height: 40 },
  );

describe('removeHudWindow', () => {
  it('should return the other windows in order when one carries the id', () => {
    expect(
      map(
        removeHudWindow(createTwoWindows(), 'street').windows,
        (window) => window.id,
      ),
    ).toEqual(['notes']);
  });

  it('should return no grab when it removes the window the pointer holds', () => {
    expect(
      removeHudWindow(
        {
          ...createTwoWindows(),
          grab: {
            kind: 'drag',
            window: 'street',
            widget: '',
            row: 0,
            column: 0,
          },
        },
        'street',
      ).grab,
    ).toBeUndefined();
  });

  it('should return the grab when it removes another window', () => {
    expect(
      removeHudWindow(
        {
          ...createTwoWindows(),
          grab: {
            kind: 'drag',
            window: 'notes',
            widget: '',
            row: 0,
            column: 0,
          },
        },
        'street',
      ).grab,
    ).toMatchObject({ window: 'notes' });
  });

  it('should return no focus when it removes the window that takes the keys', () => {
    expect(
      removeHudWindow(
        {
          ...createTwoWindows(),
          focus: { window: 'notes', widget: 'note' },
        },
        'notes',
      ).focus,
    ).toBeUndefined();
  });

  it('should return the same HUD when no window has the id', () => {
    expect(removeHudWindow(createTwoWindows(), 'ghost')).toEqual(
      createTwoWindows(),
    );
  });
});
