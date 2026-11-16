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
import { handleHudMove } from './handle-hud-move';

const WINDOW_ROW = 10;

const WINDOW_COLUMN = 20;

const WINDOW_WIDTH = 90;

const WINDOW_HEIGHT = 76;

const SCREEN_WIDTH = 160;

const SCREEN_HEIGHT = 90;

const THUMB_DRAG = 4;

const createStreetHud = (hud: Hud = createHud()): Hud =>
  addHudWindow(hud, {
    id: 'street',
    title: 'STREET',
    row: WINDOW_ROW,
    column: WINDOW_COLUMN,
    width: WINDOW_WIDTH,
    height: WINDOW_HEIGHT,
  });

const createDraggingHud = (hud: Hud = createHud()): Hud => ({
  ...createStreetHud(hud),
  grab: { kind: 'DRAG', window: 'street', widget: '', row: 6, column: 10 },
});

const createItems = (count: number): readonly HudListItem[] =>
  map(times(count), (index) => ({
    id: `${index}`,
    lines: [`TRACK ${index}`],
    height: 0,
    widgets: [],
    selectable: true,
  }));

const TRACKS: HudList = Object.freeze({
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

const createScrollingHud = (): Hud => ({
  ...addHudWindow(createHud(), {
    id: 'tape',
    title: 'TAPE',
    row: WINDOW_ROW,
    column: WINDOW_COLUMN,
    width: 90,
    height: 80,
    widgets: [TRACKS],
  }),
  grab: { kind: 'SCROLL', window: 'tape', widget: 'tracks', row: 0, column: 0 },
});

const createScreenHud = (): Hud =>
  createDraggingHud(
    createHud(undefined, { width: SCREEN_WIDTH, height: SCREEN_HEIGHT }),
  );

describe('handleHudMove', () => {
  it('should return the window moved when the pointer drags it, so the grabbed spot stays under the pointer', () => {
    expect(
      findHudWindow(handleHudMove(createDraggingHud(), 40, 60).hud, 'street'),
    ).toMatchObject({ row: 34, column: 50 });
  });

  it('should return the window beyond the edge when the HUD is on no screen of a known size', () => {
    expect(
      findHudWindow(handleHudMove(createDraggingHud(), 0, 0).hud, 'street'),
    ).toMatchObject({ row: -6, column: -10 });
  });

  it('should return the window stopped at the top left when the pointer drags it off that corner', () => {
    expect(
      findHudWindow(handleHudMove(createScreenHud(), 0, 0).hud, 'street'),
    ).toMatchObject({ row: 0, column: 0 });
  });

  it('should return the window stopped at the bottom right when the pointer drags it off that corner', () => {
    expect(
      findHudWindow(handleHudMove(createScreenHud(), 200, 400).hud, 'street'),
    ).toMatchObject({
      row: SCREEN_HEIGHT - WINDOW_HEIGHT,
      column: SCREEN_WIDTH - WINDOW_WIDTH,
    });
  });

  it('should return the window moved as asked when the screen has room for it', () => {
    expect(
      findHudWindow(handleHudMove(createScreenHud(), 16, 60).hud, 'street'),
    ).toMatchObject({ row: 10, column: 50 });
  });

  it('should return no actions when it drags a window', () => {
    expect(handleHudMove(createDraggingHud(), 40, 60).actions).toEqual([]);
  });

  it('should return the list scrolled on when the pointer drags its thumb down the track', () => {
    const track = computeListLayout(TRACKS).track;

    expect(
      findHudWidget(
        handleHudMove(
          createScrollingHud(),
          WINDOW_ROW + track.row + THUMB_DRAG,
          0,
        ).hud,
        'tape',
        'tracks',
      ),
    ).toMatchObject({ scroll: 1 });
  });

  it('should return the list on its last page when the pointer drags its thumb past the track', () => {
    expect(
      findHudWidget(
        handleHudMove(createScrollingHud(), 400, 0).hud,
        'tape',
        'tracks',
      ),
    ).toMatchObject({ scroll: 2 });
  });

  it('should return no actions when it scrolls a list', () => {
    expect(handleHudMove(createScrollingHud(), 400, 0).actions).toEqual([]);
  });

  it('should return the window where it was when the pointer holds a button', () => {
    expect(
      handleHudMove(
        {
          ...createStreetHud(),
          grab: {
            kind: 'PRESS',
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

  it('should return the window where it was when the pointer holds a close box', () => {
    expect(
      handleHudMove(
        {
          ...createStreetHud(),
          grab: {
            kind: 'CLOSE',
            window: 'street',
            widget: '',
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

    expect(handleHudMove(hud, 40, 60).hud).toBe(hud);
  });
});
