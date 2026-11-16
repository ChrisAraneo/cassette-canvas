import { isEmpty } from 'lodash-es';
import { match } from 'ts-pattern';
import type { Frame } from '../types/frame';
import { drawFrameOverlays } from './draw-frame-overlays';
import type { FrameOverlays } from './types/frame-overlays';

/**
 * Paints the overlays over a lit frame, in order, so later overlays cover
 * earlier ones. Each overlay pixel shows its authored color: no ambient
 * light, no light, and no shadow reaches it. Parts outside the frame are cut
 * off, and transparent pixels leave the lit frame below. A frame with no
 * overlays comes back as it is.
 */
export const patchFrameOverlays = ({
  frame,
  overlays,
  width,
  height,
}: FrameOverlays): Frame =>
  match(isEmpty(overlays))
    .with(true, () => frame)
    .otherwise(() => drawFrameOverlays(frame, overlays, width, height));
