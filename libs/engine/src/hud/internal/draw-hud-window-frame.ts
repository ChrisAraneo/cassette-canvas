import type { OverlayPaint } from '../../overlay/types/overlay-paint';
import type { Hud } from '../types/hud';
import type { HudWindow } from '../types/hud-window';
import { computeTitleRect } from './compute-title-rect';
import { drawCloseBox } from './draw-close-box';
import { drawPanel } from './draw-panel';
import { drawTitleBar } from './draw-title-bar';
import { drawTitleGroove } from './draw-title-groove';
import { drawTitleText } from './draw-title-text';
import { toWindowRect } from './to-window-rect';
import { toWindowTheme } from './to-window-theme';

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
