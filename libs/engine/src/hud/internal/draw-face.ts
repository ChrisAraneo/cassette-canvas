import { match } from 'ts-pattern';
import type { OverlayPaint } from '../../overlay/types/overlay-paint';
import { toPixel } from '../../palette/to-pixel';
import type { HudRect } from '../types/hud-rect';
import type { HudTheme } from '../types/hud-theme';
import { drawBevel } from './draw-bevel';

/**
 * Returns the bevel of a face the pointer can hold down: raised while it is
 * free, pressed in while `held` is true, which swaps the light and the
 * shadow sides.
 */
export const drawFace = (
  rect: HudRect,
  theme: HudTheme,
  held: boolean,
): readonly OverlayPaint[] =>
  match(held)
    .with(true, () =>
      drawBevel(
        rect,
        toPixel(theme.color, theme.shadow),
        toPixel(theme.color, theme.highlight),
      ),
    )
    .otherwise(() =>
      drawBevel(
        rect,
        toPixel(theme.color, theme.highlight),
        toPixel(theme.color, theme.shadow),
      ),
    );
