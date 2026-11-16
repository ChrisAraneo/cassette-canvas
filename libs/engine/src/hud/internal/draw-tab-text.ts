import type { OverlayPaint } from '../../overlay/types/overlay-paint';
import { toPixel } from '../../palette/to-pixel';
import { toTextPaint } from '../../text/to-text-paint';
import { HUD_LABEL_PADDING, HUD_TEXT_TOP } from '../consts';
import type { HudRect } from '../types/hud-rect';
import type { HudTab } from '../types/hud-tab';
import type { HudTheme } from '../types/hud-theme';

export const drawTabText = (
  tab: HudTab,
  rect: HudRect,
  theme: HudTheme,
): OverlayPaint =>
  toTextPaint(
    tab.text,
    toPixel(theme.color, theme.text),
    rect.row + HUD_TEXT_TOP,
    rect.column + HUD_LABEL_PADDING,
  );
