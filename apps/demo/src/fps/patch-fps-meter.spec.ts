import { reduce, range } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { FPS_WINDOW } from './consts';
import { createFpsMeter } from './create-fps-meter';
import { patchFpsMeter } from './patch-fps-meter';
import type { FpsMeter } from './types/fps-meter';

const FRAME = 1000 / 60;

const createMeter = (): FpsMeter => ({ since: 0, frames: 2, fps: 58 });

describe('patchFpsMeter', () => {
  it('should count one more frame when the window has not passed yet', () => {
    expect(patchFpsMeter(createFpsMeter(0), FRAME)).toEqual({
      since: 0,
      frames: 1,
      fps: 0,
    });
  });

  it('should give the measured frame rate when the window has passed', () => {
    expect(
      reduce(
        range(1, 32),
        (meter, frame) => patchFpsMeter(meter, frame * FRAME),
        createFpsMeter(0),
      ).fps,
    ).toBeCloseTo(60);
  });

  it('should start a new count when it measures the frame rate', () => {
    expect(patchFpsMeter({ since: 0, frames: 9, fps: 0 }, FPS_WINDOW)).toEqual({
      since: FPS_WINDOW,
      frames: 0,
      fps: 20,
    });
  });

  it('should keep the last frame rate when it counts a frame', () => {
    expect(patchFpsMeter(createMeter(), FRAME).fps).toBe(58);
  });

  it('should not change the old meter when it counts a frame', () => {
    const meter = createMeter();

    patchFpsMeter(meter, FRAME);

    expect(meter).toEqual(createMeter());
  });
});
