import { size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { toPixel } from '../../palette/to-pixel';
import { createHud } from '../create-hud';
import { HUD_CONTENT_LEFT, HUD_CONTENT_TOP } from '../consts';
import type { HudDivider } from '../types/hud-divider';
import type { HudWindow } from '../types/hud-window';
import { paintHudDivider } from './paint-hud-divider';

const DIVIDER: HudDivider = Object.freeze({
  kind: 'divider',
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

describe('paintHudDivider', () => {
  it('should return a shadow line where the divider sits when it paints one', () => {
    expect(paintHudDivider(createHud(), WINDOW, DIVIDER)[0]).toEqual({
      pixel: toPixel(THEME.color, THEME.shadow),
      row: HUD_CONTENT_TOP + 10,
      column: HUD_CONTENT_LEFT,
      width: 60,
      height: 1,
    });
  });

  it('should return a light line under it when it paints a divider', () => {
    expect(paintHudDivider(createHud(), WINDOW, DIVIDER)[1]).toEqual({
      pixel: toPixel(THEME.color, THEME.highlight),
      row: HUD_CONTENT_TOP + 11,
      column: HUD_CONTENT_LEFT,
      width: 60,
      height: 1,
    });
  });

  it('should return two lines when it paints a divider', () => {
    expect(size(paintHudDivider(createHud(), WINDOW, DIVIDER))).toBe(2);
  });
});
