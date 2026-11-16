import { size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { toPixel } from '../../palette/to-pixel';
import { HUD_TAB_DROP } from '../consts';
import { createHudTheme } from '../create-hud-theme';
import type { HudRect } from '../types/hud-rect';
import type { HudTab } from '../types/hud-tab';
import { drawBevel } from './draw-bevel';
import { drawClosedTab } from './draw-closed-tab';
import { drawTabText } from './draw-tab-text';

const THEME = createHudTheme();

const TAB: HudTab = Object.freeze({ id: 'tracks', text: 'TRACKS' });

const RECT: HudRect = Object.freeze({
  row: 20,
  column: 6,
  width: 50,
  height: 12,
});

const DROPPED: HudRect = Object.freeze({
  row: 20 + HUD_TAB_DROP,
  column: 6,
  width: 50,
  height: 12 - HUD_TAB_DROP,
});

const FACE_BEVEL_AND_TEXT = 6;

describe('drawClosedTab', () => {
  it('should fill the tab in the body shade below the open ones when it paints one', () => {
    expect(drawClosedTab(TAB, RECT, THEME)[0]).toEqual({
      pixel: toPixel(THEME.color, THEME.body),
      ...DROPPED,
    });
  });

  it('should return a raised bevel around the dropped tab when it paints one', () => {
    expect(drawClosedTab(TAB, RECT, THEME)[1]).toEqual(
      drawBevel(
        DROPPED,
        toPixel(THEME.color, THEME.highlight),
        toPixel(THEME.color, THEME.shadow),
      )[0],
    );
  });

  it('should put the text of the tab inside the dropped tab when it paints one', () => {
    expect(drawClosedTab(TAB, RECT, THEME)[FACE_BEVEL_AND_TEXT - 1]).toEqual(
      drawTabText(TAB, { ...RECT, row: RECT.row + HUD_TAB_DROP }, THEME),
    );
  });

  it('should return the face, the bevel and the text when it paints a closed tab', () => {
    expect(size(drawClosedTab(TAB, RECT, THEME))).toBe(FACE_BEVEL_AND_TEXT);
  });
});
