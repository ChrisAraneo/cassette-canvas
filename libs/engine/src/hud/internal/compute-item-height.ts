import { map, max, size } from 'lodash-es';
import { match } from 'ts-pattern';
import { HUD_LIST_ITEM_HEIGHT } from '../consts';
import type { HudItemWidget } from '../types/hud-item-widget';
import type { HudListItem } from '../types/hud-list-item';
import { computeWidgetRect } from './compute-widget-rect';

/** The rows the lines of an item take, counting an item of none as one. */
const toLinesHeight = (item: HudListItem): number =>
  Math.max(1, size(item.lines)) * HUD_LIST_ITEM_HEIGHT;

/** How far down an item a widget that sits on it reaches. */
const toWidgetBottom = (widget: HudItemWidget): number =>
  widget.row + computeWidgetRect(widget).height;

/**
 * Returns how many rows one item of a list takes: the height it asks for,
 * or, when it asks for none, as many rows as its lines of text and the
 * widgets that sit on it need.
 */
export const computeItemHeight = (item: HudListItem): number =>
  match(item.height > 0)
    .with(true, () => item.height)
    .otherwise(
      () =>
        max([toLinesHeight(item), ...map(item.widgets, toWidgetBottom)]) ?? 0,
    );
