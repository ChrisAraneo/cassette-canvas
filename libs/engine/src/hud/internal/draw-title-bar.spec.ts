import { describe, expect, it } from 'vitest';

import { toPixel } from '../../palette/to-pixel';
import { createHudTheme } from '../create-hud-theme';
import type { HudRect } from '../types/hud-rect';
import { drawTitleBar } from './draw-title-bar';

const THEME = createHudTheme();

const TITLE: HudRect = Object.freeze({
  row: 2,
  column: 2,
  width: 116,
  height: 12,
});

describe('drawTitleBar', () => {
  it('should fill the whole bar in the title shade when it paints one', () => {
    expect(drawTitleBar(TITLE, THEME)).toEqual({
      pixel: toPixel(THEME.color, THEME.title),
      ...TITLE,
    });
  });

  it('should fill the bar in the color of the window when the theme names another one', () => {
    expect(drawTitleBar(TITLE, { ...THEME, color: 3 })).toEqual({
      pixel: toPixel(3, THEME.title),
      ...TITLE,
    });
  });
});
