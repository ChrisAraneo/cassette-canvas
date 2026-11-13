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
  it('should leave the frame and the padding out on both sides', () => {
    expect(computeContentWidth(WINDOW)).toBe(90 - 2 * HUD_CONTENT_LEFT);
  });

  it('should never go below nothing', () => {
    expect(computeContentWidth({ ...WINDOW, width: 2 })).toBe(0);
  });
});
