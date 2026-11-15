import type { OverlayPaint } from '../../../overlay/types/overlay-paint';

export interface GlyphRun {
  readonly column: number;
  readonly paints: readonly OverlayPaint[];
}
