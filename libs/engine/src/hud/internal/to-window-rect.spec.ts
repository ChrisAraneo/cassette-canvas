import { describe, expect, it } from 'vitest';

import type { HudWindow } from '../types/hud-window';
import { toWindowRect } from './to-window-rect';

const WINDOW: HudWindow = Object.freeze({
  id: 'deck',
  title: 'DECK',
  row: 40,
  column: 24,
  width: 120,
  height: 80,
  color: 15,
  closable: true,
  page: '',
  widgets: [],
});

describe('toWindowRect', () => {
  it('should measure the window from its own top-left pixel when it reads its rectangle', () => {
    expect(toWindowRect(WINDOW)).toEqual({
      row: 0,
      column: 0,
      width: 120,
      height: 80,
    });
  });

  it('should leave the rectangle at the top-left wherever the window sits on the screen', () => {
    expect(toWindowRect({ ...WINDOW, row: 0, column: 0 })).toEqual(
      toWindowRect(WINDOW),
    );
  });
});
