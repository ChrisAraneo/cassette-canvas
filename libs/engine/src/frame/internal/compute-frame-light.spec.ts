import { size, toArray } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import type { Lighting } from '../../lighting/types/lighting';
import type { OverlayPlacement } from '../../screen/types/overlay-placement';
import { computeFrameLight } from './compute-frame-light';

const PIXELS = Int16Array.from([0x04, 0x04, 0x04, 0x04]);

const OVERLAYS: readonly OverlayPlacement[] = Object.freeze([]);

const createLighting = (ambient: number, occluders: Uint8Array): Lighting => ({
  ambient,
  lights: [{ id: 'torch', row: 0, column: 0, radius: 4, intensity: 4 }],
  width: 4,
  height: 1,
  occluders,
});

const computeLevels = (ambient: number, occluders: Uint8Array): number[] =>
  toArray(
    computeFrameLight({
      pixels: PIXELS,
      lighting: createLighting(ambient, occluders),
      overlays: OVERLAYS,
    }).levels,
  );

describe('computeFrameLight', () => {
  it('should return each place lit by its distance from the light when nothing stands in the way', () => {
    const levels = computeLevels(0, new Uint8Array(4));

    expect(levels[0]).toBe(4);
    expect(levels[1] ?? 0).toBeLessThan(levels[0] ?? 0);
    expect(levels[2] ?? 0).toBeLessThan(levels[1] ?? 0);
    expect(levels[3] ?? 0).toBeLessThan(levels[2] ?? 0);
  });

  it('should return every place above the ambient light when it lights the frame', () => {
    const levels = computeLevels(-4, new Uint8Array(4));

    expect(levels[0] ?? 0).toBeGreaterThan(-4);
    expect(levels[3] ?? 0).toBeGreaterThan(-4);
    expect(levels[3] ?? 0).toBeLessThan(levels[0] ?? 0);
  });

  it('should return only the ambient light when a place sits behind a shadow caster', () => {
    const levels = computeLevels(-1, Uint8Array.from([0, 1, 0, 0]));

    expect(levels[0] ?? 0).toBeGreaterThan(-1);
    expect(levels[1] ?? 0).toBeGreaterThan(-1);
    expect(levels[2]).toBeCloseTo(-1);
    expect(levels[3]).toBeCloseTo(-1);
  });

  it('should return no levels when the frame is empty', () => {
    expect(
      size(
        computeFrameLight({
          pixels: new Int16Array(0),
          lighting: {
            ...createLighting(0, new Uint8Array(0)),
            width: 0,
            height: 0,
          },
          overlays: OVERLAYS,
        }).levels,
      ),
    ).toBe(0);
  });

  it('should return the very same pixels when it lights the frame', () => {
    expect(
      computeFrameLight({
        pixels: PIXELS,
        lighting: createLighting(0, new Uint8Array(4)),
        overlays: OVERLAYS,
      }).pixels,
    ).toBe(PIXELS);
  });

  it('should return the very same overlays when it lights the frame', () => {
    expect(
      computeFrameLight({
        pixels: PIXELS,
        lighting: createLighting(0, new Uint8Array(4)),
        overlays: OVERLAYS,
      }).overlays,
    ).toBe(OVERLAYS);
  });
});
