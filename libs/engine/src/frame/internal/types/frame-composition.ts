import type { Lighting } from '../../../lighting/types/lighting';
import type { OverlayPlacement } from '../../../screen/types/overlay-placement';

export interface FrameComposition {
  readonly pixels: Int16Array;
  readonly lighting: Lighting;
  readonly overlays: readonly OverlayPlacement[];
}
