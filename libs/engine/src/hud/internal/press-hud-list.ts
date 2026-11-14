import { find } from 'lodash-es';
import { match, P } from 'ts-pattern';
import { patchHudWidget } from '../patch-hud-widget';
import type { Hud } from '../types/hud';
import type { HudChange } from '../types/hud-change';
import type { HudList } from '../types/hud-list';
import type { HudListItem } from '../types/hud-list-item';
import { computeListLayout } from './compute-list-layout';
import { computeListScroll } from './compute-list-scroll';
import { isInside } from './is-inside';
import { toIdleChange } from './to-idle-change';
import type { HudListLayout } from './types/hud-list-layout';

const { nonNullable } = P;

/**
 * The item under the pointer, if it is one that can be selected. A press on
 * an item that is not selectable finds nothing.
 */
const findItem = (
  layout: HudListLayout,
  row: number,
  column: number,
): HudListItem | undefined =>
  find(
    layout.items,
    (placement) =>
      placement.item.selectable && isInside(placement.rect, row, column),
  )?.item;

const toScrolled = (
  hud: Hud,
  window: string,
  widget: HudList,
  scroll: number,
): HudChange => ({
  hud: {
    ...patchHudWidget(hud, window, widget.id, {
      scroll: computeListScroll(widget, scroll),
    }),
    grab: undefined,
    focus: undefined,
  },
  actions: [],
});

/**
 * The pointer takes hold of the thumb, keeping the spot it grabbed under
 * itself while a move drags the thumb down or up the track.
 */
const toGrabbed = (
  hud: Hud,
  window: string,
  widget: HudList,
  layout: HudListLayout,
  row: number,
  column: number,
): HudChange => ({
  hud: {
    ...hud,
    focus: undefined,
    grab: {
      kind: 'scroll',
      window,
      widget: widget.id,
      row: row - layout.thumb.row,
      column: column - layout.thumb.column,
    },
  },
  actions: [],
});

const toSelected = (
  hud: Hud,
  window: string,
  widget: HudList,
  item: HudListItem,
): HudChange => ({
  hud: {
    ...patchHudWidget(hud, window, widget.id, { selected: item.id }),
    grab: undefined,
    focus: undefined,
  },
  actions: [{ kind: 'select', window, widget: widget.id, value: item.id }],
});

/**
 * Handles a pointer press on a list: an arrow scrolls it one item, the thumb
 * on the scroll bar is taken hold of so a move can drag it, an item that is
 * selectable selects itself and returns a `select` action, and a press
 * anywhere else in it does nothing. `row` and `column` are measured from the
 * window's top-left pixel.
 */
export const pressHudList = (
  hud: Hud,
  window: string,
  widget: HudList,
  row: number,
  column: number,
): HudChange => {
  const layout = computeListLayout(widget);

  return match({
    up: isInside(layout.up, row, column),
    down: isInside(layout.down, row, column),
    thumb: isInside(layout.thumb, row, column),
    item: findItem(layout, row, column),
  })
    .with({ up: true }, () =>
      toScrolled(hud, window, widget, layout.scroll - 1),
    )
    .with({ down: true }, () =>
      toScrolled(hud, window, widget, layout.scroll + 1),
    )
    .with({ thumb: true }, () =>
      toGrabbed(hud, window, widget, layout, row, column),
    )
    .with({ item: nonNullable }, ({ item }) =>
      toSelected(hud, window, widget, item),
    )
    .otherwise(() => toIdleChange(hud));
};
