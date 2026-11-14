import { describe, expect, it } from 'vitest';

import { HUD_CONTENT_LEFT } from '../consts';
import type { HudWindow } from '../types/hud-window';
import { computeContentWidth } from './compute-content-width';

const WINDOW: HudWindow = Object.freeze({
  id: 'street',
  title: 'STREET',
  row: 0,
  column: 0,
  width: 90,
  height: 76,
  color: 15,
  closable: true,
  page: '',
  widgets: [],
});

describe('computeContentWidth', () => {
  it('should return the width without the frame and the padding on both sides when it measures the content', () => {
    expect(computeContentWidth(WINDOW)).toBe(90 - 2 * HUD_CONTENT_LEFT);
  });

  it('should return 0 when the window is narrower than the frame and the padding', () => {
    expect(computeContentWidth({ ...WINDOW, width: 2 })).toBe(0);
  });
});
