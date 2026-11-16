import { reduceRight, size } from 'lodash-es';
import type { HudList } from '../types/hud-list';
import type { HudListItem } from '../types/hud-list-item';
import { computeItemPitch } from './compute-item-pitch';
import { computeListRoom } from './compute-list-room';
import { computePageWithItem } from './compute-page-with-item';
import type { HudListLastPage } from './types/hud-list-last-page';

/**
 * Returns the item the last page of a list starts at, which is as far as it
 * scrolls: 0 when every item it holds fits in it at once. The items are
 * counted from the last one up, so the last page is as full as it can be.
 */
export const computeListLastPage = (widget: HudList): number =>
  reduceRight(
    widget.items,
    (page: HudListLastPage, item: HudListItem, index: number) =>
      computePageWithItem(
        page,
        index,
        computeItemPitch(item),
        computeListRoom(widget),
      ),
    { start: size(widget.items), used: 0, full: false },
  ).start;
