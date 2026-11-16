import type { OverlayPaint } from '../../overlay/types/overlay-paint';
import { toPixel } from '../../palette/to-pixel';
import type { HudRect } from '../types/hud-rect';
import type { HudTheme } from '../types/hud-theme';

export const drawTitleBar = (
  title: HudRect,
  theme: HudTheme,
): OverlayPaint => ({
  pixel: toPixel(theme.color, theme.title),
  ...title,
});
