import type { OverlayPaint } from '../../overlay/types/overlay-paint';
import { toPixel } from '../../palette/to-pixel';
import { HUD_EDGE } from '../consts';
import type { HudRect } from '../types/hud-rect';
import type { HudTab } from '../types/hud-tab';
import type { HudTheme } from '../types/hud-theme';
import { drawTabText } from './draw-tab-text';

export const drawOpenTab = (
  tab: HudTab,
  rect: HudRect,
  theme: HudTheme,
): readonly OverlayPaint[] => [
  { pixel: toPixel(theme.color, theme.face), ...rect },
  {
    pixel: toPixel(theme.color, theme.highlight),
    row: rect.row,
    column: rect.column,
    width: rect.width,
    height: HUD_EDGE,
  },
  {
    pixel: toPixel(theme.color, theme.highlight),
    row: rect.row,
    column: rect.column,
    width: HUD_EDGE,
    height: rect.height,
  },
  {
    pixel: toPixel(theme.color, theme.shadow),
    row: rect.row,
    column: rect.column + rect.width - HUD_EDGE,
    width: HUD_EDGE,
    height: rect.height,
  },
  drawTabText(tab, rect, theme),
];
