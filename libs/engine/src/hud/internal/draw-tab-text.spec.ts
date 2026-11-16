import { describe, expect, it } from 'vitest';

import { toPixel } from '../../palette/to-pixel';
import { toTextPaint } from '../../text/to-text-paint';
import { HUD_LABEL_PADDING, HUD_TEXT_TOP } from '../consts';
import { createHudTheme } from '../create-hud-theme';
import type { HudRect } from '../types/hud-rect';
import type { HudTab } from '../types/hud-tab';
import { drawTabText } from './draw-tab-text';

const THEME = createHudTheme();

const TAB: HudTab = Object.freeze({ id: 'tracks', text: 'TRACKS' });

const RECT: HudRect = Object.freeze({
  row: 20,
  column: 6,
  width: 50,
  height: 12,
});

describe('drawTabText', () => {
  it('should return the text of the tab inside its padding when it paints one', () => {
    expect(drawTabText(TAB, RECT, THEME)).toEqual(
      toTextPaint(
        'TRACKS',
        toPixel(THEME.color, THEME.text),
        20 + HUD_TEXT_TOP,
        6 + HUD_LABEL_PADDING,
      ),
    );
  });

  it('should return an empty line of text when the tab holds no text', () => {
    expect(drawTabText({ ...TAB, text: '' }, RECT, THEME)).toEqual(
      toTextPaint(
        '',
        toPixel(THEME.color, THEME.text),
        20 + HUD_TEXT_TOP,
        6 + HUD_LABEL_PADDING,
      ),
    );
  });
});
