import type { OverlayPaint } from '../../overlay/types/overlay-paint';
import { toPixel } from '../../palette/to-pixel';
import { HUD_EDGE } from '../consts';
import type { HudRect } from '../types/hud-rect';
import type { HudTheme } from '../types/hud-theme';

export const drawInnerShadow = (
  rect: HudRect,
  theme: HudTheme,
): OverlayPaint => ({
  pixel: toPixel(theme.color, theme.shadow),
  row: rect.row + HUD_EDGE,
  column: rect.column + HUD_EDGE,
  width: rect.width - 2 * HUD_EDGE,
  height: HUD_EDGE,
});
