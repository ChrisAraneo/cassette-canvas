import type { OverlayFill } from './overlay-fill';
import type { OverlayImage } from './overlay-image';

/** One step of painting an overlay: a rectangle of one color, or an image. */
export type OverlayPaint = OverlayFill | OverlayImage;
