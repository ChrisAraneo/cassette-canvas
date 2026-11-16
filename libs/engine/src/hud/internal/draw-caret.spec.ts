import { describe, expect, it } from 'vitest';

import { TRANSPARENT } from '../../palette/consts';
import { computeTextAdvance } from '../../text/compute-text-advance';
import {
  HUD_CARET_HEIGHT,
  HUD_CARET_WIDTH,
  HUD_PADDING,
  HUD_TEXT_TOP,
} from '../consts';
import type { HudRect } from '../types/hud-rect';
import { drawCaret } from './draw-caret';

const TEXT_PIXEL = 0xf1;

const FIELD: HudRect = Object.freeze({
  row: 20,
  column: 6,
  width: 60,
  height: 12,
});

describe('drawCaret', () => {
  it('should return the caret right after the text when the field has the focus', () => {
    expect(drawCaret(FIELD, 'HI', TEXT_PIXEL, true)).toEqual({
      pixel: TEXT_PIXEL,
      row: 20 + HUD_TEXT_TOP,
      column: 6 + HUD_PADDING + computeTextAdvance('HI'),
      width: HUD_CARET_WIDTH,
      height: HUD_CARET_HEIGHT,
    });
  });

  it('should return the caret at the start of the field when the field holds no text', () => {
    expect(drawCaret(FIELD, '', TEXT_PIXEL, true)).toEqual({
      ...drawCaret(FIELD, 'HI', TEXT_PIXEL, true),
      column: 6 + HUD_PADDING,
    });
  });

  it('should return a caret that draws nothing when the field does not have the focus', () => {
    expect(drawCaret(FIELD, 'HI', TEXT_PIXEL, false)).toEqual({
      ...drawCaret(FIELD, 'HI', TEXT_PIXEL, true),
      pixel: TRANSPARENT,
    });
  });
});
