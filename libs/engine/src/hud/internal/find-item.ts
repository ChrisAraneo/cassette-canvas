import { find } from 'lodash-es';
import type { HudListItem } from '../types/hud-list-item';
import { isInside } from './is-inside';
import type { HudListLayout } from './types/hud-list-layout';

export const findItem = (
  layout: HudListLayout,
  row: number,
  column: number,
): HudListItem | undefined =>
  find(
    layout.items,
    (placement) =>
      placement.item.selectable && isInside(placement.rect, row, column),
  )?.item;
