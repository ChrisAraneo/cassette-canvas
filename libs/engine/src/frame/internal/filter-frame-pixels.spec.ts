import { describe, expect, it } from 'vitest';

import { TRANSPARENT } from '../../palette/consts';
import type { Light } from '../../screen/types/light';
import { filterFramePixels } from './filter-frame-pixels';
import type { FramePixel } from './types/frame-pixel';

const LIGHTS: readonly Light[] = Object.freeze([
  { id: 'torch', row: 0, column: 0, radius: 6, intensity: 3 },
]);

const filterPixels = (pixels: FramePixel[]) =>
  filterFramePixels({
    background: 0x91,
    ambient: -2,
    lights: LIGHTS,
    width: 4,
    height: 3,
    pixels,
  });

const createPixel = (
  row: number,
  column: number,
  pixel: number,
): FramePixel => ({
  row,
  column,
  pixel,
  castsShadow: false,
});

describe('filterFramePixels', () => {
  it('should keep the pixels in order when they fall on the screen', () => {
    expect(
      filterPixels([createPixel(0, 0, 0x14), createPixel(2, 3, 0x34)]).pixels,
    ).toEqual([createPixel(0, 0, 0x14), createPixel(2, 3, 0x34)]);
  });

  it('should drop the pixels when they are transparent', () => {
    expect(filterPixels([createPixel(0, 0, TRANSPARENT)]).pixels).toEqual([]);
  });

  it('should drop the pixels when they are not in the palette', () => {
    expect(filterPixels([createPixel(0, 0, 0x0a)]).pixels).toEqual([]);
  });

  it('should drop the pixels when they fall above or left of the screen', () => {
    expect(
      filterPixels([createPixel(-1, 0, 0x14), createPixel(0, -1, 0x14)]).pixels,
    ).toEqual([]);
  });

  it('should drop the pixels when they fall below or right of the screen', () => {
    expect(
      filterPixels([createPixel(3, 0, 0x14), createPixel(0, 4, 0x14)]).pixels,
    ).toEqual([]);
  });

  it('should give no pixels when there are none', () => {
    expect(filterPixels([]).pixels).toEqual([]);
  });

  it('should pass on the background', () => {
    expect(filterPixels([]).background).toBe(0x91);
  });

  it('should pass on the ambient light', () => {
    expect(filterPixels([]).ambient).toBe(-2);
  });

  it('should pass on the very same lights', () => {
    expect(filterPixels([]).lights).toBe(LIGHTS);
  });

  it('should pass on the width', () => {
    expect(filterPixels([]).width).toBe(4);
  });

  it('should pass on the height', () => {
    expect(filterPixels([]).height).toBe(3);
  });
});
