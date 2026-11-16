import { size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { toPixel } from '../../palette/to-pixel';
import { HUD_EDGE } from '../consts';
import { createHudTheme } from '../create-hud-theme';
import type { HudRect } from '../types/hud-rect';
import type { HudTab } from '../types/hud-tab';
import { drawOpenTab } from './draw-open-tab';
import { drawTabText } from './draw-tab-text';

const THEME = createHudTheme();

const TAB: HudTab = Object.freeze({ id: 'tracks', text: 'TRACKS' });

const RECT: HudRect = Object.freeze({
  row: 20,
  column: 6,
  width: 50,
  height: 12,
});

const FACE_THREE_EDGES_AND_TEXT = 5;

describe('drawOpenTab', () => {
  it('should fill the whole tab in the face shade when it paints the open one', () => {
    expect(drawOpenTab(TAB, RECT, THEME)[0]).toEqual({
      pixel: toPixel(THEME.color, THEME.face),
      ...RECT,
    });
  });

  it('should return a light line along the top and the left of the tab when it paints the open one', () => {
    expect(drawOpenTab(TAB, RECT, THEME)[1]).toEqual({
      pixel: toPixel(THEME.color, THEME.highlight),
      row: 20,
      column: 6,
      width: 50,
      height: HUD_EDGE,
    });
    expect(drawOpenTab(TAB, RECT, THEME)[2]).toEqual({
      pixel: toPixel(THEME.color, THEME.highlight),
      row: 20,
      column: 6,
      width: HUD_EDGE,
      height: 12,
    });
  });

  it('should return a shadow line down the right of the tab when it paints the open one', () => {
    expect(drawOpenTab(TAB, RECT, THEME)[3]).toEqual({
      pixel: toPixel(THEME.color, THEME.shadow),
      row: 20,
      column: 6 + 50 - HUD_EDGE,
      width: HUD_EDGE,
      height: 12,
    });
  });

  it('should leave the bottom of the tab open when it paints the open one', () => {
    expect(size(drawOpenTab(TAB, RECT, THEME))).toBe(FACE_THREE_EDGES_AND_TEXT);
  });

  it('should put the text of the tab on it when it paints the open one', () => {
    expect(
      drawOpenTab(TAB, RECT, THEME)[FACE_THREE_EDGES_AND_TEXT - 1],
    ).toEqual(drawTabText(TAB, RECT, THEME));
  });
});
