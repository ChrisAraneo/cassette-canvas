import type { SpritePlacement } from '@cassette-canvas/engine';
import { size } from 'lodash-es';
import { LABEL_FONT } from '../art/font/consts';
import { placeText } from '../tiles/place-text';
import {
  FPS_LABEL,
  LABEL_ROW,
  LEFT_PANEL,
  RIGHT_PANEL,
  TIME_LABEL,
} from './consts';
import { centerText } from './internal/center-text';
import { createSwatchPlacements } from './internal/create-swatch-placements';

/**
 * Builds the parts of the HUD that do not change: a swatch for each of the
 * 8 shades of the 16 colors, and the labels of the frame rate and the clock.
 * Build it once and pass it to `composeHudScreen` on every frame.
 */
export const createHudScenery = (): SpritePlacement[] => [
  ...createSwatchPlacements(),
  ...placeText(FPS_LABEL, LABEL_FONT, {
    id: 'fps-label',
    row: LABEL_ROW,
    column: centerText(size(FPS_LABEL), LEFT_PANEL),
  }),
  ...placeText(TIME_LABEL, LABEL_FONT, {
    id: 'time-label',
    row: LABEL_ROW,
    column: centerText(size(TIME_LABEL), RIGHT_PANEL),
  }),
];
