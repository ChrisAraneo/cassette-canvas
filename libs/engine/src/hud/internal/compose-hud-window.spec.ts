import { size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { toPixel } from '../../palette/to-pixel';
import { addHudWindow } from '../add-hud-window';
import { createHud } from '../create-hud';
import {
  HUD_CONTENT_LEFT,
  HUD_CONTENT_TOP,
  HUD_OVERLAY_PREFIX,
} from '../consts';
import type { Hud } from '../types/hud';
import type { HudItemWidget } from '../types/hud-item-widget';
import type { HudList } from '../types/hud-list';
import type { HudListItem } from '../types/hud-list-item';
import type { HudWidget } from '../types/hud-widget';
import type { HudWindow } from '../types/hud-window';
import { composeHudWindow } from './compose-hud-window';
import { computeListLayout } from './compute-list-layout';

const WIDGETS: readonly HudWidget[] = Object.freeze([
  { kind: 'label', id: 'scene', page: 'scene', row: 0, column: 0, text: 'DAY' },
  {
    kind: 'label',
    id: 'light',
    page: 'light',
    row: 0,
    column: 0,
    text: 'NIGHT',
  },
]);

/** A play button three rows down the item it sits on and 40 across it. */
const PLAY: HudItemWidget = Object.freeze({
  kind: 'button',
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
  kind: 'list',
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
    width: 90,
    height: 48,
    widgets,
  });

const createStreetHud = (): Hud =>
  addHudWindow(createHud(), {
    id: 'street',
    title: 'STREET',
    row: 10,
    column: 20,
    width: 90,
    height: 40,
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

describe('composeHudWindow', () => {
  it('should return an overlay named after the window when it composes one', () => {
    const hud = createStreetHud();

    expect(composeHudWindow(hud, toWindow(hud)).id).toBe(
      `${HUD_OVERLAY_PREFIX}-street`,
    );
  });

  it('should return the overlay where the window sits when it composes one', () => {
    const hud = createStreetHud();

    expect(composeHudWindow(hud, toWindow(hud))).toMatchObject({
      row: 10,
      column: 20,
    });
  });

  it('should return an overlay of the size of the window when it composes one', () => {
    const hud = createStreetHud();
    const { overlay } = composeHudWindow(hud, toWindow(hud));

    expect([overlay.width, overlay.height, size(overlay.pixels)]).toEqual([
      90, 40, 3600,
    ]);
  });

  it('should return no transparent pixel when it composes a window, so the scene below never shows through', () => {
    const hud = createStreetHud();

    expect(composeHudWindow(hud, toWindow(hud)).overlay.pixels).not.toContain(
      -1,
    );
  });

  it('should return the dark edge in the corner when it composes a window', () => {
    const hud = createStreetHud();

    expect(composeHudWindow(hud, toWindow(hud)).overlay.pixels[0]).toBe(
      toPixel(15, hud.theme.edge),
    );
  });

  it('should paint a widget of a list item where the item puts it in the window', () => {
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

    expect(composeHudWindow(onItem, toWindow(onItem)).overlay.pixels).toEqual(
      composeHudWindow(onWindow, toWindow(onWindow)).overlay.pixels,
    );
  });

  it('should paint nothing of a widget on an item the list does not show', () => {
    const withButton = createTapeHud([
      { ...TRACKS, items: [ITEM, { ...ITEM, id: 'b' }] },
    ]);
    const without = createTapeHud([
      { ...TRACKS, items: [ITEM, { ...ITEM, id: 'b', widgets: [] }] },
    ]);

    expect(
      composeHudWindow(withButton, toWindow(withButton)).overlay.pixels,
    ).toEqual(composeHudWindow(without, toWindow(without)).overlay.pixels);
  });

  it('should return only the widgets of the open page when it composes a window', () => {
    const hud = createStreetHud();
    const scene = composeHudWindow(hud, toWindow(hud)).overlay.pixels;
    const light = composeHudWindow(hud, {
      ...toWindow(hud),
      page: 'light',
    }).overlay.pixels;

    expect(scene).not.toEqual(light);
  });
});
