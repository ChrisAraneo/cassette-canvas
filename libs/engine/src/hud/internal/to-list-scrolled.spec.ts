import { constant, map, times } from 'lodash-es';
import { match } from 'ts-pattern';
import { describe, expect, it } from 'vitest';

import { addHudWindow } from '../add-hud-window';
import { createHud } from '../create-hud';
import { findHudWidget } from '../find-hud-widget';
import type { Hud } from '../types/hud';
import type { HudList } from '../types/hud-list';
import type { HudListItem } from '../types/hud-list-item';
import { toListScrolled } from './to-list-scrolled';

const SCROLL_ABOVE_FIRST_ITEM = -3;

const SCROLL_PAST_LAST_PAGE = 99;

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

const toScroll = (hud: Hud): number | undefined =>
  match(findHudWidget(hud, 'deck', 'tracks'))
    .with({ kind: 'LIST' }, (list) => list.scroll)
    .otherwise(constant(undefined));

describe('toListScrolled', () => {
  it('should scroll the list to the item it is given when it scrolls one', () => {
    expect(toScroll(toListScrolled(createDeckHud(), 'deck', LIST, 1).hud)).toBe(
      1,
    );
  });

  it('should stop at the first item when it is asked to scroll above it', () => {
    expect(
      toScroll(
        toListScrolled(createDeckHud(), 'deck', LIST, SCROLL_ABOVE_FIRST_ITEM)
          .hud,
      ),
    ).toBe(0);
  });

  it('should stop at the last page when it is asked to scroll past it', () => {
    expect(
      toScroll(
        toListScrolled(createDeckHud(), 'deck', LIST, SCROLL_PAST_LAST_PAGE)
          .hud,
      ),
    ).toBe(2);
  });

  it('should let the grab and the focus go when it scrolls a list', () => {
    const change = toListScrolled(createDeckHud(), 'deck', LIST, 1);

    expect([change.hud.grab, change.hud.focus]).toEqual([undefined, undefined]);
  });

  it('should return no actions when it scrolls a list', () => {
    expect(toListScrolled(createDeckHud(), 'deck', LIST, 1).actions).toEqual(
      [],
    );
  });

  it('should not change the old HUD when it scrolls a list', () => {
    const hud = createDeckHud();

    toListScrolled(hud, 'deck', LIST, 1);

    expect(hud).toEqual(createDeckHud());
  });
});
