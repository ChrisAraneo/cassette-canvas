import type { OverlayPlacement } from '../../../screen/types/overlay-placement';

export interface FrameLight {
  readonly pixels: Int16Array;
  readonly levels: Float64Array;
  readonly overlays: readonly OverlayPlacement[];
  readonly width: number;
  readonly height: number;
}
