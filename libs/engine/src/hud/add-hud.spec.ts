import { map } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { createOverlay } from '../overlay/create-overlay';
import { toPixel } from '../palette/to-pixel';
import { createScreen } from '../screen/create-screen';
import { addHud } from './add-hud';
import { addHudWindow } from './add-hud-window';
import { HUD_OVERLAY_PREFIX } from './consts';
import { createHud } from './create-hud';
import { drawHud } from './draw-hud';
import type { Hud } from './types/hud';

const BADGE_PIXEL = toPixel(3, 5);

const AMBIENT_SHIFT = -16;

const createStreetHud = (): Hud =>
  addHudWindow(createHud(), {
    id: 'street',
    title: 'STREET',
    row: 10,
    column: 20,
    width: 90,
    height: 40,
  });

describe('addHud', () => {
  it('should return the windows of the HUD as overlays when it adds them to the screen', () => {
    expect(
      addHud(createScreen(toPixel(8, 5)), createStreetHud()).overlays,
    ).toEqual(drawHud(createStreetHud()));
  });

  it('should return the overlays that were already there below the windows when it adds the HUD', () => {
    expect(
      map(
        addHud(
          {
            ...createScreen(),
            overlays: [
              {
                id: 'badge',
                overlay: createOverlay(1, 1, BADGE_PIXEL),
                row: 0,
                column: 0,
              },
            ],
          },
          createStreetHud(),
        ).overlays,
        (placement) => placement.id,
      ),
    ).toEqual(['badge', `${HUD_OVERLAY_PREFIX}-street`]);
  });

  it('should return the same background, sprites, and lights when it adds the HUD', () => {
    const screen = createScreen(toPixel(8, 5), AMBIENT_SHIFT);

    expect(addHud(screen, createStreetHud())).toMatchObject({
      background: toPixel(8, 5),
      ambient: AMBIENT_SHIFT,
      sprites: [],
      lights: [],
    });
  });

  it('should not change the screen it is given when it adds the HUD', () => {
    const screen = createScreen();

    addHud(screen, createStreetHud());

    expect(screen.overlays).toEqual([]);
  });
});
