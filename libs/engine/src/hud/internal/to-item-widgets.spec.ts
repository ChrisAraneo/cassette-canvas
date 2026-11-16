import { map, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import type { HudButton } from '../types/hud-button';
import { toItemWidgets } from './to-item-widgets';
import type { HudListPlacement } from './types/hud-list-placement';

const BUTTON: HudButton = Object.freeze({
  kind: 'BUTTON',
  id: 'play',
  page: '',
  row: 1,
  column: 2,
  width: 0,
  text: 'PLAY',
});

const createPlacement = (): HudListPlacement => ({
  item: {
    id: 'track-1',
    lines: ['TRACK 1'],
    height: 0,
    widgets: [BUTTON, { ...BUTTON, id: 'drop' }],
    selectable: true,
  },
  rect: { row: 40, column: 12, width: 60, height: 9 },
});

describe('toItemWidgets', () => {
  it('should return one widget for each one that sits on the item when it reads them', () => {
    expect(size(toItemWidgets(createPlacement()))).toBe(2);
  });

  it('should name the item each widget sits on when it reads them', () => {
    expect(map(toItemWidgets(createPlacement()), (placed) => placed.item)) //
      .toEqual(['track-1', 'track-1']);
  });

  it('should move each widget to where the item sits in the window when it reads them', () => {
    expect(toItemWidgets(createPlacement())[0]?.widget.row).not.toBe(1);
  });

  it('should return no widgets when the item holds none', () => {
    const placement = createPlacement();

    expect(
      toItemWidgets({ ...placement, item: { ...placement.item, widgets: [] } }),
    ).toEqual([]);
  });

  it('should not change the item it was given when it reads the widgets', () => {
    const placement = createPlacement();

    toItemWidgets(placement);

    expect(placement).toEqual(createPlacement());
  });
});
