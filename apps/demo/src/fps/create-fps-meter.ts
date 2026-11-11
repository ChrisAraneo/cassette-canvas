import type { FpsMeter } from './types/fps-meter';

/** Starts counting frames at `time`, in milliseconds. */
export const createFpsMeter = (time: number): FpsMeter => ({
  since: time,
  frames: 0,
  fps: 0,
});
