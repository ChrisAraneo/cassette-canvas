import { findIndex } from 'lodash-es';
import { pipe } from 'remeda';
import type { HudTab } from '../types/hud-tab';
import type { HudTabs } from '../types/hud-tabs';
import { computeTabRects } from './compute-tab-rects';
import { isInside } from './is-inside';

export const findTab = (
  widget: HudTabs,
  row: number,
  column: number,
): HudTab | undefined =>
  pipe(
    computeTabRects(widget),
    (rects) => findIndex(rects, (rect) => isInside(rect, row, column)),
    (index) => widget.tabs[index],
  );
