import { computeLightLevels } from '../../lighting/compute-light-levels';
import type { FrameComposition } from './types/frame-composition';
import type { FrameLight } from './types/frame-light';

export const computeFrameLight = ({
  pixels,
  lighting,
}: FrameComposition): FrameLight => ({
  pixels,
  levels: computeLightLevels(lighting),
});
