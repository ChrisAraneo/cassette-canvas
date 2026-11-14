import { reduce, range } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { FPS_WINDOW } from './consts';
import { createFpsMeter } from './create-fps-meter';
import { patchFpsMeter } from './patch-fps-meter';

const FRAME = 1000 / 60;

describe('patchFpsMeter', () => {
  it('should return one more frame counted when the window has not passed yet', () => {
    expect(patchFpsMeter(createFpsMeter(0), FRAME)).toEqual({
      since: 0,
      frames: 1,
      fps: 0,
    });
  });

  it('should return the measured frame rate when the window has passed', () => {
    expect(
      reduce(
        range(1, 32),
        (meter, frame) => patchFpsMeter(meter, frame * FRAME),
        createFpsMeter(0),
      ).fps,
    ).toBeCloseTo(60);
  });

  it('should return a new count when it measures the frame rate', () => {
    expect(patchFpsMeter({ since: 0, frames: 9, fps: 0 }, FPS_WINDOW)).toEqual({
      since: FPS_WINDOW,
      frames: 0,
      fps: 20,
    });
  });

  it('should return the last frame rate when it counts a frame', () => {
    expect(patchFpsMeter({ since: 0, frames: 2, fps: 58 }, FRAME).fps).toBe(58);
  });
});
