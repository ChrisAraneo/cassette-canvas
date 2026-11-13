import { describe, expect, it } from 'vitest';

import { HUD_CLOSE_SIZE, HUD_FRAME, HUD_TITLE_HEIGHT } from '../consts';
import type { HudWindow } from '../types/hud-window';
import { computeCloseRect } from './compute-close-rect';
import { computeTitleRect } from './compute-title-rect';
import { isInside } from './is-inside';

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

describe('computeCloseRect', () => {
  it('should be square', () => {
    expect(computeCloseRect(WINDOW)).toMatchObject({
      width: HUD_CLOSE_SIZE,
      height: HUD_CLOSE_SIZE,
    });
  });

  it('should sit at the right end of the title bar', () => {
    const close = computeCloseRect(WINDOW);

    expect(close.column + close.width).toBe(
      90 - HUD_FRAME - (HUD_TITLE_HEIGHT - HUD_CLOSE_SIZE) / 2,
    );
  });

  it('should fit inside the title bar', () => {
    const close = computeCloseRect(WINDOW);
    const title = computeTitleRect(WINDOW);

    expect(
      isInside(title, close.row, close.column) &&
        isInside(title, close.row + close.height - 1, close.column),
    ).toBe(true);
  });

  it('should move with the right edge when the window is wider', () => {
    expect(computeCloseRect({ ...WINDOW, width: 120 }).column).toBe(
      computeCloseRect(WINDOW).column + 30,
    );
  });
});
