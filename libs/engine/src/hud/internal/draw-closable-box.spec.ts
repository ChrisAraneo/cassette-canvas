import { size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { toPixel } from '../../palette/to-pixel';
import { addHudWindow } from '../add-hud-window';
import { HUD_PRESS_SHIFT } from '../consts';
import { createHud } from '../create-hud';
import { createHudTheme } from '../create-hud-theme';
import type { Hud } from '../types/hud';
import type { HudGrab } from '../types/hud-grab';
import type { HudWindow } from '../types/hud-window';
import { computeCloseRect } from './compute-close-rect';
import { drawClosableBox } from './draw-closable-box';
import { drawFace } from './draw-face';
import { toHudWindow } from './to-hud-window';

const THEME = createHudTheme();

const SETTINGS = Object.freeze({
  id: 'deck',
  title: 'DECK',
  row: 0,
  column: 0,
  width: 120,
  height: 90,
});

const HUD: Hud = addHudWindow(createHud(), SETTINGS);

const DECK: HudWindow = toHudWindow(createHud(), SETTINGS);

const CLOSE_RECT = computeCloseRect(DECK);

const CLOSE_GRAB: HudGrab = Object.freeze({
  kind: 'CLOSE',
  window: 'deck',
  widget: '',
  row: 0,
  column: 0,
});

const HELD_HUD: Hud = Object.freeze({ ...HUD, grab: CLOSE_GRAB });

const FACE_BEVEL_AND_ART = 6;

describe('drawClosableBox', () => {
  it('should fill the box in the face shade when it paints one', () => {
    expect(drawClosableBox(HUD, DECK)[0]).toEqual({
      pixel: toPixel(THEME.color, THEME.face),
      ...CLOSE_RECT,
    });
  });

  it('should return a raised bevel around the box when the pointer does not hold it', () => {
    expect(drawClosableBox(HUD, DECK)[1]).toEqual(
      drawFace(CLOSE_RECT, THEME, false)[0],
    );
  });

  it('should press the bevel in when the pointer holds the box', () => {
    expect(drawClosableBox(HELD_HUD, DECK)[1]).toEqual(
      drawFace(CLOSE_RECT, THEME, true)[0],
    );
  });

  it('should put the X in the middle of the box when the pointer does not hold it', () => {
    expect(drawClosableBox(HUD, DECK)[FACE_BEVEL_AND_ART - 1]).toMatchObject({
      row: CLOSE_RECT.row + 2,
      column: CLOSE_RECT.column + 2,
    });
  });

  it('should move the X down and right when the pointer holds the box', () => {
    expect(
      drawClosableBox(HELD_HUD, DECK)[FACE_BEVEL_AND_ART - 1],
    ).toMatchObject({
      row: CLOSE_RECT.row + 2 + HUD_PRESS_SHIFT,
      column: CLOSE_RECT.column + 2 + HUD_PRESS_SHIFT,
    });
  });

  it('should return the face, the bevel and the X when it paints a close box', () => {
    expect(size(drawClosableBox(HUD, DECK))).toBe(FACE_BEVEL_AND_ART);
  });
});
