import {
  createScreen,
  type Screen,
  type SpritePlacement,
} from '@cassette-canvas/engine';
import { CLOCK_FONT, FPS_FONT } from '../art/font/consts';
import { computeDayCycle } from '../day/compute-day-cycle';
import { placeText } from '../tiles/place-text';
import {
  CLOCK_LENGTH,
  FPS_DIGITS,
  HUD_BACKGROUND,
  LEFT_PANEL,
  RIGHT_PANEL,
  VALUE_ROW,
} from './consts';
import { centerText } from './internal/center-text';
import { formatClock } from './internal/format-clock';
import { formatFps } from './internal/format-fps';

/**
 * Composes the HUD: the color chart in the middle, the frame rate on the
 * left and the time of day on the street on the right. It has no ambient
 * light and no lights, so the swatches always show their exact colors.
 */
export const composeHudScreen = (
  scenery: readonly SpritePlacement[],
  fps: number,
  time: number,
): Screen => ({
  ...createScreen(HUD_BACKGROUND),
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
