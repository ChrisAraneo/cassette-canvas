import { TRANSPARENT } from '@cassette-canvas/engine';
import { filter, size, startsWith } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { CLOCK_FONT, FPS_FONT } from '../art/font/consts';
import { DAY_LENGTH, HOURS_PER_DAY } from '../day/consts';
import { placeText } from '../tiles/place-text';
import { composeHudScreen } from './compose-hud-screen';
import {
  CLOCK_LENGTH,
  FPS_DIGITS,
  LEFT_PANEL,
  RIGHT_PANEL,
  VALUE_ROW,
} from './consts';
import { createHudScenery } from './create-hud-scenery';
import { centerText } from './internal/center-text';

const SCENERY = Object.freeze(createHudScenery());

describe('composeHudScreen', () => {
  it('should keep the background clear when it composes the HUD', () => {
    expect(composeHudScreen(SCENERY, 60, 0).background).toBe(TRANSPARENT);
  });

  it('should show the exact colors when it composes the HUD', () => {
    const screen = composeHudScreen(SCENERY, 60, 0);

    expect([screen.ambient, screen.lights]).toEqual([0, []]);
  });

  it('should draw the scenery first when it composes the HUD', () => {
    expect(composeHudScreen(SCENERY, 60, 0).sprites[0]).toBe(SCENERY[0]);
  });

  it('should show the frame rate on the left when it is measured', () => {
    expect(composeHudScreen(SCENERY, 59.8, 0).sprites).toEqual(
      expect.arrayContaining(
        placeText(' 60', FPS_FONT, {
          id: 'fps',
          row: VALUE_ROW,
          column: centerText(FPS_DIGITS, LEFT_PANEL),
        }),
      ),
    );
  });

  it('should show the time on the street on the right when time passes', () => {
    expect(
      composeHudScreen(SCENERY, 60, (3 * DAY_LENGTH) / HOURS_PER_DAY).sprites,
    ).toEqual(
      expect.arrayContaining(
        placeText('12:00', CLOCK_FONT, {
          id: 'clock',
          row: VALUE_ROW,
          column: centerText(CLOCK_LENGTH, RIGHT_PANEL),
        }),
      ),
    );
  });

  it('should draw a glyph for each digit of the frame rate when it is measured', () => {
    expect(
      size(
        filter(composeHudScreen(SCENERY, 144, 0).sprites, ({ id }) =>
          startsWith(id, 'fps-'),
        ),
      ) - size(filter(SCENERY, ({ id }) => startsWith(id, 'fps-'))),
    ).toBe(3);
  });
});
