import type { OverlayPaint } from '../../overlay/types/overlay-paint';
import { toPixel } from '../../palette/to-pixel';
import { toTextPaint } from '../../text/to-text-paint';
import { HUD_PADDING, HUD_TEXT_TOP } from '../consts';
import type { HudRect } from '../types/hud-rect';
import type { HudTheme } from '../types/hud-theme';
import type { HudWindow } from '../types/hud-window';

export const drawTitleText = (
  window: HudWindow,
  title: HudRect,
  theme: HudTheme,
): OverlayPaint =>
  toTextPaint(
    window.title,
    toPixel(theme.color, theme.text),
    title.row + HUD_TEXT_TOP,
    title.column + HUD_PADDING,
  );
