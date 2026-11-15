import { size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { toPixel } from '../../palette/to-pixel';
import { HUD_EDGE } from '../consts';
import { createHudTheme } from '../create-hud-theme';
import type { HudRect } from '../types/hud-rect';
import { computeInsetRect } from './compute-inset-rect';
import { drawBevel } from './draw-bevel';
import { drawPanel } from './draw-panel';

const THEME = createHudTheme();

const PANEL: HudRect = Object.freeze({
  row: 4,
  column: 6,
  width: 40,
  height: 20,
});

const INNER_BEVEL_STEP = 5;

const FILL_AND_TWO_BEVELS = 9;

describe('drawPanel', () => {
  it('should return the body shade over the whole panel when it paints one', () => {
    expect(drawPanel(PANEL, THEME)[0]).toEqual({
      pixel: toPixel(THEME.color, THEME.body),
      ...PANEL,
    });
  });

  it('should return a dark line around the panel when it paints one', () => {
    const edge = toPixel(THEME.color, THEME.edge);

    expect(drawPanel(PANEL, THEME)[1]).toEqual(drawBevel(PANEL, edge, edge)[0]);
  });

  it('should return a raised bevel inside that line when it paints a panel', () => {
    expect(drawPanel(PANEL, THEME)[INNER_BEVEL_STEP]).toEqual(
      drawBevel(
        computeInsetRect(PANEL, HUD_EDGE),
        toPixel(THEME.color, THEME.highlight),
        toPixel(THEME.color, THEME.shadow),
      )[0],
    );
  });

  it('should return the fill and both bevels when it paints a panel', () => {
    expect(size(drawPanel(PANEL, THEME))).toBe(FILL_AND_TWO_BEVELS);
  });
});
