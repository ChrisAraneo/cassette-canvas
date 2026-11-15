import { toLitPixels } from '../../palette/to-lit-pixels';
import type { FrameLight } from './types/frame-light';
import type { FrameOverlays } from './types/frame-overlays';

export const patchFrameShades = ({
  pixels,
  levels,
  overlays,
  width,
  height,
}: FrameLight): FrameOverlays => ({
  frame: toLitPixels(pixels, levels),
  overlays,
  width,
  height,
});
