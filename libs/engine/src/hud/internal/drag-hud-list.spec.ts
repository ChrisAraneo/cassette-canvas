import { map, times } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { addHudWindow } from '../add-hud-window';
import { createHud } from '../create-hud';
import { findHudWidget } from '../find-hud-widget';
import type { Hud } from '../types/hud';
import type { HudGrab } from '../types/hud-grab';
import type { HudList } from '../types/hud-list';
import type { HudListItem } from '../types/hud-list-item';
import { computeListLayout } from './compute-list-layout';
import { dragHudList } from './drag-hud-list';

const toItems = (count: number): readonly HudListItem[] =>
  map(times(count), (index) => ({
    id: `${index}`,
    lines: [`TRACK ${index}`],
    height: 0,
    widgets: [],
    selectable: true,
  }));

/** A list 48 rows tall, which shows four of its six items at once. */
const LIST: HudList = Object.freeze({
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

const LAYOUT = computeListLayout(LIST);

/** How far the thumb runs: the track without the thumb itself. */
const THUMB_ROOM = LAYOUT.track.height - LAYOUT.thumb.height;

/** The window the list sits in, ten rows down the screen. */
const WINDOW_ROW = 10;

/** Where inside the thumb the pointer took hold of it. */
const GRAB_ROW = 4;

const GRAB: HudGrab = Object.freeze({
  kind: 'scroll',
  window: 'tape',
  widget: 'tracks',
  row: GRAB_ROW,
  column: 2,
});

const createTapeHud = (widget: HudList = LIST): Hud => ({
  ...addHudWindow(createHud(), {
    id: 'tape',
    title: 'TAPE',
    row: WINDOW_ROW,
    column: 20,
    width: 90,
    height: 80,
    widgets: [widget],
  }),
  grab: GRAB,
});

/** The pointer row that puts the top of the thumb at `top` in the window. */
const toPointerRow = (top: number): number => WINDOW_ROW + top + GRAB_ROW;

const dragTo = (top: number, widget: HudList = LIST) =>
  dragHudList(createTapeHud(widget), GRAB, toPointerRow(top));

describe('dragHudList', () => {
  it('should return the list scrolled to the last page when the thumb is dragged to the end of the track', () => {
    expect(
      findHudWidget(
        dragTo(LAYOUT.track.row + THUMB_ROOM).hud,
        'tape',
        'tracks',
      ),
    ).toMatchObject({ scroll: 2 });
  });

  it('should return the list scrolled half way when the thumb is dragged half way down the track', () => {
    expect(
      findHudWidget(
        dragTo(LAYOUT.track.row + THUMB_ROOM / 2).hud,
        'tape',
        'tracks',
      ),
    ).toMatchObject({ scroll: 1 });
  });

  it('should return the first item when the thumb is dragged back to the top of the track', () => {
    expect(
      findHudWidget(
        dragTo(LAYOUT.track.row, { ...LIST, scroll: 2 }).hud,
        'tape',
        'tracks',
      ),
    ).toMatchObject({ scroll: 0 });
  });

  it('should return the last page when the thumb is dragged past the end of the track', () => {
    expect(
      findHudWidget(dragTo(LAYOUT.track.row + 400).hud, 'tape', 'tracks'),
    ).toMatchObject({ scroll: 2 });
  });

  it('should return the first item when the thumb is dragged above the track', () => {
    expect(
      findHudWidget(
        dragTo(LAYOUT.track.row - 400, { ...LIST, scroll: 2 }).hud,
        'tape',
        'tracks',
      ),
    ).toMatchObject({ scroll: 0 });
  });

  it('should keep the grab when the thumb is dragged, so the next move drags it on', () => {
    expect(dragTo(LAYOUT.track.row + THUMB_ROOM).hud.grab).toEqual(GRAB);
  });

  it('should return no actions when the thumb is dragged', () => {
    expect(dragTo(LAYOUT.track.row + THUMB_ROOM).actions).toEqual([]);
  });

  it('should return the very same HUD when the grab names a window that is gone', () => {
    const hud = createTapeHud();

    expect(
      dragHudList(hud, { ...GRAB, window: 'deck' }, toPointerRow(0)).hud,
    ).toBe(hud);
  });

  it('should return the very same HUD when the grab names a widget that is not a list', () => {
    const hud = createTapeHud();

    expect(
      dragHudList(hud, { ...GRAB, widget: 'rewind' }, toPointerRow(0)).hud,
    ).toBe(hud);
  });
});
