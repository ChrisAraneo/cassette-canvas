import { match } from 'ts-pattern';
import type { HudWidget } from '../types/hud-widget';
import type { HudWidgetChanges } from '../types/hud-widget-changes';
import { patchWidget } from './patch-widget';

export const patchMatchingWidget = (
  widget: HudWidget,
  id: string,
  changes: HudWidgetChanges,
): HudWidget =>
  match(widget.id === id)
    .with(true, () => patchWidget(widget, changes))
    .otherwise(() => widget);
