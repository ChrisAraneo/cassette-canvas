import { findLast } from 'lodash-es';
import type { HudWindow } from '../types/hud-window';
import { canPress } from './can-press';
import { computeWidgetRect } from './compute-widget-rect';
import { containsPixel } from './contains-pixel';
import { toWindowWidgets } from './to-window-widgets';
import type { HudPlacedWidget } from './types/hud-placed-widget';

export const findPressedWidget = (
  window: HudWindow,
  row: number,
  column: number,
): HudPlacedWidget | undefined =>
  findLast(
    toWindowWidgets(window),
    (placed) =>
      canPress(placed) &&
      containsPixel(computeWidgetRect(placed.widget), row, column),
  );
