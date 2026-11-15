import { map, times } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { addHudWindow } from '../add-hud-window';
import { createHud } from '../create-hud';
import { findHudWidget } from '../find-hud-widget';
import type { Hud } from '../types/hud';
import type { HudChange } from '../types/hud-change';
import type { HudGrab } from '../types/hud-grab';
import type { HudList } from '../types/hud-list';
import type { HudListItem } from '../types/hud-list-item';
import { computeListLayout } from './compute-list-layout';
import { patchListScroll } from './patch-list-scroll';

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

const THUMB_ROOM = LAYOUT.track.height - LAYOUT.thumb.height;

const WINDOW_ROW = 10;

const GRAB_ROW = 4;

const GRAB: HudGrab = Object.freeze({
  kind: 'SCROLL',
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

const toPointerRow = (top: number): number => WINDOW_ROW + top + GRAB_ROW;

const patchScrollTo = (top: number, widget: HudList = LIST): HudChange =>
  patchListScroll(createTapeHud(widget), GRAB, toPointerRow(top));

describe('patchListScroll', () => {
  it('should return the list scrolled to the last page when the thumb is dragged to the end of the track', () => {
    expect(
      findHudWidget(
        patchScrollTo(LAYOUT.track.row + THUMB_ROOM).hud,
        'tape',
        'tracks',
      ),
    ).toMatchObject({ scroll: 2 });
  });

  it('should return the list scrolled half way when the thumb is dragged half way down the track', () => {
    expect(
      findHudWidget(
        patchScrollTo(LAYOUT.track.row + THUMB_ROOM / 2).hud,
        'tape',
        'tracks',
      ),
    ).toMatchObject({ scroll: 1 });
  });

  it('should return the first item when the thumb is dragged back to the top of the track', () => {
    expect(
      findHudWidget(
        patchScrollTo(LAYOUT.track.row, { ...LIST, scroll: 2 }).hud,
        'tape',
        'tracks',
      ),
    ).toMatchObject({ scroll: 0 });
  });

  it('should return the last page when the thumb is dragged past the end of the track', () => {
    expect(
      findHudWidget(
        patchScrollTo(LAYOUT.track.row + 400).hud,
        'tape',
        'tracks',
      ),
    ).toMatchObject({ scroll: 2 });
  });

  it('should return the first item when the thumb is dragged above the track', () => {
    expect(
      findHudWidget(
        patchScrollTo(LAYOUT.track.row - 400, { ...LIST, scroll: 2 }).hud,
        'tape',
        'tracks',
      ),
    ).toMatchObject({ scroll: 0 });
  });

  it('should keep the grab when the thumb is dragged, so the next move drags it on', () => {
    expect(patchScrollTo(LAYOUT.track.row + THUMB_ROOM).hud.grab).toEqual(GRAB);
  });

  it('should return no actions when the thumb is dragged', () => {
    expect(patchScrollTo(LAYOUT.track.row + THUMB_ROOM).actions).toEqual([]);
  });

  it('should return the very same HUD when the grab names a window that is gone', () => {
    const hud = createTapeHud();

    expect(
      patchListScroll(hud, { ...GRAB, window: 'deck' }, toPointerRow(0)).hud,
    ).toBe(hud);
  });

  it('should return the very same HUD when the grab names a widget that is not a list', () => {
    const hud = createTapeHud();

    expect(
      patchListScroll(hud, { ...GRAB, widget: 'rewind' }, toPointerRow(0)).hud,
    ).toBe(hud);
  });
});
