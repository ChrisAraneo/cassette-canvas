import { TRANSPARENT } from '@cassette-canvas/engine';
import { filter, size, startsWith } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { CLOCK_FONT, FPS_FONT } from '../art/font/consts';
import { DAY_LENGTH, HOURS_PER_DAY } from '../day/consts';
import { CLOCK_LENGTH, FPS_DIGITS } from '../format/consts';
import { toTextPlacements } from '../tiles/to-text-placements';
import { LEFT_PANEL, RIGHT_PANEL, VALUE_ROW } from './consts';
import { createChartScenery } from './create-chart-scenery';
import { createChartScreen } from './create-chart-screen';
import { computeTextColumn } from './internal/compute-text-column';

const SCENERY = Object.freeze(createChartScenery());

const MEASURED_FPS = 60;

const START_TIME = 0;

const ROUNDED_FPS = 59.8;

const FAST_FPS = 144;

const HOURS_TO_NOON = 3;

const FPS_GLYPHS = 3;

describe('createChartScreen', () => {
  it('should give a clear background when it composes the chart', () => {
    expect(
      createChartScreen(SCENERY, MEASURED_FPS, START_TIME).background,
    ).toBe(TRANSPARENT);
  });

  it('should give no ambient light and no lights when it composes the chart', () => {
    const screen = createChartScreen(SCENERY, MEASURED_FPS, START_TIME);

    expect([screen.ambient, screen.lights]).toEqual([0, []]);
  });

  it('should give the scenery as the first sprites when it composes the chart', () => {
    expect(
      createChartScreen(SCENERY, MEASURED_FPS, START_TIME).sprites[0],
    ).toBe(SCENERY[0]);
  });

  it('should give the frame rate sprites on the left when it is measured', () => {
    expect(createChartScreen(SCENERY, ROUNDED_FPS, START_TIME).sprites).toEqual(
      expect.arrayContaining(
        toTextPlacements(' 60', FPS_FONT, {
          id: 'fps',
          row: VALUE_ROW,
          column: computeTextColumn(FPS_DIGITS, LEFT_PANEL),
        }),
      ),
    );
  });

  it('should give the street time sprites on the right when time passes', () => {
    expect(
      createChartScreen(
        SCENERY,
        60,
        (HOURS_TO_NOON * DAY_LENGTH) / HOURS_PER_DAY,
      ).sprites,
    ).toEqual(
      expect.arrayContaining(
        toTextPlacements('12:00', CLOCK_FONT, {
          id: 'clock',
          row: VALUE_ROW,
          column: computeTextColumn(CLOCK_LENGTH, RIGHT_PANEL),
        }),
      ),
    );
  });

  it('should give the readouts alone when there is no scenery', () => {
    expect(size(createChartScreen([], MEASURED_FPS, START_TIME).sprites)).toBe(
      size(createChartScreen(SCENERY, MEASURED_FPS, START_TIME).sprites) -
        size(SCENERY),
    );
  });

  it('should not change the old scenery when it creates the screen', () => {
    const scenery = createChartScenery();

    createChartScreen(scenery, MEASURED_FPS, START_TIME);

    expect(scenery).toEqual(createChartScenery());
  });

  it('should give a glyph for each digit of the frame rate when it is measured', () => {
    expect(
      size(
        filter(
          createChartScreen(SCENERY, FAST_FPS, START_TIME).sprites,
          ({ id }) => startsWith(id, 'fps-'),
        ),
      ) - size(filter(SCENERY, ({ id }) => startsWith(id, 'fps-'))),
    ).toBe(FPS_GLYPHS);
  });
});
