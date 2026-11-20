import { reduce } from 'lodash-es';
import type { Overlay } from '../types/overlay';
import { drawPaint } from './draw-paint';
import type { OverlayPixels } from './types/overlay-pixels';

export const patchOverlayPixels = ({
  width,
  height,
  paints,
  pixels,
}: OverlayPixels): Overlay => ({
  width,
  height,
  pixels: reduce(
    paints,
    (drawn, paint) => drawPaint(drawn, width, height, paint),
    pixels,
  ),
});
