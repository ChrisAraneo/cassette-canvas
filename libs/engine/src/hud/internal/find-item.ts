import { find } from 'lodash-es';
import type { HudListItem } from '../types/hud-list-item';
import { containsPixel } from './contains-pixel';
import type { HudListLayout } from './types/hud-list-layout';

export const findItem = (
  layout: HudListLayout,
  row: number,
  column: number,
): HudListItem | undefined =>
  find(
    layout.items,
    (placement) =>
      placement.item.selectable && containsPixel(placement.rect, row, column),
  )?.item;
