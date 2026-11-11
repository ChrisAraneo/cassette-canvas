import { clamp, padStart, round, toString } from 'lodash-es';
import { match } from 'ts-pattern';
import { FPS_DIGITS, MAX_FPS, NO_FPS } from '../consts';

/**
 * Formats a frame rate as whole frames per second, right-aligned in
 * `FPS_DIGITS` characters. Shows dashes before the first measurement.
 */
export const formatFps = (fps: number): string =>
  padStart(
    match(fps > 0)
      .with(true, () => toString(clamp(round(fps), 1, MAX_FPS)))
      .otherwise(() => NO_FPS),
    FPS_DIGITS,
  );
