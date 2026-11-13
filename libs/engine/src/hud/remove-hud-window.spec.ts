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
  it('should take the window with the id off, and keep the rest', () => {
    expect(
      map(
        removeHudWindow(createTwoWindows(), 'street').windows,
        (window) => window.id,
      ),
    ).toEqual(['notes']);
  });

  it('should let go of a window it removes', () => {
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

  it('should keep holding another window', () => {
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

  it('should give up the keys of a window it removes', () => {
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

  it('should change nothing when no window has the id', () => {
    expect(removeHudWindow(createTwoWindows(), 'ghost')).toEqual(
      createTwoWindows(),
    );
  });
});
