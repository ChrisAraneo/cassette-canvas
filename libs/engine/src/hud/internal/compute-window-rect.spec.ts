import { describe, expect, it } from 'vitest';

import type { HudWindow } from '../types/hud-window';
import { computeWindowRect } from './compute-window-rect';

const WINDOW: HudWindow = Object.freeze({
  id: 'street',
  title: 'STREET',
  row: 10,
  column: 20,
  width: 90,
  height: 76,
  color: 15,
  closable: true,
  page: '',
  widgets: [],
});

describe('computeWindowRect', () => {
  it('should take the place and the size of the window', () => {
    expect(computeWindowRect(WINDOW)).toEqual({
      row: 10,
      column: 20,
      width: 90,
      height: 76,
    });
  });
});
