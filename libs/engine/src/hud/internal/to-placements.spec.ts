import { map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { HUD_PADDING } from '../consts';
import type { HudListItem } from '../types/hud-list-item';
import type { HudRect } from '../types/hud-rect';
import { toPlacements } from './to-placements';

const RECT: HudRect = Object.freeze({
  row: 20,
  column: 10,
  width: 80,
  height: 48,
});

const createItem = (id: string): HudListItem => ({
  id,
  lines: [`TRACK ${id}`],
  height: 0,
  widgets: [],
  selectable: true,
});

const ITEMS: readonly HudListItem[] = Object.freeze([
  createItem('1'),
  createItem('2'),
  createItem('3'),
]);

describe('toPlacements', () => {
  it('should place every item it is given when it lays them out', () => {
    expect(size(toPlacements(ITEMS, RECT))).toBe(3);
  });

  it('should place the items one under the other when it lays them out', () => {
    const rows = map(toPlacements(ITEMS, RECT), (placed) => placed.rect.row);

    expect(rows[0]).toBe(20 + HUD_PADDING);
    expect(rows[1]).toBeGreaterThan(rows[0] ?? 0);
    expect(rows[2]).toBeGreaterThan(rows[1] ?? 0);
  });

  it('should carry each item on its own placement when it lays them out', () => {
    expect(map(toPlacements(ITEMS, RECT), (placed) => placed.item.id)).toEqual([
      '1',
      '2',
      '3',
    ]);
  });

  it('should place nothing when there are no items at all', () => {
    expect(toPlacements([], RECT)).toEqual([]);
  });
});
