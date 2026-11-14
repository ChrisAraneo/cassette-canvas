import type { HudListItem } from './hud-list-item';

/**
 * A list of items in a window: a surface sunk into it, with a divider
 * between each two items and a scroll bar down its right side, an up arrow
 * at the top of it and a down arrow at the bottom.
 *
 * `row` and `column` are its top-left pixel, measured from the top-left
 * pixel of the window's content, and `width` and `height` its size in
 * logical pixels. The height decides how many items it shows at once: each
 * one takes the rows it asks for, with `HUD_DIVIDER_HEIGHT` between each two,
 * and the last item that does not fit whole is left for the next page.
 *
 * `scroll` is the first item it shows, counted from 0. An arrow moves it one
 * item, dragging the thumb on the scroll bar moves it as far as the thumb
 * goes, and it never scrolls past the last page or below the first item.
 *
 * Pressing an item that is selectable selects it: it is drawn inverted and
 * the press returns a `select` action with the item's id. `selected` is that
 * id, or empty when nothing is selected. `page` is the tab it belongs to, or
 * empty to show it on every page.
 */
export interface HudList {
  readonly kind: 'list';
  readonly id: string;
  readonly page: string;
  readonly row: number;
  readonly column: number;
  readonly width: number;
  readonly height: number;
  readonly items: readonly HudListItem[];
  readonly scroll: number;
  readonly selected: string;
}
