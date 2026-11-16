import type { OverlayPaint } from '../../overlay/types/overlay-paint';
import { toPixel } from '../../palette/to-pixel';
import { HUD_EDGE } from '../consts';
import type { HudRect } from '../types/hud-rect';
import type { HudTheme } from '../types/hud-theme';

export const drawTitleGroove = (
  title: HudRect,
  theme: HudTheme,
): OverlayPaint => ({
  pixel: toPixel(theme.color, theme.shadow),
  row: title.row + title.height,
  column: title.column,
  width: title.width,
  height: HUD_EDGE,
});
