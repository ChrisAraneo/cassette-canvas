import { map } from 'lodash-es';
import { match } from 'ts-pattern';
import type { HudWidgetChanges } from '../types/hud-widget-changes';
import type { HudWindow } from '../types/hud-window';
import { patchMatchingWidget } from './patch-matching-widget';

export const patchWindowWidgets = (
  window: HudWindow,
  id: string,
  widget: string,
  changes: HudWidgetChanges,
): HudWindow =>
  match(window.id === id)
    .with(true, () => ({
      ...window,
      widgets: map(window.widgets, (placed) =>
        patchMatchingWidget(placed, widget, changes),
      ),
    }))
    .otherwise(() => window);
