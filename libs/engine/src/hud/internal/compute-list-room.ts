import { HUD_DIVIDER_HEIGHT, HUD_PADDING } from '../consts';
import type { HudList } from '../types/hud-list';

/**
 * Returns the rows a list leaves for the items it shows: its height without
 * the `HUD_PADDING` rows above the first item and below the last, and with
 * the divider the last item does not need added back, so an item fits when
 * it and the items above it take no more rows than this.
 */
export const computeListRoom = ({ height }: HudList): number =>
  Math.max(0, height - 2 * HUD_PADDING + HUD_DIVIDER_HEIGHT);
