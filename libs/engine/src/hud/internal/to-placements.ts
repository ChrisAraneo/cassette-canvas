import { reduce } from 'lodash-es';
import type { HudListItem } from '../types/hud-list-item';
import type { HudRect } from '../types/hud-rect';
import { addPlacement } from './add-placement';
import type { HudListPlacement } from './types/hud-list-placement';

const NO_PLACEMENTS: readonly HudListPlacement[] = Object.freeze([]);

export const toPlacements = (
  items: readonly HudListItem[],
  rect: HudRect,
): readonly HudListPlacement[] =>
  reduce(
    items,
    (placed: readonly HudListPlacement[], item: HudListItem) =>
      addPlacement(placed, item, rect),
    NO_PLACEMENTS,
  );
