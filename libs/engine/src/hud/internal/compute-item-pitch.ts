import { HUD_DIVIDER_HEIGHT } from '../consts';
import type { HudListItem } from '../types/hud-list-item';
import { computeItemHeight } from './compute-item-height';

/**
 * Returns how many rows one item of a list takes with the divider under it,
 * which is where the item below it starts.
 */
export const computeItemPitch = (item: HudListItem): number =>
  computeItemHeight(item) + HUD_DIVIDER_HEIGHT;
