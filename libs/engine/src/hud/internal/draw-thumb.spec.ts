import { describe, expect, it } from 'vitest';

import { toPixel } from '../../palette/to-pixel';
import { createHudTheme } from '../create-hud-theme';
import { drawBevel } from './draw-bevel';
import { drawThumb } from './draw-thumb';
import type { HudListLayout } from './types/hud-list-layout';

const THEME = createHudTheme();

const LAYOUT: HudListLayout = Object.freeze({
  capacity: 3,
  scroll: 0,
  lastPage: 2,
  items: Object.freeze([]),
  up: { row: 21, column: 67, width: 11, height: 11 },
  down: { row: 56, column: 67, width: 11, height: 11 },
  track: { row: 32, column: 67, width: 11, height: 24 },
  thumb: { row: 32, column: 67, width: 11, height: 12 },
});

describe('drawThumb', () => {
  it('should return a raised bevel when the pointer does not hold the thumb', () => {
    expect(drawThumb(LAYOUT, THEME, false)).toEqual(
      drawBevel(
        LAYOUT.thumb,
        toPixel(THEME.color, THEME.highlight),
        toPixel(THEME.color, THEME.shadow),
      ),
    );
  });

  it('should swap the light and the shadow sides when the pointer holds the thumb', () => {
    expect(drawThumb(LAYOUT, THEME, true)).toEqual(
      drawBevel(
        LAYOUT.thumb,
        toPixel(THEME.color, THEME.shadow),
        toPixel(THEME.color, THEME.highlight),
      ),
    );
  });

  it('should return the four lines of a bevel either way when it paints a thumb', () => {
    expect(drawThumb(LAYOUT, THEME, true)).not.toEqual(
      drawThumb(LAYOUT, THEME, false),
    );
  });
});
