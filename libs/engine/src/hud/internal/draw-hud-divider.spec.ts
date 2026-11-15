import { size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { toPixel } from '../../palette/to-pixel';
import { HUD_CONTENT_LEFT, HUD_CONTENT_TOP } from '../consts';
import { createHud } from '../create-hud';
import type { HudDivider } from '../types/hud-divider';
import type { HudWindow } from '../types/hud-window';
import { drawHudDivider } from './draw-hud-divider';

const DIVIDER: HudDivider = Object.freeze({
  kind: 'DIVIDER',
  id: 'line',
  page: '',
  row: 10,
  column: 0,
  width: 60,
});

const WINDOW: HudWindow = Object.freeze({
  id: 'deck',
  title: 'DECK',
  row: 0,
  column: 0,
  width: 80,
  height: 60,
  color: 15,
  closable: true,
  page: '',
  widgets: [DIVIDER],
});

const THEME = createHud().theme;

describe('drawHudDivider', () => {
  it('should return a shadow line where the divider sits when it paints one', () => {
    expect(drawHudDivider(createHud(), WINDOW, DIVIDER)[0]).toEqual({
      pixel: toPixel(THEME.color, THEME.shadow),
      row: HUD_CONTENT_TOP + 10,
      column: HUD_CONTENT_LEFT,
      width: 60,
      height: 1,
    });
  });

  it('should return a light line under it when it paints a divider', () => {
    expect(drawHudDivider(createHud(), WINDOW, DIVIDER)[1]).toEqual({
      pixel: toPixel(THEME.color, THEME.highlight),
      row: HUD_CONTENT_TOP + 11,
      column: HUD_CONTENT_LEFT,
      width: 60,
      height: 1,
    });
  });

  it('should return two lines when it paints a divider', () => {
    expect(size(drawHudDivider(createHud(), WINDOW, DIVIDER))).toBe(2);
  });
});
