import { describe, expect, it } from 'vitest';

import { HUD_LIST_ITEM_HEIGHT } from '../consts';
import type { HudListItem } from '../types/hud-list-item';
import { toLinesHeight } from './to-lines-height';

const ITEM: HudListItem = Object.freeze({
  id: 'track',
  lines: Object.freeze(['TRACK 1']),
  height: 0,
  widgets: Object.freeze([]),
  selectable: true,
});

describe('toLinesHeight', () => {
  it('should return the rows one line of text takes when the item holds one line', () => {
    expect(toLinesHeight(ITEM)).toBe(HUD_LIST_ITEM_HEIGHT);
  });

  it('should return the rows both lines take when the item holds two lines', () => {
    expect(toLinesHeight({ ...ITEM, lines: ['TRACK 1', '3:42'] })).toBe(
      2 * HUD_LIST_ITEM_HEIGHT,
    );
  });

  it('should return the rows one line takes when the item holds no lines at all', () => {
    expect(toLinesHeight({ ...ITEM, lines: [] })).toBe(HUD_LIST_ITEM_HEIGHT);
  });
});
