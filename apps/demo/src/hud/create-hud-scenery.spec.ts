import { COLOR_COUNT, SHADE_COUNT } from '@cassette-canvas/engine';
import { every, filter, size, startsWith } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { LABEL_FONT } from '../art/font/consts';
import { placeText } from '../tiles/place-text';
import { FPS_LABEL, LABEL_ROW, LEFT_PANEL } from './consts';
import { createHudScenery } from './create-hud-scenery';
import { centerText } from './internal/center-text';

describe('createHudScenery', () => {
  it('should show a swatch for every shade of every color when it builds the HUD', () => {
    expect(
      size(filter(createHudScenery(), ({ id }) => startsWith(id, 'swatch-'))),
    ).toBe(COLOR_COUNT * SHADE_COUNT);
  });

  it('should label the frame rate on the left when it builds the HUD', () => {
    expect(createHudScenery()).toEqual(
      expect.arrayContaining(
        placeText(FPS_LABEL, LABEL_FONT, {
          id: 'fps-label',
          row: LABEL_ROW,
          column: centerText(size(FPS_LABEL), LEFT_PANEL),
        }),
      ),
    );
  });

  it('should label the clock when it builds the HUD', () => {
    expect(
      size(
        filter(createHudScenery(), ({ id }) => startsWith(id, 'time-label-')),
      ),
    ).toBeGreaterThan(0);
  });

  it('should let the light through everything when it builds the HUD', () => {
    expect(every(createHudScenery(), { castsShadow: false })).toBe(true);
  });
});
