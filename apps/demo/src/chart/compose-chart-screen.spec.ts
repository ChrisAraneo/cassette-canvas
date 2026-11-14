import { TRANSPARENT } from '@cassette-canvas/engine';
import { filter, size, startsWith } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { CLOCK_FONT, FPS_FONT } from '../art/font/consts';
import { DAY_LENGTH, HOURS_PER_DAY } from '../day/consts';
import { CLOCK_LENGTH, FPS_DIGITS } from '../format/consts';
import { placeText } from '../tiles/place-text';
import { composeChartScreen } from './compose-chart-screen';
import { LEFT_PANEL, RIGHT_PANEL, VALUE_ROW } from './consts';
import { createChartScenery } from './create-chart-scenery';
import { centerText } from './internal/center-text';

const SCENERY = Object.freeze(createChartScenery());

describe('composeChartScreen', () => {
  it('should return a clear background when it composes the chart', () => {
    expect(composeChartScreen(SCENERY, 60, 0).background).toBe(TRANSPARENT);
  });

  it('should return no ambient light and no lights when it composes the chart', () => {
    const screen = composeChartScreen(SCENERY, 60, 0);

    expect([screen.ambient, screen.lights]).toEqual([0, []]);
  });

  it('should return the scenery as the first sprites when it composes the chart', () => {
    expect(composeChartScreen(SCENERY, 60, 0).sprites[0]).toBe(SCENERY[0]);
  });

  it('should return the frame rate sprites on the left when it is measured', () => {
    expect(composeChartScreen(SCENERY, 59.8, 0).sprites).toEqual(
      expect.arrayContaining(
        placeText(' 60', FPS_FONT, {
          id: 'fps',
          row: VALUE_ROW,
          column: centerText(FPS_DIGITS, LEFT_PANEL),
        }),
      ),
    );
  });

  it('should return the street time sprites on the right when time passes', () => {
    expect(
      composeChartScreen(SCENERY, 60, (3 * DAY_LENGTH) / HOURS_PER_DAY).sprites,
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

  it('should return a glyph for each digit of the frame rate when it is measured', () => {
    expect(
      size(
        filter(composeChartScreen(SCENERY, 144, 0).sprites, ({ id }) =>
          startsWith(id, 'fps-'),
        ),
      ) - size(filter(SCENERY, ({ id }) => startsWith(id, 'fps-'))),
    ).toBe(3);
  });
});
