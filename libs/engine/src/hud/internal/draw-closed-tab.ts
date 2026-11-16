import type { OverlayPaint } from '../../overlay/types/overlay-paint';
import { toPixel } from '../../palette/to-pixel';
import { HUD_TAB_DROP } from '../consts';
import type { HudRect } from '../types/hud-rect';
import type { HudTab } from '../types/hud-tab';
import type { HudTheme } from '../types/hud-theme';
import { drawBevel } from './draw-bevel';
import { drawTabText } from './draw-tab-text';

export const drawClosedTab = (
  tab: HudTab,
  rect: HudRect,
  theme: HudTheme,
): readonly OverlayPaint[] => [
  {
    pixel: toPixel(theme.color, theme.body),
    row: rect.row + HUD_TAB_DROP,
    column: rect.column,
    width: rect.width,
    height: rect.height - HUD_TAB_DROP,
  },
  ...drawBevel(
    {
      row: rect.row + HUD_TAB_DROP,
      column: rect.column,
      width: rect.width,
      height: rect.height - HUD_TAB_DROP,
    },
    toPixel(theme.color, theme.highlight),
    toPixel(theme.color, theme.shadow),
  ),
  drawTabText(tab, { ...rect, row: rect.row + HUD_TAB_DROP }, theme),
];
