import { floor, last, reduce, size, slice } from 'lodash-es';
import { match, P } from 'ts-pattern';
import {
  HUD_DIVIDER_HEIGHT,
  HUD_EDGE,
  HUD_LIST_BAR_WIDTH,
  HUD_LIST_THUMB_HEIGHT,
  HUD_PADDING,
} from '../consts';
import type { HudList } from '../types/hud-list';
import type { HudListItem } from '../types/hud-list-item';
import type { HudRect } from '../types/hud-rect';
import { computeItemHeight } from './compute-item-height';
import { computeListCapacity } from './compute-list-capacity';
import { computeListLastPage } from './compute-list-last-page';
import { computeListScroll } from './compute-list-scroll';
import { computeWidgetRect } from './compute-widget-rect';
import type { HudListLayout } from './types/hud-list-layout';
import type { HudListPlacement } from './types/hud-list-placement';

const { nonNullable } = P;

const NO_PLACEMENTS: readonly HudListPlacement[] = Object.freeze([]);

/** The scroll bar down the right side of a list, inside its dark line. */
const toBarRect = (rect: HudRect): HudRect => ({
  row: rect.row + HUD_EDGE,
  column: rect.column + rect.width - HUD_EDGE - HUD_LIST_BAR_WIDTH,
  width: HUD_LIST_BAR_WIDTH,
  height: rect.height - 2 * HUD_EDGE,
});

/**
 * Where the next item starts: a divider below the last item placed, or, for
 * the first one, `HUD_PADDING` rows inside the top of the list.
 */
const toItemRow = (
  rect: HudRect,
  placed: readonly HudListPlacement[],
): number =>
  match(last(placed))
    .with(
      nonNullable,
      (previous) =>
        previous.rect.row + previous.rect.height + HUD_DIVIDER_HEIGHT,
    )
    .otherwise(() => rect.row + HUD_PADDING);

/**
 * The columns an item takes: the list without its padding, the dark line
 * down its right side, and the scroll bar inside that line.
 */
const toItemWidth = (rect: HudRect): number =>
  rect.width - HUD_PADDING - HUD_EDGE - HUD_LIST_BAR_WIDTH;

const addPlacement = (
  placed: readonly HudListPlacement[],
  item: HudListItem,
  rect: HudRect,
): readonly HudListPlacement[] => [
  ...placed,
  {
    item,
    rect: {
      row: toItemRow(rect, placed),
      column: rect.column + HUD_PADDING,
      width: toItemWidth(rect),
      height: computeItemHeight(item),
    },
  },
];

const toPlacements = (
  rect: HudRect,
  items: readonly HudListItem[],
): readonly HudListPlacement[] =>
  reduce(
    items,
    (placed: readonly HudListPlacement[], item: HudListItem) =>
      addPlacement(placed, item, rect),
    NO_PLACEMENTS,
  );

/**
 * The thumb on the track, as tall a part of it as the items it shows are of
 * the items it holds, and as far down it as the scroll is through the pages.
 * A list that shows everything it holds, or one too short for a thumb, has
 * none: its height is 0, which paints nothing and takes no press.
 */
const toThumbRect = (
  track: HudRect,
  capacity: number,
  total: number,
  scroll: number,
  lastPage: number,
): HudRect =>
  match(lastPage <= 0 || track.height < HUD_LIST_THUMB_HEIGHT)
    .with(true, () => ({ ...track, height: 0 }))
    .otherwise(() => {
      const height = Math.max(
        HUD_LIST_THUMB_HEIGHT,
        floor((track.height * capacity) / total),
      );

      return {
        ...track,
        row: track.row + floor(((track.height - height) * scroll) / lastPage),
        height,
      };
    });

/**
 * Returns where everything in a list sits, measured from the window's
 * top-left pixel. Both painting a list and pressing one read it, so they
 * always agree on what is where.
 */
export const computeListLayout = (widget: HudList): HudListLayout => {
  const rect = computeWidgetRect(widget);
  const scroll = computeListScroll(widget, widget.scroll);
  const capacity = computeListCapacity(widget, scroll);
  const lastPage = computeListLastPage(widget);
  const bar = toBarRect(rect);
  const track = {
    ...bar,
    row: bar.row + HUD_LIST_BAR_WIDTH,
    height: bar.height - 2 * HUD_LIST_BAR_WIDTH,
  };

  return {
    capacity,
    scroll,
    lastPage,
    items: toPlacements(rect, slice(widget.items, scroll, scroll + capacity)),
    up: { ...bar, height: HUD_LIST_BAR_WIDTH },
    down: {
      ...bar,
      row: bar.row + bar.height - HUD_LIST_BAR_WIDTH,
      height: HUD_LIST_BAR_WIDTH,
    },
    track,
    thumb: toThumbRect(track, capacity, size(widget.items), scroll, lastPage),
  };
};
