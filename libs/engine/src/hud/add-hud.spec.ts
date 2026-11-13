import { map } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { createOverlay } from '../overlay/create-overlay';
import { createScreen } from '../screen/create-screen';
import { toPixel } from '../palette/to-pixel';
import { addHud } from './add-hud';
import { addHudWindow } from './add-hud-window';
import { composeHud } from './compose-hud';
import { HUD_OVERLAY_PREFIX } from './consts';
import { createHud } from './create-hud';
import type { Hud } from './types/hud';

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
  it('should put the windows of the HUD on the screen as overlays', () => {
    expect(
      addHud(createScreen(toPixel(8, 5)), createStreetHud()).overlays,
    ).toEqual(composeHud(createStreetHud()));
  });

  it('should leave the overlays that were already there below', () => {
    expect(
      map(
        addHud(
          {
            ...createScreen(),
            overlays: [
              {
                id: 'badge',
                overlay: createOverlay(1, 1, 0x35),
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

  it('should keep the background, the sprites and the lights', () => {
    const screen = createScreen(toPixel(8, 5), -16);

    expect(addHud(screen, createStreetHud())).toMatchObject({
      background: toPixel(8, 5),
      ambient: -16,
      sprites: [],
      lights: [],
    });
  });

  it('should not change the screen it is given', () => {
    const screen = createScreen();

    addHud(screen, createStreetHud());

    expect(screen.overlays).toEqual([]);
  });
});
