import type { OverlayPaint } from '../../types/overlay-paint';

export interface OverlayPixels {
  readonly width: number;
  readonly height: number;
  readonly paints: readonly OverlayPaint[];
  readonly pixels: number[];
}
