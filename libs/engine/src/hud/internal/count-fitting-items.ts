import { reduce } from 'lodash-es';
import type { HudListItem } from '../types/hud-list-item';
import { computeFitWithItem } from './compute-fit-with-item';
import { computeItemPitch } from './compute-item-pitch';
import type { HudListItemFit } from './types/hud-list-item-fit';

const START: HudListItemFit = Object.freeze({ count: 0, used: 0, full: false });

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
    (fit: HudListItemFit, item: HudListItem) =>
      computeFitWithItem(fit, computeItemPitch(item), room),
    START,
  ).count;
