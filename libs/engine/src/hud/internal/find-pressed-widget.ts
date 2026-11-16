import { findLast } from 'lodash-es';
import type { HudWindow } from '../types/hud-window';
import { computeWidgetRect } from './compute-widget-rect';
import { isInside } from './is-inside';
import { isPressable } from './is-pressable';
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
      isPressable(placed) &&
      isInside(computeWidgetRect(placed.widget), row, column),
  );
