import {
  createScreen,
  type Screen,
  type SpritePlacement,
} from '@cassette-canvas/engine';
import { CLOCK_FONT, FPS_FONT } from '../art/font/consts';
import { computeDayCycle } from '../day/compute-day-cycle';
import { CLOCK_LENGTH, FPS_DIGITS } from '../format/consts';
import { formatClock } from '../format/format-clock';
import { formatFps } from '../format/format-fps';
import { placeText } from '../tiles/place-text';
import { CHART_BACKGROUND, LEFT_PANEL, RIGHT_PANEL, VALUE_ROW } from './consts';
import { centerText } from './internal/center-text';

/**
 * Composes the chart screen: the color chart in the middle, the frame rate
 * on the left, and the time of day on the street on the right. It has no
 * ambient light and no lights, so the swatches always show their exact
 * colors.
 */
export const composeChartScreen = (
  scenery: readonly SpritePlacement[],
  fps: number,
  time: number,
): Screen => ({
  ...createScreen(CHART_BACKGROUND),
  sprites: [
    ...scenery,
    ...placeText(formatFps(fps), FPS_FONT, {
      id: 'fps',
      row: VALUE_ROW,
      column: centerText(FPS_DIGITS, LEFT_PANEL),
    }),
    ...placeText(formatClock(computeDayCycle(time).phase), CLOCK_FONT, {
      id: 'clock',
      row: VALUE_ROW,
      column: centerText(CLOCK_LENGTH, RIGHT_PANEL),
    }),
  ],
});
