import type { OverlayPlacement } from '../../../screen/types/overlay-placement';
import type { Frame } from '../../types/frame';

export interface FrameOverlays {
  readonly frame: Frame;
  readonly overlays: readonly OverlayPlacement[];
  readonly width: number;
  readonly height: number;
}
