import { map } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { addHudWindow } from '../add-hud-window';
import { createHud } from '../create-hud';
import type { Hud } from '../types/hud';
import { patchTopWindow } from './patch-top-window';

const createStack = (): Hud =>
  addHudWindow(
    addHudWindow(
      addHudWindow(createHud(), {
        id: 'street',
        title: 'STREET',
        row: 0,
        column: 0,
        width: 90,
        height: 76,
      }),
      { id: 'notes', title: 'NOTES', row: 0, column: 0, width: 90, height: 76 },
    ),
    { id: 'help', title: 'HELP', row: 0, column: 0, width: 90, height: 76 },
  );

const toIds = (hud: Hud): string[] => map(hud.windows, (window) => window.id);

describe('patchTopWindow', () => {
  it('should return the window last and the rest in order when it raises one', () => {
    expect(toIds(patchTopWindow(createStack(), 'street'))).toEqual([
      'notes',
      'help',
      'street',
    ]);
  });

  it('should return the same order when the window is already on top', () => {
    expect(toIds(patchTopWindow(createStack(), 'help'))).toEqual([
      'street',
      'notes',
      'help',
    ]);
  });

  it('should return the same windows when no window has the id', () => {
    expect(patchTopWindow(createStack(), 'ghost')).toEqual(createStack());
  });

  it('should not change the old HUD when it raises a window', () => {
    const hud = createStack();

    patchTopWindow(hud, 'street');

    expect(hud).toEqual(createStack());
  });
});
