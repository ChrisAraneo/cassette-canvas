import { describe, expect, it } from 'vitest';

import { createHudTheme } from '../create-hud-theme';
import type { HudList } from '../types/hud-list';
import { toItemShade } from './to-item-shade';
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

describe('toItemShade', () => {
  it('should read the item in the highlight shade when the list has it selected', () => {
    expect(toItemShade(PLACEMENT, LIST, THEME)).toBe(THEME.highlight);
  });

  it('should read the item in the text shade when the list has another item selected', () => {
    expect(
      toItemShade(PLACEMENT, { ...LIST, selected: 'track-2' }, THEME),
    ).toBe(THEME.text);
  });

  it('should read the item in the text shade when the list has nothing selected', () => {
    expect(toItemShade(PLACEMENT, { ...LIST, selected: '' }, THEME)).toBe(
      THEME.text,
    );
  });
});
