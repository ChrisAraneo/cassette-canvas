import { size, slice } from 'lodash-es';
import type { HudList } from '../types/hud-list';
import { computeBarRect } from './compute-bar-rect';
import { computeDownRect } from './compute-down-rect';
import { computeListLastPage } from './compute-list-last-page';
import { computeListScroll } from './compute-list-scroll';
import { computeThumbRect } from './compute-thumb-rect';
import { computeTrackRect } from './compute-track-rect';
import { computeUpRect } from './compute-up-rect';
import { computeWidgetRect } from './compute-widget-rect';
import { countListCapacity } from './count-list-capacity';
import { toPlacements } from './to-placements';
import type { HudListLayout } from './types/hud-list-layout';

/**
 * Returns where everything in a list sits, measured from the window's
 * top-left pixel. Both painting a list and pressing one read it, so they
 * always agree on what is where.
 */
export const computeListLayout = (widget: HudList): HudListLayout => {
  const rect = computeWidgetRect(widget);
  const scroll = computeListScroll(widget, widget.scroll);
  const capacity = countListCapacity(widget, scroll);
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
