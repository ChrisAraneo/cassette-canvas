import { filter, inRange } from 'lodash-es';
import { isPixel } from '../../palette/is-pixel';
import type { FramePixels } from './types/frame-pixels';
import type { FrameVisiblePixels } from './types/frame-visible-pixels';

export const filterFramePixels = ({
  background,
  ambient,
  lights,
  width,
  height,
  pixels,
}: FramePixels): FrameVisiblePixels => ({
  background,
  ambient,
  lights,
  width,
  height,
  pixels: filter(
    pixels,
    (candidate) =>
      isPixel(candidate.pixel) &&
      inRange(candidate.row, height) &&
      inRange(candidate.column, width),
  ),
});
