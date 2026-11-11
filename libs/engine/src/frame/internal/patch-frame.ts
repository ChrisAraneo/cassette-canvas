import { times } from 'lodash-es';
import type { FrameComposition } from './types/frame-composition';
import type { FrameEdits } from './types/frame-edits';

export const patchFrame = ({
  background,
  size,
  edits,
  lighting,
}: FrameEdits): FrameComposition => ({
  pixels: times(size, (index) => edits[index] ?? background),
  lighting,
});
