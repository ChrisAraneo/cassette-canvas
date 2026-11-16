import { findItem } from './find-item';
import { isInside } from './is-inside';
import type { HudListLayout } from './types/hud-list-layout';
import type { HudListPress } from './types/hud-list-press';

export const toListPress = (
  layout: HudListLayout,
  row: number,
  column: number,
): HudListPress => ({
  up: isInside(layout.up, row, column),
  down: isInside(layout.down, row, column),
  thumb: isInside(layout.thumb, row, column),
  item: findItem(layout, row, column),
});
