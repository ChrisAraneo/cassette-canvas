import type { Lighting } from '../../../lighting/types/lighting';

export interface FrameComposition {
  readonly pixels: readonly number[];
  readonly lighting: Lighting;
}
