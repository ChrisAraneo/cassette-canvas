import { COLOR_COUNT, SHADE_COUNT } from '@cassette-canvas/engine';
import { every, filter, size, startsWith } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { LABEL_FONT } from '../art/font/consts';
import { placeText } from '../tiles/place-text';
import { FPS_LABEL, LABEL_ROW, LEFT_PANEL } from './consts';
import { createChartScenery } from './create-chart-scenery';
import { centerText } from './internal/center-text';

describe('createChartScenery', () => {
  it('should show a swatch for every shade of every color when it builds the chart', () => {
    expect(
      size(filter(createChartScenery(), ({ id }) => startsWith(id, 'swatch-'))),
    ).toBe(COLOR_COUNT * SHADE_COUNT);
  });

  it('should label the frame rate on the left when it builds the chart', () => {
    expect(createChartScenery()).toEqual(
      expect.arrayContaining(
        placeText(FPS_LABEL, LABEL_FONT, {
          id: 'fps-label',
          row: LABEL_ROW,
          column: centerText(size(FPS_LABEL), LEFT_PANEL),
        }),
      ),
    );
  });

  it('should label the clock when it builds the chart', () => {
    expect(
      size(
        filter(createChartScenery(), ({ id }) => startsWith(id, 'time-label-')),
      ),
    ).toBeGreaterThan(0);
  });

  it('should let the light through everything when it builds the chart', () => {
    expect(every(createChartScenery(), { castsShadow: false })).toBe(true);
  });
});
