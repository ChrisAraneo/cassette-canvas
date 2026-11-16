import { flatMap } from 'lodash-es';
import { match, P } from 'ts-pattern';
import type { OverlayPaint } from '../../overlay/types/overlay-paint';
import type { Hud } from '../types/hud';
import type { HudTabs } from '../types/hud-tabs';
import type { HudWindow } from '../types/hud-window';
import { computeTabRects } from './compute-tab-rects';
import { computeWidgetRect } from './compute-widget-rect';
import { drawClosedTab } from './draw-closed-tab';
import { drawOpenTab } from './draw-open-tab';
import { drawTabLine } from './draw-tab-line';
import { toWindowTheme } from './to-window-theme';

const { nonNullable } = P;

const NO_PAINTS: readonly OverlayPaint[] = Object.freeze([]);

/**
 * Returns the paint steps for a strip of tabs, with a line across the window
 * that joins the open tab to the page below it. The closed tabs are painted
 * first and the open one last, so it covers that line and looks like the
 * front tab.
 */
export const drawHudTabs = (
  hud: Hud,
  window: HudWindow,
  widget: HudTabs,
): readonly OverlayPaint[] => {
  const theme = toWindowTheme(hud, window);
  const rects = computeTabRects(widget);

  return [
    ...flatMap(widget.tabs, (tab, index) =>
      match({ rect: rects[index], open: tab.id === window.page })
        .with({ rect: nonNullable, open: false }, ({ rect }) =>
          drawClosedTab(tab, rect, theme),
        )
        .otherwise(() => NO_PAINTS),
    ),
    drawTabLine(window, computeWidgetRect(widget), theme),
    ...flatMap(widget.tabs, (tab, index) =>
      match({ rect: rects[index], open: tab.id === window.page })
        .with({ rect: nonNullable, open: true }, ({ rect }) =>
          drawOpenTab(tab, rect, theme),
        )
        .otherwise(() => NO_PAINTS),
    ),
  ];
};
