import { reduceRight, size } from 'lodash-es';
import { match } from 'ts-pattern';
import type { HudList } from '../types/hud-list';
import type { HudListItem } from '../types/hud-list-item';
import { computeItemPitch } from './compute-item-pitch';
import { computeListRoom } from './compute-list-room';

interface LastPage {
  readonly start: number;
  readonly used: number;
  readonly full: boolean;
}

const addItem = (
  page: LastPage,
  index: number,
  pitch: number,
  room: number,
): LastPage =>
  match(!page.full && page.used + pitch <= room)
    .with(true, () => ({
      start: index,
      used: page.used + pitch,
      full: false,
    }))
    .otherwise(() => ({ ...page, full: true }));

/**
 * Returns the item the last page of a list starts at, which is as far as it
 * scrolls: 0 when every item it holds fits in it at once. The items are
 * counted from the last one up, so the last page is as full as it can be.
 */
export const computeListLastPage = (widget: HudList): number =>
  reduceRight(
    widget.items,
    (page: LastPage, item: HudListItem, index: number) =>
      addItem(page, index, computeItemPitch(item), computeListRoom(widget)),
    { start: size(widget.items), used: 0, full: false },
  ).start;
