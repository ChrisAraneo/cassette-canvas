import { match } from 'ts-pattern';
import type { Hud } from '../types/hud';
import type { HudChange } from '../types/hud-change';
import { findShownWidget } from './find-shown-widget';
import { handleListPress } from './handle-list-press';
import { patchHudPage } from './patch-hud-page';
import { toIdleChange } from './to-idle-change';
import type { HudHit } from './types/hud-hit';

/**
 * Handles a pointer press on a widget: it grabs a button, wherever the
 * button sits, sets the focus on a field, opens a tab's page, scrolls or
 * selects in a list, and does nothing for a label, a panel, or a divider.
 * `row` and `column` are measured from the window's top-left pixel.
 */
export const handleWidgetPress = (
  hud: Hud,
  hit: HudHit,
  row: number,
  column: number,
): HudChange =>
  match(findShownWidget(hud, hit.window, hit.widget))
    .with({ kind: 'BUTTON' }, (button): HudChange => ({
      hud: {
        ...hud,
        focus: undefined,
        grab: {
          kind: 'PRESS',
          window: hit.window,
          widget: button.id,
          row,
          column,
        },
      },
      actions: [],
    }))
    .with({ kind: 'INPUT' }, (input): HudChange => ({
      hud: {
        ...hud,
        grab: undefined,
        focus: { window: hit.window, widget: input.id },
      },
      actions: [],
    }))
    .with({ kind: 'TABS' }, (strip) =>
      patchHudPage(hud, hit.window, strip, row, column),
    )
    .with({ kind: 'LIST' }, (list) =>
      handleListPress(hud, hit.window, list, row, column),
    )
    .otherwise(() => toIdleChange(hud));
