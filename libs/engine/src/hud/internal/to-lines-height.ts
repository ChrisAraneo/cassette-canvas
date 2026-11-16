import { size } from 'lodash-es';
import { HUD_LIST_ITEM_HEIGHT } from '../consts';
import type { HudListItem } from '../types/hud-list-item';

export const toLinesHeight = (item: HudListItem): number =>
  Math.max(1, size(item.lines)) * HUD_LIST_ITEM_HEIGHT;
