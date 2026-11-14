import { size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { toPixel } from '../../palette/to-pixel';
import { createHudTheme } from '../create-hud-theme';
import { HUD_EDGE } from '../consts';
import type { HudRect } from '../types/hud-rect';
import { insetRect } from './inset-rect';
import { paintBevel } from './paint-bevel';
import { paintPanel } from './paint-panel';

const THEME = createHudTheme();

const PANEL: HudRect = Object.freeze({
  row: 4,
  column: 6,
  width: 40,
  height: 20,
});

describe('paintPanel', () => {
  it('should return the body shade over the whole panel when it paints one', () => {
    expect(paintPanel(PANEL, THEME)[0]).toEqual({
      pixel: toPixel(THEME.color, THEME.body),
      ...PANEL,
    });
  });

  it('should return a dark line around the panel when it paints one', () => {
    const edge = toPixel(THEME.color, THEME.edge);

    expect(paintPanel(PANEL, THEME)[1]).toEqual(
      paintBevel(PANEL, edge, edge)[0],
    );
  });

  it('should return a raised bevel inside that line when it paints a panel', () => {
    expect(paintPanel(PANEL, THEME)[5]).toEqual(
      paintBevel(
        insetRect(PANEL, HUD_EDGE),
        toPixel(THEME.color, THEME.highlight),
        toPixel(THEME.color, THEME.shadow),
      )[0],
    );
  });

  it('should return the fill and both bevels when it paints a panel', () => {
    expect(size(paintPanel(PANEL, THEME))).toBe(9);
  });
});
