import { map } from 'lodash-es';
import { toPlacedWidget } from './to-placed-widget';
import type { HudListPlacement } from './types/hud-list-placement';
import type { HudPlacedWidget } from './types/hud-placed-widget';

export const toItemWidgets = (
  placement: HudListPlacement,
): readonly HudPlacedWidget[] =>
  map(placement.item.widgets, (widget) => ({
    widget: toPlacedWidget(widget, placement.rect),
    item: placement.item.id,
  }));
