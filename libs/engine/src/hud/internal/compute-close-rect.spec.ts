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
  it('should return a square rectangle when it measures the close box', () => {
    expect(computeCloseRect(WINDOW)).toMatchObject({
      width: HUD_CLOSE_SIZE,
      height: HUD_CLOSE_SIZE,
    });
  });

  it('should return a rectangle at the right end of the title bar when it measures the close box', () => {
    const close = computeCloseRect(WINDOW);

    expect(close.column + close.width).toBe(
      90 - HUD_FRAME - (HUD_TITLE_HEIGHT - HUD_CLOSE_SIZE) / 2,
    );
  });

  it('should return a rectangle that fits inside the title bar when it measures the close box', () => {
    const close = computeCloseRect(WINDOW);
    const title = computeTitleRect(WINDOW);

    expect(
      isInside(title, close.row, close.column) &&
        isInside(title, close.row + close.height - 1, close.column),
    ).toBe(true);
  });

  it('should return a rectangle that moves with the right edge when the window is wider', () => {
    expect(computeCloseRect({ ...WINDOW, width: 120 }).column).toBe(
      computeCloseRect(WINDOW).column + 30,
    );
  });
});
