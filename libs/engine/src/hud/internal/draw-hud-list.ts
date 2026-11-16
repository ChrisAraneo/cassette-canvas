import { flatMap, size } from 'lodash-es';
import type { OverlayPaint } from '../../overlay/types/overlay-paint';
import type { Hud } from '../types/hud';
import type { HudList } from '../types/hud-list';
import type { HudWindow } from '../types/hud-window';
import { computeListLayout } from './compute-list-layout';
import { computeWidgetRect } from './compute-widget-rect';
import { drawBar } from './draw-bar';
import { drawItem } from './draw-item';
import { drawSunken } from './draw-sunken';
import { isScrolling } from './is-scrolling';
import { toWindowTheme } from './to-window-theme';

/**
 * Returns the paint steps for a list: a surface sunk into the window, the
 * items it shows with a divider between each two, and the scroll bar down
 * its right side. An item shows its lines of text one under the other, each
 * one cut off where the item ends, and the selected item is drawn inverted.
 * The widgets that sit on the items are painted after the list itself, so
 * they come out on top of it.
 */
export const drawHudList = (
  hud: Hud,
  window: HudWindow,
  widget: HudList,
): readonly OverlayPaint[] => {
  const theme = toWindowTheme(hud, window);
  const layout = computeListLayout(widget);

  return [
    ...drawSunken(computeWidgetRect(widget), theme),
    ...flatMap(layout.items, (placement, index) =>
      drawItem(placement, index, size(layout.items), widget, theme),
    ),
    ...drawBar(layout, theme, isScrolling(hud, window.id, widget.id)),
  ];
};
