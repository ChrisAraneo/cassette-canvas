import {
  createScreen,
  type Screen,
  type SpritePlacement,
  TRANSPARENT,
} from '@cassette-canvas/engine';
import { CLOCK_FONT, FPS_FONT } from '../art/font/consts';
import { computeDayCycle } from '../day/compute-day-cycle';
import { CLOCK_LENGTH, FPS_DIGITS } from '../format/consts';
import { formatClock } from '../format/format-clock';
import { formatFps } from '../format/format-fps';
import { toTextPlacements } from '../tiles/to-text-placements';
import { LEFT_PANEL, RIGHT_PANEL, VALUE_ROW } from './consts';
import { computeTextColumn } from './internal/compute-text-column';

/**
 * Creates the chart screen: the color chart in the middle, the frame rate
 * on the left, and the time of day on the street on the right. It has no
 * ambient light and no lights, so the swatches always show their exact
 * colors, and no background, so the page shows between the swatches: a
 * background color of its own would hide the swatch of the same color.
 */
export const createChartScreen = (
  scenery: readonly SpritePlacement[],
  fps: number,
  time: number,
): Screen => ({
  ...createScreen(TRANSPARENT),
  sprites: [
    ...scenery,
    ...toTextPlacements(formatFps(fps), FPS_FONT, {
      id: 'fps',
      row: VALUE_ROW,
      column: computeTextColumn(FPS_DIGITS, LEFT_PANEL),
    }),
    ...toTextPlacements(formatClock(computeDayCycle(time).phase), CLOCK_FONT, {
      id: 'clock',
      row: VALUE_ROW,
      column: computeTextColumn(CLOCK_LENGTH, RIGHT_PANEL),
    }),
  ],
});
