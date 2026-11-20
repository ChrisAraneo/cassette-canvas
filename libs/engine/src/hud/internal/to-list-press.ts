import { containsPixel } from './contains-pixel';
import { findItem } from './find-item';
import type { HudListLayout } from './types/hud-list-layout';
import type { HudListPress } from './types/hud-list-press';

export const toListPress = (
  layout: HudListLayout,
  row: number,
  column: number,
): HudListPress => ({
  up: containsPixel(layout.up, row, column),
  down: containsPixel(layout.down, row, column),
  thumb: containsPixel(layout.thumb, row, column),
  item: findItem(layout, row, column),
});
