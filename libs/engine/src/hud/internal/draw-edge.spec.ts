import { describe, expect, it } from 'vitest';

import { toPixel } from '../../palette/to-pixel';
import { HUD_EDGE } from '../consts';
import { createHud } from '../create-hud';
import type { HudRect } from '../types/hud-rect';
import { drawEdge } from './draw-edge';

const RECT: HudRect = Object.freeze({
  row: 10,
  column: 4,
  width: 60,
  height: 20,
});

const EMPTY_RECT: HudRect = Object.freeze({
  row: 10,
  column: 4,
  width: 0,
  height: 0,
});

const THEME = createHud().theme;

const EDGE = toPixel(THEME.color, THEME.edge);

describe('drawEdge', () => {
  it('should return the four lines around the rectangle in the edge shade when it paints an edge', () => {
    expect(drawEdge(RECT, THEME)).toEqual([
      { pixel: EDGE, ...RECT, height: HUD_EDGE },
      { pixel: EDGE, ...RECT, width: HUD_EDGE },
      {
        pixel: EDGE,
        ...RECT,
        row: RECT.row + RECT.height - HUD_EDGE,
        height: HUD_EDGE,
      },
      {
        pixel: EDGE,
        ...RECT,
        column: RECT.column + RECT.width - HUD_EDGE,
        width: HUD_EDGE,
      },
    ]);
  });

  it('should return lines of no length when the rectangle has none', () => {
    expect(drawEdge(EMPTY_RECT, THEME)).toEqual([
      { pixel: EDGE, ...EMPTY_RECT, height: HUD_EDGE },
      { pixel: EDGE, ...EMPTY_RECT, width: HUD_EDGE },
      {
        pixel: EDGE,
        ...EMPTY_RECT,
        row: EMPTY_RECT.row + EMPTY_RECT.height - HUD_EDGE,
        height: HUD_EDGE,
      },
      {
        pixel: EDGE,
        ...EMPTY_RECT,
        column: EMPTY_RECT.column + EMPTY_RECT.width - HUD_EDGE,
        width: HUD_EDGE,
      },
    ]);
  });
});
