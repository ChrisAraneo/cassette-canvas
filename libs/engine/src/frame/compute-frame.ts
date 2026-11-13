import { pipe } from 'remeda';
import type { Screen } from '../screen/types/screen';
import { computeFrameLight } from './internal/compute-frame-light';
import { computeFramePixels } from './internal/compute-frame-pixels';
import { patchFrameOverlays } from './internal/patch-frame-overlays';
import { patchFrameShades } from './internal/patch-frame-shades';
import type { Frame } from './types/frame';

/**
 * Turns a screen into a frame of `width * height` extended pixels:
 *
 * 1. Fills the frame with the background.
 * 2. Draws the sprites in order. Transparent pixels are skipped, and parts
 *    outside the frame are cut off.
 * 3. Lights every pixel: moves it along its 32-shade scale by the ambient
 *    light plus each light that reaches it. Sprites that cast shadows block
 *    light.
 * 4. Paints the overlays on top. Light never reaches them, so they keep the
 *    colors they were authored in.
 *
 * With ambient 0 and no lights, every pixel keeps its authored color.
 */
export const computeFrame = (
  screen: Screen,
  spriteSize: number,
  width: number,
  height: number,
): Frame =>
  pipe(
    { screen, spriteSize, width, height },
    computeFramePixels,
    computeFrameLight,
    patchFrameShades,
    (frame) => patchFrameOverlays(frame, screen.overlays, width, height),
  );
