import { match } from 'ts-pattern';
import type { HudWidget } from '../types/hud-widget';
import { toListWidgets } from './to-list-widgets';
import type { HudPlacedWidget } from './types/hud-placed-widget';

export const toShownWidgets = (widget: HudWidget): readonly HudPlacedWidget[] =>
  match(widget)
    .with({ kind: 'LIST' }, toListWidgets)
    .otherwise((): readonly HudPlacedWidget[] => [{ widget, item: '' }]);
