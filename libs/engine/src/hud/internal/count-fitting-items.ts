import { reduce } from 'lodash-es';
import { match } from 'ts-pattern';
import type { HudListItem } from '../types/hud-list-item';
import { computeItemPitch } from './compute-item-pitch';

interface ItemFit {
  readonly count: number;
  readonly used: number;
  readonly full: boolean;
}

const START: ItemFit = Object.freeze({ count: 0, used: 0, full: false });

const addItem = (fit: ItemFit, pitch: number, room: number): ItemFit =>
  match(!fit.full && fit.used + pitch <= room)
    .with(true, () => ({
      count: fit.count + 1,
      used: fit.used + pitch,
      full: false,
    }))
    .otherwise(() => ({ ...fit, full: true }));

/**
 * Returns how many of the items it is given fit in `room` rows, counting
 * from the first one: each item takes the rows it asks for and the divider
 * under it, and the first item that does not fit whole ends the count, so
 * the items after it are left for the next page.
 */
export const countFittingItems = (
  items: readonly HudListItem[],
  room: number,
): number =>
  reduce(
    items,
    (fit: ItemFit, item: HudListItem) =>
      addItem(fit, computeItemPitch(item), room),
    START,
  ).count;
