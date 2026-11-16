import { size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { toPixel } from '../../palette/to-pixel';
import { HUD_UP_ART } from '../consts';
import { createHudTheme } from '../create-hud-theme';
import type { HudRect } from '../types/hud-rect';
import { drawArrow } from './draw-arrow';
import { drawBevel } from './draw-bevel';

const THEME = createHudTheme();

const BOX: HudRect = Object.freeze({
  row: 21,
  column: 67,
  width: 11,
  height: 11,
});

const FACE_BEVEL_AND_ART = 6;

describe('drawArrow', () => {
  it('should fill the box in the face shade when it paints an arrow', () => {
    expect(drawArrow(BOX, HUD_UP_ART, THEME)[0]).toEqual({
      pixel: toPixel(THEME.color, THEME.face),
      ...BOX,
    });
  });

  it('should return a raised bevel around the box when it paints an arrow', () => {
    expect(drawArrow(BOX, HUD_UP_ART, THEME)[1]).toEqual(
      drawBevel(
        BOX,
        toPixel(THEME.color, THEME.highlight),
        toPixel(THEME.color, THEME.shadow),
      )[0],
    );
  });

  it('should put the art in the middle of the box when it paints an arrow', () => {
    expect(drawArrow(BOX, HUD_UP_ART, THEME)[FACE_BEVEL_AND_ART - 1]) //
      .toMatchObject({ row: 21 + 4, column: 67 + 3 });
  });

  it('should return the face, the bevel and the art when it paints an arrow', () => {
    expect(size(drawArrow(BOX, HUD_UP_ART, THEME))).toBe(FACE_BEVEL_AND_ART);
  });

  it('should put the art at the top-left of the box when there is no art at all', () => {
    expect(drawArrow(BOX, [], THEME)[FACE_BEVEL_AND_ART - 1]).toMatchObject({
      row: 21 + 5,
      column: 67 + 5,
    });
  });
});
