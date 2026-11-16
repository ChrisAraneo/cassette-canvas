import { constant, map, times } from 'lodash-es';
import { match } from 'ts-pattern';
import { describe, expect, it } from 'vitest';

import { addHudWindow } from '../add-hud-window';
import { createHud } from '../create-hud';
import { findHudWidget } from '../find-hud-widget';
import type { Hud } from '../types/hud';
import type { HudGrab } from '../types/hud-grab';
import type { HudList } from '../types/hud-list';
import type { HudListItem } from '../types/hud-list-item';
import { computeListLayout } from './compute-list-layout';
import { toThumbScrolled } from './to-thumb-scrolled';

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

const GRAB: HudGrab = Object.freeze({
  kind: 'SCROLL',
  window: 'deck',
  widget: 'tracks',
  row: 0,
  column: 0,
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
  grab: GRAB,
});

const toScroll = (hud: Hud): number | undefined =>
  match(findHudWidget(hud, 'deck', 'tracks'))
    .with({ kind: 'LIST' }, (list) => list.scroll)
    .otherwise(constant(undefined));

describe('toThumbScrolled', () => {
  it('should show the first item when the thumb is dragged to the top of its track', () => {
    expect(
      toScroll(
        toThumbScrolled(createDeckHud(), GRAB, LIST, LAYOUT.track.row).hud,
      ),
    ).toBe(0);
  });

  it('should show the last page when the thumb is dragged to the bottom of its track', () => {
    expect(
      toScroll(
        toThumbScrolled(
          createDeckHud(),
          GRAB,
          LIST,
          LAYOUT.track.row + LAYOUT.track.height,
        ).hud,
      ),
    ).toBe(2);
  });

  it('should stop at the first item when the thumb is dragged above its track', () => {
    expect(
      toScroll(toThumbScrolled(createDeckHud(), GRAB, LIST, -40).hud),
    ).toBe(0);
  });

  it('should return no actions when it scrolls a list by its thumb', () => {
    expect(
      toThumbScrolled(createDeckHud(), GRAB, LIST, LAYOUT.track.row).actions,
    ).toEqual([]);
  });

  it('should not change the old HUD when it scrolls a list by its thumb', () => {
    const hud = createDeckHud();

    toThumbScrolled(hud, GRAB, LIST, LAYOUT.track.row);

    expect(hud).toEqual(createDeckHud());
  });
});
