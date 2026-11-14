import { map, times } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { addHudWindow } from '../add-hud-window';
import { createHud } from '../create-hud';
import { findHudWidget } from '../find-hud-widget';
import { findHudWindow } from '../find-hud-window';
import type { Hud } from '../types/hud';
import type { HudList } from '../types/hud-list';
import type { HudListItem } from '../types/hud-list-item';
import { computeListLayout } from './compute-list-layout';
import { moveHud } from './move-hud';

const createStreetHud = (hud: Hud = createHud()): Hud =>
  addHudWindow(hud, {
    id: 'street',
    title: 'STREET',
    row: 10,
    column: 20,
    width: 90,
    height: 76,
  });

const createDraggingHud = (hud: Hud = createHud()): Hud => ({
  ...createStreetHud(hud),
  grab: { kind: 'drag', window: 'street', widget: '', row: 6, column: 10 },
});

const toItems = (count: number): readonly HudListItem[] =>
  map(times(count), (index) => ({
    id: `${index}`,
    lines: [`TRACK ${index}`],
    height: 0,
    widgets: [],
    selectable: true,
  }));

/** A list 48 rows tall, which shows four of its six items at once. */
const TRACKS: HudList = Object.freeze({
  kind: 'list',
  id: 'tracks',
  page: '',
  row: 0,
  column: 0,
  width: 80,
  height: 48,
  items: toItems(6),
  scroll: 0,
  selected: '',
});

/** The window with that list in it, while the pointer holds the thumb. */
const createScrollingHud = (): Hud => ({
  ...addHudWindow(createHud(), {
    id: 'tape',
    title: 'TAPE',
    row: 10,
    column: 20,
    width: 90,
    height: 80,
    widgets: [TRACKS],
  }),
  grab: { kind: 'scroll', window: 'tape', widget: 'tracks', row: 0, column: 0 },
});

/** The same window on a screen 160 by 90 pixels. */
const createScreenHud = (): Hud =>
  createDraggingHud(createHud(undefined, { width: 160, height: 90 }));

describe('moveHud', () => {
  it('should return the window moved when the pointer drags it, so the grabbed spot stays under the pointer', () => {
    expect(
      findHudWindow(moveHud(createDraggingHud(), 40, 60).hud, 'street'),
    ).toMatchObject({ row: 34, column: 50 });
  });

  it('should return the window beyond the edge when the HUD is on no screen of a known size', () => {
    expect(
      findHudWindow(moveHud(createDraggingHud(), 0, 0).hud, 'street'),
    ).toMatchObject({ row: -6, column: -10 });
  });

  it('should return the window stopped at the top left when the pointer drags it off that corner', () => {
    expect(
      findHudWindow(moveHud(createScreenHud(), 0, 0).hud, 'street'),
    ).toMatchObject({ row: 0, column: 0 });
  });

  it('should return the window stopped at the bottom right when the pointer drags it off that corner', () => {
    expect(
      findHudWindow(moveHud(createScreenHud(), 200, 400).hud, 'street'),
    ).toMatchObject({ row: 90 - 76, column: 160 - 90 });
  });

  it('should return the window moved as asked when the screen has room for it', () => {
    expect(
      findHudWindow(moveHud(createScreenHud(), 16, 60).hud, 'street'),
    ).toMatchObject({ row: 10, column: 50 });
  });

  it('should return no actions when it drags a window', () => {
    expect(moveHud(createDraggingHud(), 40, 60).actions).toEqual([]);
  });

  it('should return the list scrolled on when the pointer drags its thumb down the track', () => {
    const track = computeListLayout(TRACKS).track;

    expect(
      findHudWidget(
        moveHud(createScrollingHud(), 10 + track.row + 4, 0).hud,
        'tape',
        'tracks',
      ),
    ).toMatchObject({ scroll: 1 });
  });

  it('should return the list on its last page when the pointer drags its thumb past the track', () => {
    expect(
      findHudWidget(
        moveHud(createScrollingHud(), 400, 0).hud,
        'tape',
        'tracks',
      ),
    ).toMatchObject({ scroll: 2 });
  });

  it('should return no actions when it scrolls a list', () => {
    expect(moveHud(createScrollingHud(), 400, 0).actions).toEqual([]);
  });

  it('should return the window where it was when the pointer holds a button', () => {
    expect(
      moveHud(
        {
          ...createStreetHud(),
          grab: {
            kind: 'press',
            window: 'street',
            widget: 'skip',
            row: 0,
            column: 0,
          },
        },
        40,
        60,
      ).hud,
    ).toMatchObject({ windows: createStreetHud().windows });
  });

  it('should return the very same HUD when the pointer holds nothing', () => {
    const hud = createStreetHud();

    expect(moveHud(hud, 40, 60).hud).toBe(hud);
  });
});
