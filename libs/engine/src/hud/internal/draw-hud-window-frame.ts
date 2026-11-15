import type { OverlayPaint } from '../../overlay/types/overlay-paint';
import { toPixel } from '../../palette/to-pixel';
import { toTextPaint } from '../../text/to-text-paint';
import { HUD_EDGE, HUD_PADDING, HUD_TEXT_TOP } from '../consts';
import type { Hud } from '../types/hud';
import type { HudRect } from '../types/hud-rect';
import type { HudTheme } from '../types/hud-theme';
import type { HudWindow } from '../types/hud-window';
import { computeTitleRect } from './compute-title-rect';
import { drawCloseBox } from './draw-close-box';
import { drawPanel } from './draw-panel';
import { toWindowTheme } from './to-window-theme';

const toWindowRect = (window: HudWindow): HudRect => ({
  row: 0,
  column: 0,
  width: window.width,
  height: window.height,
});

const drawTitleBar = (title: HudRect, theme: HudTheme): OverlayPaint => ({
  pixel: toPixel(theme.color, theme.title),
  ...title,
});

const drawTitleGroove = (title: HudRect, theme: HudTheme): OverlayPaint => ({
  pixel: toPixel(theme.color, theme.shadow),
  row: title.row + title.height,
  column: title.column,
  width: title.width,
  height: HUD_EDGE,
});

const drawTitleText = (
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

/**
 * Returns the paint steps for a window without its widgets: the panel every
 * window is built from, the title bar with the title in it, the groove under
 * the bar, and the close box.
 */
export const drawHudWindowFrame = (
  hud: Hud,
  window: HudWindow,
): readonly OverlayPaint[] => {
  const theme = toWindowTheme(hud, window);
  const title = computeTitleRect(window);

  return [
    ...drawPanel(toWindowRect(window), theme),
    drawTitleBar(title, theme),
    drawTitleGroove(title, theme),
    drawTitleText(window, title, theme),
    ...drawCloseBox(hud, window),
  ];
};
