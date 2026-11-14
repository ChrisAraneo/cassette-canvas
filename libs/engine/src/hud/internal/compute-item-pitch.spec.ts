import { describe, expect, it } from 'vitest';

import { HUD_DIVIDER_HEIGHT, HUD_LIST_ITEM_PITCH } from '../consts';
import type { HudListItem } from '../types/hud-list-item';
import { computeItemPitch } from './compute-item-pitch';

const ITEM: HudListItem = Object.freeze({
  id: 'neon',
  lines: ['NEON RAIN'],
  height: 0,
  widgets: [],
  selectable: true,
});

describe('computeItemPitch', () => {
  it('should return one item and one divider when the item holds one line', () => {
    expect(computeItemPitch(ITEM)).toBe(HUD_LIST_ITEM_PITCH);
  });

  it('should return the height the item asks for and one divider when it asks for one', () => {
    expect(computeItemPitch({ ...ITEM, height: 24 })).toBe(
      24 + HUD_DIVIDER_HEIGHT,
    );
  });
});
