import { describe, expect, it } from 'vitest';

import { toPixel } from '../../palette/to-pixel';
import { HUD_EDGE } from '../consts';
import { createHudTheme } from '../create-hud-theme';
import type { HudRect } from '../types/hud-rect';
import { drawTitleGroove } from './draw-title-groove';

const THEME = createHudTheme();

const TITLE: HudRect = Object.freeze({
  row: 2,
  column: 2,
  width: 116,
  height: 12,
});

describe('drawTitleGroove', () => {
  it('should return a shadow line right under the title bar when it paints one', () => {
    expect(drawTitleGroove(TITLE, THEME)).toEqual({
      pixel: toPixel(THEME.color, THEME.shadow),
      row: 2 + 12,
      column: 2,
      width: 116,
      height: HUD_EDGE,
    });
  });

  it('should return a line as wide as the bar when the bar holds no width', () => {
    expect(drawTitleGroove({ ...TITLE, width: 0 }, THEME)).toEqual({
      pixel: toPixel(THEME.color, THEME.shadow),
      row: 2 + 12,
      column: 2,
      width: 0,
      height: HUD_EDGE,
    });
  });
});
