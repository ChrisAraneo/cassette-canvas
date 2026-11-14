import type { HudItemWidget } from './hud-item-widget';

/**
 * One item of a list. `id` names it in a `select` action, and `lines` are the
 * lines of text it shows, one under the other, each cut off where the item
 * ends. An item is `HUD_LIST_ITEM_HEIGHT` tall for each of its lines, so one
 * line of text is an ordinary row and two make a taller item.
 *
 * `widgets` are the widgets that sit on the item, placed from its top-left
 * pixel: labels, buttons, dividers, and panels. They are painted over the
 * item's own lines, so a panel behind them comes first, and nothing cuts them
 * off at the edge of the item: keep them inside it. An item is as wide as
 * its list without the padding, the line down its right side, and the scroll
 * bar, which is `width - HUD_PADDING - HUD_EDGE - HUD_LIST_BAR_WIDTH`.
 *
 * `height` is how many rows the item takes, or 0 to take as many as its lines
 * and the widgets on it need.
 *
 * `selectable` is whether pressing the item selects it. An item that is not
 * selectable, such as a heading, takes no selection and returns no action,
 * and the buttons on it still work.
 */
export interface HudListItem {
  readonly id: string;
  readonly lines: readonly string[];
  readonly height: number;
  readonly widgets: readonly HudItemWidget[];
  readonly selectable: boolean;
}
