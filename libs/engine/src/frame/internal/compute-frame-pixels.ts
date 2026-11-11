/* eslint-disable no-restricted-syntax -- Appendix B exception 1, measured below */
import { TRANSPARENT } from '../../palette/consts';
import { isPixel } from '../../palette/is-pixel';
import type { Screen } from '../../screen/types/screen';
import type { FrameComposition } from './types/frame-composition';

const SHADOW_CASTER = 1;

// Style guide - Appendix B exception 1 (hot numeric kernel).
// As a pipeline (one object per sprite pixel, a filter, edits keyed by place,
// then a fill with the background), composing the demo screen (320x180, 182
// sprites) took 4.9 ms per frame (Vite bundle, Node 24). This loop takes
// 0.55 ms. It only changes typed arrays it creates itself, and they do not
// change after it returns them.
export const computeFramePixels = ({
  screen,
  spriteSize,
  width,
  height,
}: {
  screen: Screen;
  spriteSize: number;
  width: number;
  height: number;
}): FrameComposition => {
  const size = Math.max(0, width * height);
  const pixels = new Int16Array(size).fill(
    isPixel(screen.background) ? screen.background : TRANSPARENT,
  );
  const occluders = new Uint8Array(size);
  const spritePixelCount = spriteSize * spriteSize;

  for (const { sprite, row, column, castsShadow } of screen.sprites) {
    const top = Math.floor(row);
    const left = Math.floor(column);
    const count = Math.min(sprite.length, spritePixelCount);

    for (let index = 0; index < count; index += 1) {
      const pixel = sprite[index] ?? TRANSPARENT;
      const pixelRow = top + Math.floor(index / spriteSize);
      const pixelColumn = left + (index % spriteSize);
      const isOnScreen =
        pixelRow >= 0 &&
        pixelRow < height &&
        pixelColumn >= 0 &&
        pixelColumn < width;

      if (isOnScreen && isPixel(pixel)) {
        const place = pixelRow * width + pixelColumn;

        pixels[place] = pixel;

        if (castsShadow) {
          occluders[place] = SHADOW_CASTER;
        }
      }
    }
  }

  return {
    pixels,
    lighting: {
      ambient: screen.ambient,
      lights: screen.lights,
      width,
      height,
      occluders,
    },
  };
};
