import { match } from 'ts-pattern';
import { MILLISECONDS_PER_SECOND } from '../consts';
import { FPS_WINDOW } from './consts';
import type { FpsMeter } from './types/fps-meter';

const computeFps = (frames: number, since: number, time: number): number =>
  ((frames + 1) * MILLISECONDS_PER_SECOND) / (time - since);

const createMeasuredMeter = (
  { since, frames }: FpsMeter,
  time: number,
): FpsMeter => ({
  since: time,
  frames: 0,
  fps: computeFps(frames, since, time),
});

const patchCountedFrame = ({ since, frames, fps }: FpsMeter): FpsMeter => ({
  since,
  frames: frames + 1,
  fps,
});

/**
 * Counts one more frame, drawn at `time`. Once `FPS_WINDOW` has passed since
 * the count started, it measures the frame rate over that time and starts a
 * new count. Returns a new meter.
 */
export const patchFpsMeter = (meter: FpsMeter, time: number): FpsMeter =>
  match(time - meter.since >= FPS_WINDOW)
    .with(true, () => createMeasuredMeter(meter, time))
    .otherwise(() => patchCountedFrame(meter));
