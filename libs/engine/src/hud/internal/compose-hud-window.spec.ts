import { size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { toPixel } from '../../palette/to-pixel';
import { addHudWindow } from '../add-hud-window';
import { createHud } from '../create-hud';
import { HUD_OVERLAY_PREFIX } from '../consts';
import type { Hud } from '../types/hud';
import type { HudWidget } from '../types/hud-widget';
import type { HudWindow } from '../types/hud-window';
import { composeHudWindow } from './compose-hud-window';

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
  it('should name the overlay after the window', () => {
    const hud = createStreetHud();

    expect(composeHudWindow(hud, toWindow(hud)).id).toBe(
      `${HUD_OVERLAY_PREFIX}-street`,
    );
  });

  it('should put the overlay where the window sits', () => {
    const hud = createStreetHud();

    expect(composeHudWindow(hud, toWindow(hud))).toMatchObject({
      row: 10,
      column: 20,
    });
  });

  it('should draw an overlay of the size of the window', () => {
    const hud = createStreetHud();
    const { overlay } = composeHudWindow(hud, toWindow(hud));

    expect([overlay.width, overlay.height, size(overlay.pixels)]).toEqual([
      90, 40, 3600,
    ]);
  });

  it('should fill every place, so the scene below never shows through', () => {
    const hud = createStreetHud();

    expect(composeHudWindow(hud, toWindow(hud)).overlay.pixels).not.toContain(
      -1,
    );
  });

  it('should draw the dark edge in the corner', () => {
    const hud = createStreetHud();

    expect(composeHudWindow(hud, toWindow(hud)).overlay.pixels[0]).toBe(
      toPixel(15, hud.theme.edge),
    );
  });

  it('should draw only the widgets of the open page', () => {
    const hud = createStreetHud();
    const scene = composeHudWindow(hud, toWindow(hud)).overlay.pixels;
    const light = composeHudWindow(hud, {
      ...toWindow(hud),
      page: 'light',
    }).overlay.pixels;

    expect(scene).not.toEqual(light);
  });
});
