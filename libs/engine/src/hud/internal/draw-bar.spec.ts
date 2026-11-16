import { size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { toPixel } from '../../palette/to-pixel';
import { HUD_DOWN_ART, HUD_UP_ART } from '../consts';
import { createHudTheme } from '../create-hud-theme';
import { drawArrow } from './draw-arrow';
import { drawBar } from './draw-bar';
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

const TRACK_THUMB_BEVEL_AND_ARROWS = 18;

describe('drawBar', () => {
  it('should fill the track in the body shade when it paints a scroll bar', () => {
    expect(drawBar(LAYOUT, THEME, false)[0]).toEqual({
      pixel: toPixel(THEME.color, THEME.body),
      ...LAYOUT.track,
    });
  });

  it('should fill the thumb in the face shade over the track when it paints a scroll bar', () => {
    expect(drawBar(LAYOUT, THEME, false)[1]).toEqual({
      pixel: toPixel(THEME.color, THEME.face),
      ...LAYOUT.thumb,
    });
  });

  it('should return the bevel of the thumb pressed in when the pointer holds it', () => {
    expect(drawBar(LAYOUT, THEME, true)[2]).toEqual(
      drawThumb(LAYOUT, THEME, true)[0],
    );
  });

  it('should paint the up arrow before the down arrow when it paints a scroll bar', () => {
    expect(drawBar(LAYOUT, THEME, false)[6]).toEqual(
      drawArrow(LAYOUT.up, HUD_UP_ART, THEME)[0],
    );
    expect(drawBar(LAYOUT, THEME, false)[12]).toEqual(
      drawArrow(LAYOUT.down, HUD_DOWN_ART, THEME)[0],
    );
  });

  it('should return the track, the thumb and both arrows when it paints a scroll bar', () => {
    expect(size(drawBar(LAYOUT, THEME, false))).toBe(
      TRACK_THUMB_BEVEL_AND_ARROWS,
    );
  });
});
