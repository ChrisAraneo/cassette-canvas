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

const computeBarRect = (rect: HudRect): HudRect => ({
  row: rect.row + HUD_EDGE,
  column: rect.column + rect.width - HUD_EDGE - HUD_LIST_BAR_WIDTH,
  width: HUD_LIST_BAR_WIDTH,
  height: rect.height - 2 * HUD_EDGE,
});

const computeItemRow = (
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

const computeItemWidth = (rect: HudRect): number =>
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
      row: computeItemRow(rect, placed),
      column: rect.column + HUD_PADDING,
      width: computeItemWidth(rect),
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

const computeTrackRect = (bar: HudRect): HudRect => ({
  ...bar,
  row: bar.row + HUD_LIST_BAR_WIDTH,
  height: bar.height - 2 * HUD_LIST_BAR_WIDTH,
});

const computeUpRect = (bar: HudRect): HudRect => ({
  ...bar,
  height: HUD_LIST_BAR_WIDTH,
});

const computeDownRect = (bar: HudRect): HudRect => ({
  ...bar,
  row: bar.row + bar.height - HUD_LIST_BAR_WIDTH,
  height: HUD_LIST_BAR_WIDTH,
});

const computeThumbHeight = (
  track: HudRect,
  capacity: number,
  total: number,
): number =>
  Math.max(HUD_LIST_THUMB_HEIGHT, floor((track.height * capacity) / total));

const computeScrolledThumb = (
  track: HudRect,
  height: number,
  scroll: number,
  lastPage: number,
): HudRect => ({
  ...track,
  row: track.row + floor(((track.height - height) * scroll) / lastPage),
  height,
});

const computeThumbRect = (
  track: HudRect,
  capacity: number,
  total: number,
  scroll: number,
  lastPage: number,
): HudRect =>
  match(lastPage <= 0 || track.height < HUD_LIST_THUMB_HEIGHT)
    .with(true, () => ({ ...track, height: 0 }))
    .otherwise(() =>
      computeScrolledThumb(
        track,
        computeThumbHeight(track, capacity, total),
        scroll,
        lastPage,
      ),
    );

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
  const bar = computeBarRect(rect);
  const track = computeTrackRect(bar);

  return {
    capacity,
    scroll,
    lastPage,
    items: toPlacements(rect, slice(widget.items, scroll, scroll + capacity)),
    up: computeUpRect(bar),
    down: computeDownRect(bar),
    track,
    thumb: computeThumbRect(
      track,
      capacity,
      size(widget.items),
      scroll,
      lastPage,
    ),
  };
};
