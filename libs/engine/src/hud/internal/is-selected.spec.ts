import { describe, expect, it } from 'vitest';

import type { HudList } from '../types/hud-list';
import { isSelected } from './is-selected';
import type { HudListPlacement } from './types/hud-list-placement';

const PLACEMENT: HudListPlacement = Object.freeze({
  item: {
    id: 'track-1',
    lines: ['TRACK 1'],
    height: 0,
    widgets: [],
    selectable: true,
  },
  rect: { row: 0, column: 0, width: 60, height: 9 },
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

describe('isSelected', () => {
  it('should hold when the list has the item selected', () => {
    expect(isSelected(PLACEMENT, LIST)).toBe(true);
  });

  it('should not hold when the list has another item selected', () => {
    expect(isSelected(PLACEMENT, { ...LIST, selected: 'track-2' })).toBe(false);
  });

  it('should not hold when the list has nothing selected', () => {
    expect(isSelected(PLACEMENT, { ...LIST, selected: '' })).toBe(false);
  });
});
