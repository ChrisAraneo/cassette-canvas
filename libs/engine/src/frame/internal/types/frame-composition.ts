import type { Lighting } from '../../../lighting/types/lighting';

export interface FrameComposition {
  readonly pixels: Int16Array;
  readonly lighting: Lighting;
}
