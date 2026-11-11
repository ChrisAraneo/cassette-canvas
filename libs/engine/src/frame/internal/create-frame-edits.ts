import { filter, fromPairs, map } from 'lodash-es';
import type { FrameEdit } from './types/frame-edit';
import type { FrameEdits } from './types/frame-edits';
import type { FrameOccluder } from './types/frame-occluder';
import type { FramePixel } from './types/frame-pixel';
import type { FrameVisiblePixels } from './types/frame-visible-pixels';

const toFrameIndex = ({ row, column }: FramePixel, width: number): number =>
  row * width + column;

export const createFrameEdits = ({
  background,
  ambient,
  lights,
  width,
  height,
  pixels,
}: FrameVisiblePixels): FrameEdits => ({
  background,
  size: width * height,
  edits: fromPairs(
    map(pixels, (candidate): FrameEdit => [
      toFrameIndex(candidate, width),
      candidate.pixel,
    ]),
  ),
  lighting: {
    ambient,
    lights,
    width,
    height,
    occluders: fromPairs(
      map(
        filter(pixels, (candidate) => candidate.castsShadow),
        (candidate): FrameOccluder => [toFrameIndex(candidate, width), true],
      ),
    ),
  },
});
