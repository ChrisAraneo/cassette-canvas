import { size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { toPixel } from '../../palette/to-pixel';
import { createHudTheme } from '../create-hud-theme';
import type { HudRect } from '../types/hud-rect';
import { drawGroove } from './draw-groove';
import { drawThemedGroove } from './draw-themed-groove';

const THEME = createHudTheme();

const RULE: HudRect = Object.freeze({
  row: 20,
  column: 6,
  width: 40,
  height: 2,
});

describe('drawThemedGroove', () => {
  it('should return the groove in the shades of the theme when it paints one', () => {
    expect(drawThemedGroove(RULE, THEME)).toEqual(
      drawGroove(
        RULE,
        toPixel(THEME.color, THEME.highlight),
        toPixel(THEME.color, THEME.shadow),
      ),
    );
  });

  it('should return the shadow line first and the light line under it when it paints a groove', () => {
    expect(drawThemedGroove(RULE, THEME)[0]).toEqual({
      pixel: toPixel(THEME.color, THEME.shadow),
      row: 20,
      column: 6,
      width: 40,
      height: 1,
    });
    expect(drawThemedGroove(RULE, THEME)[1]).toEqual({
      pixel: toPixel(THEME.color, THEME.highlight),
      row: 21,
      column: 6,
      width: 40,
      height: 1,
    });
  });

  it('should return the two lines of a groove when it paints one', () => {
    expect(size(drawThemedGroove(RULE, THEME))).toBe(2);
  });

  it('should return the groove in the color of the window when the theme names another one', () => {
    expect(drawThemedGroove(RULE, { ...THEME, color: 3 })).toEqual(
      drawGroove(RULE, toPixel(3, THEME.highlight), toPixel(3, THEME.shadow)),
    );
  });
});
