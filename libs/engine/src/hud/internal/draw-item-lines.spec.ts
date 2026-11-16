import { map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { toPixel } from '../../palette/to-pixel';
import { TEXT_ASCENT } from '../../text/consts';
import { toTextPaint } from '../../text/to-text-paint';
import { createHudTheme } from '../create-hud-theme';
import {
  HUD_LIST_ITEM_HEIGHT,
  HUD_LIST_TEXT_LEFT,
  HUD_LIST_TEXT_TOP,
} from '../consts';
import type { HudList } from '../types/hud-list';
import { drawItemLines } from './draw-item-lines';
import type { HudListPlacement } from './types/hud-list-placement';

const THEME = createHudTheme();

const createPlacement = (lines: readonly string[]): HudListPlacement => ({
  item: {
    id: 'track-1',
    lines,
    height: 0,
    widgets: [],
    selectable: true,
  },
  rect: { row: 22, column: 12, width: 60, height: 9 },
});

const LIST: HudList = Object.freeze({
  kind: 'LIST',
  id: 'tracks',
  page: '',
  row: 0,
  column: 0,
  width: 80,
  height: 48,
  items: Object.freeze([]),
  scroll: 0,
  selected: '',
});

describe('drawItemLines', () => {
  it('should return one line of text for each line the item holds when it paints one', () => {
    expect(
      size(drawItemLines(createPlacement(['TRACK 1', '3:42']), LIST, THEME)),
    ) //
      .toBe(2);
  });

  it('should put the first line inside the top-left of the item when it paints one', () => {
    expect(drawItemLines(createPlacement(['TRACK 1']), LIST, THEME)[0]).toEqual(
      toTextPaint(
        'TRACK 1',
        toPixel(THEME.color, THEME.text),
        22 + HUD_LIST_TEXT_TOP,
        12 + HUD_LIST_TEXT_LEFT,
      ),
    );
  });

  it('should put each later line one row of text below the one before it', () => {
    expect(
      map(
        drawItemLines(createPlacement(['TRACK 1', '3:42']), LIST, THEME),
        (paint) => paint.row,
      ),
    ).toEqual([
      22 + HUD_LIST_TEXT_TOP - TEXT_ASCENT,
      22 + HUD_LIST_TEXT_TOP - TEXT_ASCENT + HUD_LIST_ITEM_HEIGHT,
    ]);
  });

  it('should paint nothing when the item holds no lines at all', () => {
    expect(drawItemLines(createPlacement([]), LIST, THEME)).toEqual([]);
  });

  it('should paint the item in another shade when the list has it selected', () => {
    expect(
      drawItemLines(
        createPlacement(['TRACK 1']),
        { ...LIST, selected: 'track-1' },
        THEME,
      )[0],
    ).not.toEqual(drawItemLines(createPlacement(['TRACK 1']), LIST, THEME)[0]);
  });

  it('should not change the item it was given when it paints the lines', () => {
    const placement = createPlacement(['TRACK 1']);

    drawItemLines(placement, LIST, THEME);

    expect(placement).toEqual(createPlacement(['TRACK 1']));
  });
});
