import { computeLightLevels } from '../../lighting/compute-light-levels';
import type { FrameComposition } from './types/frame-composition';
import type { FrameLight } from './types/frame-light';

export const computeFrameLight = ({
  pixels,
  lighting,
  overlays,
}: FrameComposition): FrameLight => ({
  pixels,
  levels: computeLightLevels(lighting),
  overlays,
  width: lighting.width,
  height: lighting.height,
});
