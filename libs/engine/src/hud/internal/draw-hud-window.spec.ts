import { size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { drawOverlay } from '../../overlay/draw-overlay';
import { TRANSPARENT } from '../../palette/consts';
import { toPixel } from '../../palette/to-pixel';
import { addHudWindow } from '../add-hud-window';
import {
  DEFAULT_HUD_COLOR,
  HUD_CONTENT_LEFT,
  HUD_CONTENT_TOP,
  HUD_OVERLAY_PREFIX,
} from '../consts';
import { createHud } from '../create-hud';
import type { Hud } from '../types/hud';
import type { HudItemWidget } from '../types/hud-item-widget';
import type { HudList } from '../types/hud-list';
import type { HudListItem } from '../types/hud-list-item';
import type { HudWidget } from '../types/hud-widget';
import type { HudWindow } from '../types/hud-window';
import { computeListLayout } from './compute-list-layout';
import { drawHudWindow } from './draw-hud-window';
import { drawHudWindowFrame } from './draw-hud-window-frame';

const STREET_WIDTH = 90;

const STREET_HEIGHT = 40;

const TAPE_HEIGHT = 48;

const WIDGETS: readonly HudWidget[] = Object.freeze([
  { kind: 'LABEL', id: 'scene', page: 'scene', row: 0, column: 0, text: 'DAY' },
  {
    kind: 'LABEL',
    id: 'light',
    page: 'light',
    row: 0,
    column: 0,
    text: 'NIGHT',
  },
]);

const PLAY: HudItemWidget = Object.freeze({
  kind: 'BUTTON',
  id: 'play',
  page: '',
  row: 3,
  column: 40,
  width: 20,
  text: 'PLAY',
});

const ITEM: HudListItem = Object.freeze({
  id: 'a',
  lines: ['SIDE A'],
  height: 18,
  widgets: [PLAY],
  selectable: true,
});

const TRACKS: HudList = Object.freeze({
  kind: 'LIST',
  id: 'tracks',
  page: '',
  row: 0,
  column: 0,
  width: 80,
  height: 26,
  items: [ITEM],
  scroll: 0,
  selected: '',
});

const createTapeHud = (widgets: readonly HudWidget[]): Hud =>
  addHudWindow(createHud(), {
    id: 'tape',
    title: 'TAPE',
    row: 0,
    column: 0,
    width: STREET_WIDTH,
    height: TAPE_HEIGHT,
    widgets,
  });

const createStreetHud = (): Hud =>
  addHudWindow(createHud(), {
    id: 'street',
    title: 'STREET',
    row: 10,
    column: 20,
    width: STREET_WIDTH,
    height: STREET_HEIGHT,
    page: 'scene',
    widgets: WIDGETS,
  });

const toWindow = (hud: Hud): HudWindow =>
  hud.windows[0] ?? {
    id: '',
    title: '',
    row: 0,
    column: 0,
    width: 0,
    height: 0,
    color: 0,
    closable: false,
    page: '',
    widgets: [],
  };

describe('drawHudWindow', () => {
  it('should return an overlay named after the window when it draws one', () => {
    const hud = createStreetHud();

    expect(drawHudWindow(hud, toWindow(hud)).id).toBe(
      `${HUD_OVERLAY_PREFIX}-street`,
    );
  });

  it('should return the overlay where the window sits when it draws one', () => {
    const hud = createStreetHud();

    expect(drawHudWindow(hud, toWindow(hud))).toMatchObject({
      row: 10,
      column: 20,
    });
  });

  it('should return an overlay of the size of the window when it draws one', () => {
    const hud = createStreetHud();

    const { overlay } = drawHudWindow(hud, toWindow(hud));

    expect([overlay.width, overlay.height, size(overlay.pixels)]).toEqual([
      STREET_WIDTH,
      STREET_HEIGHT,
      STREET_WIDTH * STREET_HEIGHT,
    ]);
  });

  it('should return no transparent pixel when it draws a window, so the scene below never shows through', () => {
    const hud = createStreetHud();

    expect(drawHudWindow(hud, toWindow(hud)).overlay.pixels).not.toContain(
      TRANSPARENT,
    );
  });

  it('should return the dark edge in the corner when it draws a window', () => {
    const hud = createStreetHud();

    expect(drawHudWindow(hud, toWindow(hud)).overlay.pixels[0]).toBe(
      toPixel(DEFAULT_HUD_COLOR, hud.theme.edge),
    );
  });

  it('should return a widget of a list item where the item puts it when the list shows that item', () => {
    const rect = computeListLayout(TRACKS).items[0]?.rect;
    const placed: HudWidget = {
      ...PLAY,
      row: (rect?.row ?? 0) - HUD_CONTENT_TOP + PLAY.row,
      column: (rect?.column ?? 0) - HUD_CONTENT_LEFT + PLAY.column,
    };
    const onItem = createTapeHud([TRACKS]);
    const onWindow = createTapeHud([
      { ...TRACKS, items: [{ ...ITEM, widgets: [] }] },
      placed,
    ]);

    expect(drawHudWindow(onItem, toWindow(onItem)).overlay.pixels).toEqual(
      drawHudWindow(onWindow, toWindow(onWindow)).overlay.pixels,
    );
  });

  it('should return nothing of a widget on an item when the list does not show it', () => {
    const withButton = createTapeHud([
      { ...TRACKS, items: [ITEM, { ...ITEM, id: 'b' }] },
    ]);
    const without = createTapeHud([
      { ...TRACKS, items: [ITEM, { ...ITEM, id: 'b', widgets: [] }] },
    ]);

    expect(
      drawHudWindow(withButton, toWindow(withButton)).overlay.pixels,
    ).toEqual(drawHudWindow(without, toWindow(without)).overlay.pixels);
  });

  it('should return only the widgets of the open page when it draws a window', () => {
    const hud = createStreetHud();

    const scene = drawHudWindow(hud, toWindow(hud)).overlay.pixels;
    const light = drawHudWindow(hud, {
      ...toWindow(hud),
      page: 'light',
    }).overlay.pixels;

    expect(scene).not.toEqual(light);
  });

  it('should return the frame of the window alone when it holds no widgets', () => {
    const hud = createTapeHud([]);
    const bare = toWindow(hud);

    expect(drawHudWindow(hud, bare).overlay.pixels).toEqual(
      drawOverlay(bare.width, bare.height, drawHudWindowFrame(hud, bare))
        .pixels,
    );
  });
});
