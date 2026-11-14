import { flatMap, map } from 'lodash-es';
import { match } from 'ts-pattern';
import { HUD_CONTENT_LEFT, HUD_CONTENT_TOP } from '../consts';
import type { HudItemWidget } from '../types/hud-item-widget';
import type { HudRect } from '../types/hud-rect';
import type { HudWidget } from '../types/hud-widget';
import type { HudWindow } from '../types/hud-window';
import { computeListLayout } from './compute-list-layout';
import { filterPageWidgets } from './filter-page-widgets';
import type { HudListPlacement } from './types/hud-list-placement';
import type { HudPlacedWidget } from './types/hud-placed-widget';

/**
 * Returns a widget that sits on an item where it sits in the window. A
 * widget of an item is placed from the item's top-left pixel and a widget of
 * a window from the top-left pixel of the window's content, so moving one
 * from the first to the second is the item's own place less the content's.
 */
const toPlacedWidget = (widget: HudItemWidget, rect: HudRect): HudWidget => ({
  ...widget,
  row: widget.row + rect.row - HUD_CONTENT_TOP,
  column: widget.column + rect.column - HUD_CONTENT_LEFT,
});

const toItemWidgets = (
  placement: HudListPlacement,
): readonly HudPlacedWidget[] =>
  map(placement.item.widgets, (widget) => ({
    widget: toPlacedWidget(widget, placement.rect),
    item: placement.item.id,
  }));

/** A list, and then the widgets of the items it shows right now. */
const toShownWidgets = (widget: HudWidget): readonly HudPlacedWidget[] =>
  match(widget)
    .with({ kind: 'list' }, (list): readonly HudPlacedWidget[] => [
      { widget: list, item: '' },
      ...flatMap(computeListLayout(list).items, toItemWidgets),
    ])
    .otherwise((): readonly HudPlacedWidget[] => [{ widget, item: '' }]);

/**
 * Returns every widget a window shows right now, in the order it paints
 * them: the widgets of its open page, and after each list the widgets of the
 * items that list shows, each one moved to where it sits in the window.
 * Painting a window and pressing one both read this, so what the person sees
 * is what the pointer finds.
 */
export const toWindowWidgets = (
  window: HudWindow,
): readonly HudPlacedWidget[] =>
  flatMap(filterPageWidgets(window), toShownWidgets);
