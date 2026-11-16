import { map, max } from 'lodash-es';
import { match } from 'ts-pattern';
import type { HudListItem } from '../types/hud-list-item';
import { toLinesHeight } from './to-lines-height';
import { toWidgetBottom } from './to-widget-bottom';

/**
 * Returns how many rows one item of a list takes: the height it asks for,
 * or, when it asks for none, as many rows as its lines of text and the
 * widgets that sit on it need.
 */
export const computeItemHeight = (item: HudListItem): number =>
  match(item.height > 0)
    .with(true, () => item.height)
    .otherwise(
      () =>
        max([toLinesHeight(item), ...map(item.widgets, toWidgetBottom)]) ?? 0,
    );
