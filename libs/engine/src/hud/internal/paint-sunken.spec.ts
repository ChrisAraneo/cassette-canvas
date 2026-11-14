import { size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { toPixel } from '../../palette/to-pixel';
import { createHudTheme } from '../create-hud-theme';
import type { HudRect } from '../types/hud-rect';
import { paintBevel } from './paint-bevel';
import { paintSunken } from './paint-sunken';

const THEME = createHudTheme();

const WELL: HudRect = Object.freeze({
  row: 4,
  column: 6,
  width: 40,
  height: 12,
});

describe('paintSunken', () => {
  it('should return the highlight shade over the whole surface when it paints one', () => {
    expect(paintSunken(WELL, THEME)[0]).toEqual({
      pixel: toPixel(THEME.color, THEME.highlight),
      ...WELL,
    });
  });

  it('should return a dark line around the surface when it paints one', () => {
    const edge = toPixel(THEME.color, THEME.edge);

    expect(paintSunken(WELL, THEME)[1]).toEqual(
      paintBevel(WELL, edge, edge)[0],
    );
  });

  it('should return a shadow line inside the top edge when it paints a sunken surface', () => {
    expect(paintSunken(WELL, THEME)[5]).toEqual({
      pixel: toPixel(THEME.color, THEME.shadow),
      row: 5,
      column: 7,
      width: 38,
      height: 1,
    });
  });

  it('should return the fill, the dark line, and the shadow when it paints a sunken surface', () => {
    expect(size(paintSunken(WELL, THEME))).toBe(6);
  });
});
