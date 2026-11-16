import type { OverlayPaint } from '../../overlay/types/overlay-paint';
import { toPixel } from '../../palette/to-pixel';
import type { HudRect } from '../types/hud-rect';
import type { HudTheme } from '../types/hud-theme';
import { drawGroove } from './draw-groove';

export const drawThemedGroove = (
  rect: HudRect,
  theme: HudTheme,
): readonly OverlayPaint[] =>
  drawGroove(
    rect,
    toPixel(theme.color, theme.highlight),
    toPixel(theme.color, theme.shadow),
  );
