import type { SpritePlacement } from '@cassette-canvas/engine';
import { size } from 'lodash-es';
import { LABEL_FONT } from '../art/font/consts';
import { toTextPlacements } from '../tiles/to-text-placements';
import {
  FPS_LABEL,
  LABEL_ROW,
  LEFT_PANEL,
  RIGHT_PANEL,
  TIME_LABEL,
} from './consts';
import { computeTextColumn } from './internal/compute-text-column';
import { createSwatchPlacements } from './internal/create-swatch-placements';

/**
 * Builds the parts of the chart that do not change: a swatch for each of the
 * 8 shades of the 16 colors, and the labels of the frame rate and the clock.
 * Build it once and pass it to `createChartScreen` on every frame.
 */
export const createChartScenery = (): SpritePlacement[] => [
  ...createSwatchPlacements(),
  ...toTextPlacements(FPS_LABEL, LABEL_FONT, {
    id: 'fps-label',
    row: LABEL_ROW,
    column: computeTextColumn(size(FPS_LABEL), LEFT_PANEL),
  }),
  ...toTextPlacements(TIME_LABEL, LABEL_FONT, {
    id: 'time-label',
    row: LABEL_ROW,
    column: computeTextColumn(size(TIME_LABEL), RIGHT_PANEL),
  }),
];
