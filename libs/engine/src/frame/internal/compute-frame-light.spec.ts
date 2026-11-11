import { describe, expect, it } from 'vitest';

import type { Lighting } from '../../lighting/types/lighting';
import { computeFrameLight } from './compute-frame-light';

const PIXELS = Object.freeze([0x04, 0x04, 0x04, 0x04]);

const createLighting = (
  ambient: number,
  occluders: Record<number, boolean>,
): Lighting => ({
  ambient,
  lights: [{ id: 'torch', row: 0, column: 0, radius: 4, intensity: 4 }],
  width: 4,
  height: 1,
  occluders,
});

describe('computeFrameLight', () => {
  it('should light each place by its distance from the light when nothing stands in the way', () => {
    expect(
      computeFrameLight({ pixels: PIXELS, lighting: createLighting(0, {}) })
        .levels,
    ).toEqual([4, 3, 2, 1]);
  });

  it('should add the ambient light to every place when it lights the frame', () => {
    expect(
      computeFrameLight({ pixels: PIXELS, lighting: createLighting(-4, {}) })
        .levels,
    ).toEqual([0, -1, -2, -3]);
  });

  it('should leave only the ambient light behind a shadow caster', () => {
    expect(
      computeFrameLight({
        pixels: PIXELS,
        lighting: createLighting(-1, { 1: true }),
      }).levels,
    ).toEqual([3, 2, -1, -1]);
  });

  it('should give no levels when the frame is empty', () => {
    expect(
      computeFrameLight({
        pixels: [],
        lighting: { ...createLighting(0, {}), width: 0, height: 0 },
      }).levels,
    ).toEqual([]);
  });

  it('should pass on the very same pixels', () => {
    expect(
      computeFrameLight({ pixels: PIXELS, lighting: createLighting(0, {}) })
        .pixels,
    ).toBe(PIXELS);
  });
});
