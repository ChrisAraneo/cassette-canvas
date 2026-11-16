import { HUD_PADDING } from '../consts';
import type { HudListItem } from '../types/hud-list-item';
import type { HudRect } from '../types/hud-rect';
import { computeItemHeight } from './compute-item-height';
import { computeItemRow } from './compute-item-row';
import { computeItemWidth } from './compute-item-width';
import type { HudListPlacement } from './types/hud-list-placement';

export const addPlacement = (
  placed: readonly HudListPlacement[],
  item: HudListItem,
  rect: HudRect,
): readonly HudListPlacement[] => [
  ...placed,
  {
    item,
    rect: {
      row: computeItemRow(placed, rect),
      column: rect.column + HUD_PADDING,
      width: computeItemWidth(rect),
      height: computeItemHeight(item),
    },
  },
];
