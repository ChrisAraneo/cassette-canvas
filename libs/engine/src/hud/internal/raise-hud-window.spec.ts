import { map } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { addHudWindow } from '../add-hud-window';
import { createHud } from '../create-hud';
import type { Hud } from '../types/hud';
import { raiseHudWindow } from './raise-hud-window';

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

describe('raiseHudWindow', () => {
  it('should return the window last and the rest in order when it raises one', () => {
    expect(toIds(raiseHudWindow(createStack(), 'street'))).toEqual([
      'notes',
      'help',
      'street',
    ]);
  });

  it('should return the same order when the window is already on top', () => {
    expect(toIds(raiseHudWindow(createStack(), 'help'))).toEqual([
      'street',
      'notes',
      'help',
    ]);
  });

  it('should return the same windows when no window has the id', () => {
    expect(raiseHudWindow(createStack(), 'ghost')).toEqual(createStack());
  });
});
