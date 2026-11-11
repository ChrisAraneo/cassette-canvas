import { describe, expect, it } from 'vitest';

import type { Light } from '../../screen/types/light';
import { createFrameEdits } from './create-frame-edits';
import type { FramePixel } from './types/frame-pixel';

const LIGHTS: readonly Light[] = Object.freeze([
  { id: 'torch', row: 0, column: 0, radius: 6, intensity: 3 },
]);

const createEdits = (pixels: FramePixel[]) =>
  createFrameEdits({
    background: 0x91,
    ambient: -2,
    lights: LIGHTS,
    width: 4,
    height: 3,
    pixels,
  });

describe('createFrameEdits', () => {
  it('should key each pixel by its place in the frame when it collects the edits', () => {
    expect(
      createEdits([
        { row: 0, column: 1, pixel: 0x14, castsShadow: false },
        { row: 2, column: 3, pixel: 0x34, castsShadow: false },
      ]).edits,
    ).toEqual({ 1: 0x14, 11: 0x34 });
  });

  it('should let the later pixel win when two land on the same place', () => {
    expect(
      createEdits([
        { row: 1, column: 1, pixel: 0x14, castsShadow: false },
        { row: 1, column: 1, pixel: 0x34, castsShadow: false },
      ]).edits,
    ).toEqual({ 5: 0x34 });
  });

  it('should collect the places of the shadow casters when some pixels cast shadows', () => {
    expect(
      createEdits([
        { row: 0, column: 1, pixel: 0x14, castsShadow: false },
        { row: 2, column: 3, pixel: 0x34, castsShadow: true },
      ]).lighting.occluders,
    ).toEqual({ 11: true });
  });

  it('should keep a shadow caster when a sprite that casts none covers it', () => {
    expect(
      createEdits([
        { row: 1, column: 1, pixel: 0x34, castsShadow: true },
        { row: 1, column: 1, pixel: 0x14, castsShadow: false },
      ]).lighting.occluders,
    ).toEqual({ 5: true });
  });

  it('should collect no edits and no casters when there are no pixels', () => {
    const edits = createEdits([]);

    expect(edits.edits).toEqual({});
    expect(edits.lighting.occluders).toEqual({});
  });

  it('should count every place in the frame when it collects the edits', () => {
    expect(createEdits([]).size).toBe(12);
  });

  it('should pass on the background', () => {
    expect(createEdits([]).background).toBe(0x91);
  });

  it('should pass on the ambient light for the lighting', () => {
    expect(createEdits([]).lighting.ambient).toBe(-2);
  });

  it('should pass on the very same lights for the lighting', () => {
    expect(createEdits([]).lighting.lights).toBe(LIGHTS);
  });

  it('should pass on the width and the height for the lighting', () => {
    const { lighting } = createEdits([]);

    expect([lighting.width, lighting.height]).toEqual([4, 3]);
  });
});
