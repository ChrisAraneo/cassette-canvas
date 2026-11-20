import { size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { toPixel } from '../../palette/to-pixel';
import { HUD_EDGE } from '../consts';
import { createHudTheme } from '../create-hud-theme';
import type { HudRect } from '../types/hud-rect';
import { drawBevel } from './draw-bevel';
import { drawSunken } from './draw-sunken';

const THEME = createHudTheme();

const WELL: HudRect = Object.freeze({
  row: 4,
  column: 6,
  width: 40,
  height: 12,
});

const SHADOW_STEP = 5;

const FILL_LINE_AND_SHADOW = 6;

describe('drawSunken', () => {
  it('should return the highlight shade over the whole surface when it paints one', () => {
    expect(drawSunken(WELL, THEME)[0]).toEqual({
      pixel: toPixel(THEME.color, THEME.highlight),
      ...WELL,
    });
  });

  it('should return a dark line around the surface when it paints one', () => {
    const edge = toPixel(THEME.color, THEME.edge);

    expect(drawSunken(WELL, THEME)[1]).toEqual(drawBevel(WELL, edge, edge)[0]);
  });

  it('should return a shadow line inside the top edge when it paints a sunken surface', () => {
    expect(drawSunken(WELL, THEME)[SHADOW_STEP]).toEqual({
      pixel: toPixel(THEME.color, THEME.shadow),
      row: WELL.row + HUD_EDGE,
      column: WELL.column + HUD_EDGE,
      width: WELL.width - 2 * HUD_EDGE,
      height: HUD_EDGE,
    });
  });

  it('should return the fill, the dark line, and the shadow when it paints a sunken surface', () => {
    expect(size(drawSunken(WELL, THEME))).toBe(FILL_LINE_AND_SHADOW);
  });
});
