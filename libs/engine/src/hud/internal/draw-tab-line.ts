import type { OverlayPaint } from '../../overlay/types/overlay-paint';
import { toPixel } from '../../palette/to-pixel';
import { HUD_CONTENT_LEFT, HUD_EDGE } from '../consts';
import type { HudRect } from '../types/hud-rect';
import type { HudTheme } from '../types/hud-theme';
import type { HudWindow } from '../types/hud-window';
import { computeContentWidth } from './compute-content-width';

export const drawTabLine = (
  window: HudWindow,
  strip: HudRect,
  theme: HudTheme,
): OverlayPaint => ({
  pixel: toPixel(theme.color, theme.highlight),
  row: strip.row + strip.height - HUD_EDGE,
  column: HUD_CONTENT_LEFT,
  width: computeContentWidth(window),
  height: HUD_EDGE,
});
