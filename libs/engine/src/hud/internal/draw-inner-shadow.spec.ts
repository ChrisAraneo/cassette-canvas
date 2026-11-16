import { describe, expect, it } from 'vitest';

import { toPixel } from '../../palette/to-pixel';
import { HUD_EDGE } from '../consts';
import { createHudTheme } from '../create-hud-theme';
import type { HudRect } from '../types/hud-rect';
import { drawInnerShadow } from './draw-inner-shadow';

const THEME = createHudTheme();

const WELL: HudRect = Object.freeze({
  row: 4,
  column: 6,
  width: 40,
  height: 12,
});

describe('drawInnerShadow', () => {
  it('should return a shadow line inside the top edge when it paints one', () => {
    expect(drawInnerShadow(WELL, THEME)).toEqual({
      pixel: toPixel(THEME.color, THEME.shadow),
      row: 4 + HUD_EDGE,
      column: 6 + HUD_EDGE,
      width: 40 - 2 * HUD_EDGE,
      height: HUD_EDGE,
    });
  });

  it('should return a line of less than no width when the surface is as narrow as its edges', () => {
    expect(drawInnerShadow({ ...WELL, width: 0 }, THEME)).toEqual({
      pixel: toPixel(THEME.color, THEME.shadow),
      row: 4 + HUD_EDGE,
      column: 6 + HUD_EDGE,
      width: -2 * HUD_EDGE,
      height: HUD_EDGE,
    });
  });

  it('should return the shadow of the theme it is given when it paints a line', () => {
    expect(drawInnerShadow(WELL, { ...THEME, shadow: 2 })).toEqual({
      ...drawInnerShadow(WELL, THEME),
      pixel: toPixel(THEME.color, 2),
    });
  });
});
