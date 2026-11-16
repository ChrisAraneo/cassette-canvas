import { describe, expect, it } from 'vitest';

import { toPixel } from '../../palette/to-pixel';
import { toTextPaint } from '../../text/to-text-paint';
import { HUD_PADDING, HUD_TEXT_TOP } from '../consts';
import { createHud } from '../create-hud';
import { createHudTheme } from '../create-hud-theme';
import type { HudRect } from '../types/hud-rect';
import type { HudWindow } from '../types/hud-window';
import { drawTitleText } from './draw-title-text';
import { toHudWindow } from './to-hud-window';

const THEME = createHudTheme();

const TITLE: HudRect = Object.freeze({
  row: 2,
  column: 2,
  width: 116,
  height: 12,
});

const createDeck = (title: string): HudWindow =>
  toHudWindow(createHud(), {
    id: 'deck',
    title,
    row: 0,
    column: 0,
    width: 120,
    height: 90,
  });

describe('drawTitleText', () => {
  it('should return the title of the window inside the bar when it paints one', () => {
    expect(drawTitleText(createDeck('DECK'), TITLE, THEME)).toEqual(
      toTextPaint(
        'DECK',
        toPixel(THEME.color, THEME.text),
        2 + HUD_TEXT_TOP,
        2 + HUD_PADDING,
      ),
    );
  });

  it('should return an empty line of text when the window has no title', () => {
    expect(drawTitleText(createDeck(''), TITLE, THEME)).toEqual(
      toTextPaint(
        '',
        toPixel(THEME.color, THEME.text),
        2 + HUD_TEXT_TOP,
        2 + HUD_PADDING,
      ),
    );
  });
});
