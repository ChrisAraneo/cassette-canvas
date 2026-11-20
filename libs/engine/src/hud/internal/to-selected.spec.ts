import { constant, map, times } from 'lodash-es';
import { match } from 'ts-pattern';
import { describe, expect, it } from 'vitest';

import { addHudWindow } from '../add-hud-window';
import { createHud } from '../create-hud';
import { findHudWidget } from '../find-hud-widget';
import type { Hud } from '../types/hud';
import type { HudList } from '../types/hud-list';
import type { HudListItem } from '../types/hud-list-item';
import { toSelected } from './to-selected';

const createItems = (count: number): readonly HudListItem[] =>
  map(times(count), (index) => ({
    id: `${index}`,
    lines: [`TRACK ${index}`],
    height: 0,
    widgets: [],
    selectable: true,
  }));

const ITEMS = createItems(3);

const LIST: HudList = Object.freeze({
  kind: 'LIST',
  id: 'tracks',
  page: '',
  row: 0,
  column: 0,
  width: 80,
  height: 48,
  items: ITEMS,
  scroll: 0,
  selected: '',
});

const ITEM: HudListItem = Object.freeze({
  id: '1',
  lines: ['TRACK 1'],
  height: 0,
  widgets: [],
  selectable: true,
});

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
  grab: { kind: 'SCROLL', window: 'deck', widget: 'tracks', row: 1, column: 1 },
  focus: { window: 'deck', widget: 'tracks' },
});

const toSelection = (hud: Hud): string | undefined =>
  match(findHudWidget(hud, 'deck', 'tracks'))
    .with({ kind: 'LIST' }, (list) => list.selected)
    .otherwise(constant(undefined));

describe('toSelected', () => {
  it('should select the item in the list when it selects one', () => {
    expect(
      toSelection(toSelected(createDeckHud(), 'deck', LIST, ITEM).hud),
    ).toBe('1');
  });

  it('should return a SELECT action naming the item when it selects one', () => {
    expect(toSelected(createDeckHud(), 'deck', LIST, ITEM).actions).toEqual([
      { kind: 'SELECT', window: 'deck', widget: 'tracks', value: '1' },
    ]);
  });

  it('should let the grab and the focus go when it selects an item', () => {
    const change = toSelected(createDeckHud(), 'deck', LIST, ITEM);

    expect([change.hud.grab, change.hud.focus]).toEqual([undefined, undefined]);
  });

  it('should not change the old HUD when it selects an item', () => {
    const hud = createDeckHud();

    toSelected(hud, 'deck', LIST, ITEM);

    expect(hud).toEqual(createDeckHud());
  });
});
