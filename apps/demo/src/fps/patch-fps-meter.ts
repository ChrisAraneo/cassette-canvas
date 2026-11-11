import { match } from 'ts-pattern';
import { MILLISECONDS_PER_SECOND } from '../day/consts';
import { FPS_WINDOW } from './consts';
import type { FpsMeter } from './types/fps-meter';

/**
 * Counts one more frame, drawn at `time`. Once `FPS_WINDOW` has passed since
 * the count started, it measures the frame rate over that time and starts a
 * new count. Returns a new meter.
 */
export const patchFpsMeter = (
  { since, frames, fps }: FpsMeter,
  time: number,
): FpsMeter =>
  match(time - since >= FPS_WINDOW)
    .with(true, () => ({
      since: time,
      frames: 0,
      fps: ((frames + 1) * MILLISECONDS_PER_SECOND) / (time - since),
    }))
    .otherwise(() => ({ since, frames: frames + 1, fps }));
