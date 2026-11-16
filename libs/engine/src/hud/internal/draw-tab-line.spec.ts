import { describe, expect, it } from 'vitest';

import { toPixel } from '../../palette/to-pixel';
import { HUD_CONTENT_LEFT, HUD_EDGE } from '../consts';
import { createHud } from '../create-hud';
import { createHudTheme } from '../create-hud-theme';
import type { HudRect } from '../types/hud-rect';
import type { HudWindow } from '../types/hud-window';
import { computeContentWidth } from './compute-content-width';
import { drawTabLine } from './draw-tab-line';
import { toHudWindow } from './to-hud-window';

const THEME = createHudTheme();

const STRIP: HudRect = Object.freeze({
  row: 20,
  column: 6,
  width: 90,
  height: 12,
});

const DECK: HudWindow = toHudWindow(createHud(), {
  id: 'deck',
  title: 'DECK',
  row: 0,
  column: 0,
  width: 160,
  height: 90,
});

describe('drawTabLine', () => {
  it('should return a light line across the content under the strip when it paints one', () => {
    expect(drawTabLine(DECK, STRIP, THEME)).toEqual({
      pixel: toPixel(THEME.color, THEME.highlight),
      row: 20 + 12 - HUD_EDGE,
      column: HUD_CONTENT_LEFT,
      width: computeContentWidth(DECK),
      height: HUD_EDGE,
    });
  });

  it('should return a narrower line when the window is narrower', () => {
    expect(drawTabLine({ ...DECK, width: 90 }, STRIP, THEME)).toEqual({
      ...drawTabLine(DECK, STRIP, THEME),
      width: computeContentWidth({ ...DECK, width: 90 }),
    });
  });
});
