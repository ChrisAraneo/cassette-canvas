import { describe, expect, it } from 'vitest';

import { toPixel } from '../../palette/to-pixel';
import { createHudTheme } from '../create-hud-theme';
import type { HudList } from '../types/hud-list';
import { drawSelection } from './draw-selection';
import type { HudListPlacement } from './types/hud-list-placement';

const THEME = createHudTheme();

const PLACEMENT: HudListPlacement = Object.freeze({
  item: {
    id: 'track-1',
    lines: ['TRACK 1'],
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
  items: [PLACEMENT.item],
  scroll: 0,
  selected: 'track-1',
});

describe('drawSelection', () => {
  it('should fill the item in the shadow shade when the list has it selected', () => {
    expect(drawSelection(PLACEMENT, LIST, THEME)).toEqual([
      { pixel: toPixel(THEME.color, THEME.shadow), ...PLACEMENT.rect },
    ]);
  });

  it('should paint nothing when the list has another item selected', () => {
    expect(
      drawSelection(PLACEMENT, { ...LIST, selected: 'track-2' }, THEME),
    ).toEqual([]);
  });

  it('should paint nothing when the list has nothing selected', () => {
    expect(drawSelection(PLACEMENT, { ...LIST, selected: '' }, THEME)).toEqual(
      [],
    );
  });
});
