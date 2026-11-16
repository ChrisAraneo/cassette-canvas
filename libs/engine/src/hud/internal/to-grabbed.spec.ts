import { map, times } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { addHudWindow } from '../add-hud-window';
import { createHud } from '../create-hud';
import type { Hud } from '../types/hud';
import type { HudList } from '../types/hud-list';
import type { HudListItem } from '../types/hud-list-item';
import { computeListLayout } from './compute-list-layout';
import { toGrabbed } from './to-grabbed';

const createItems = (count: number): readonly HudListItem[] =>
  map(times(count), (index) => ({
    id: `${index}`,
    lines: [`TRACK ${index}`],
    height: 0,
    widgets: [],
    selectable: true,
  }));

const LIST: HudList = Object.freeze({
  kind: 'LIST',
  id: 'tracks',
  page: '',
  row: 0,
  column: 0,
  width: 80,
  height: 48,
  items: createItems(6),
  scroll: 0,
  selected: '',
});

const LAYOUT = computeListLayout(LIST);

const createDeckHud = (): Hud => ({
  ...addHudWindow(createHud(), {
    id: 'deck',
    title: 'DECK',
    row: 0,
    column: 0,
    width: 120,
    height: 90,
    widgets: [LIST],
  }),
  focus: { window: 'deck', widget: 'tracks' },
});

describe('toGrabbed', () => {
  it('should take hold of the thumb of the list when it grabs one', () => {
    expect(
      toGrabbed(
        createDeckHud(),
        'deck',
        LIST,
        LAYOUT,
        LAYOUT.thumb.row + 2,
        LAYOUT.thumb.column + 3,
      ).hud.grab,
    ).toEqual({
      kind: 'SCROLL',
      window: 'deck',
      widget: 'tracks',
      row: 2,
      column: 3,
    });
  });

  it('should take hold at the top-left of the thumb when the pointer is on that pixel', () => {
    expect(
      toGrabbed(
        createDeckHud(),
        'deck',
        LIST,
        LAYOUT,
        LAYOUT.thumb.row,
        LAYOUT.thumb.column,
      ).hud.grab,
    ).toMatchObject({ row: 0, column: 0 });
  });

  it('should let the focus go when it grabs a thumb', () => {
    expect(
      toGrabbed(createDeckHud(), 'deck', LIST, LAYOUT, 0, 0).hud.focus,
    ).toBeUndefined();
  });

  it('should return no actions when it grabs a thumb', () => {
    expect(
      toGrabbed(createDeckHud(), 'deck', LIST, LAYOUT, 0, 0).actions,
    ).toEqual([]);
  });

  it('should not change the old HUD when it grabs a thumb', () => {
    const hud = createDeckHud();

    toGrabbed(hud, 'deck', LIST, LAYOUT, 0, 0);

    expect(hud).toEqual(createDeckHud());
  });
});
