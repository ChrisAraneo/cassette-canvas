import { describe, expect, it } from 'vitest';

import { HUD_FRAME, HUD_TITLE_HEIGHT } from '../consts';
import type { HudWindow } from '../types/hud-window';
import { computeTitleRect } from './compute-title-rect';

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

describe('computeTitleRect', () => {
  it('should return a rectangle inside the frame that runs the width of the window when it measures the title bar', () => {
    expect(computeTitleRect(WINDOW)).toEqual({
      row: HUD_FRAME,
      column: HUD_FRAME,
      width: 90 - 2 * HUD_FRAME,
      height: HUD_TITLE_HEIGHT,
    });
  });

  it('should return a row measured from the window when the window sits at row 99', () => {
    expect(computeTitleRect({ ...WINDOW, row: 99 }).row).toBe(HUD_FRAME);
  });
});
