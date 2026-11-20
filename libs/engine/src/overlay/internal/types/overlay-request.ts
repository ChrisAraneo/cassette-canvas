import type { OverlayPaint } from '../../types/overlay-paint';

export interface OverlayRequest {
  readonly width: number;
  readonly height: number;
  readonly paints: readonly OverlayPaint[];
}
