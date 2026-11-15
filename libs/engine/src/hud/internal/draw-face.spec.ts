import { size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { toPixel } from '../../palette/to-pixel';
import { createHud } from '../create-hud';
import type { HudRect } from '../types/hud-rect';
import { drawFace } from './draw-face';

const BOX: HudRect = Object.freeze({
  row: 2,
  column: 3,
  width: 10,
  height: 6,
});

const THEME = createHud().theme;

const HIGHLIGHT = toPixel(THEME.color, THEME.highlight);

const SHADOW = toPixel(THEME.color, THEME.shadow);

describe('drawFace', () => {
  it('should return the four lines of a bevel when it draws a face', () => {
    expect(size(drawFace(BOX, THEME, false))).toBe(4);
  });

  it('should return the highlight along the top when the face is free', () => {
    expect(drawFace(BOX, THEME, false)[0]).toMatchObject({
      pixel: HIGHLIGHT,
      row: 2,
      height: 1,
    });
  });

  it('should return the shadow along the bottom when the face is free', () => {
    expect(drawFace(BOX, THEME, false)[2]).toMatchObject({
      pixel: SHADOW,
      height: 1,
    });
  });

  it('should return the shadow along the top when the face is held down', () => {
    expect(drawFace(BOX, THEME, true)[0]).toMatchObject({
      pixel: SHADOW,
      row: 2,
      height: 1,
    });
  });

  it('should return the highlight along the bottom when the face is held down', () => {
    expect(drawFace(BOX, THEME, true)[2]).toMatchObject({
      pixel: HIGHLIGHT,
      height: 1,
    });
  });

  it('should return the face in the color of the theme it is given when it draws one', () => {
    expect(drawFace(BOX, { ...THEME, color: 3 }, false)[0]).toMatchObject({
      pixel: toPixel(3, THEME.highlight),
    });
  });
});
