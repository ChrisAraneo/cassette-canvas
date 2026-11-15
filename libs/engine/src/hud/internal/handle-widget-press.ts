import { findIndex } from 'lodash-es';
import { pipe } from 'remeda';
import { match, P } from 'ts-pattern';
import { patchHudWindow } from '../patch-hud-window';
import type { Hud } from '../types/hud';
import type { HudChange } from '../types/hud-change';
import type { HudTab } from '../types/hud-tab';
import type { HudTabs } from '../types/hud-tabs';
import { computeTabRects } from './compute-tab-rects';
import { findShownWidget } from './find-shown-widget';
import { handleListPress } from './handle-list-press';
import { isInside } from './is-inside';
import { toIdleChange } from './to-idle-change';
import type { HudHit } from './types/hud-hit';

const { nonNullable } = P;

const findTab = (
  widget: HudTabs,
  row: number,
  column: number,
): HudTab | undefined =>
  pipe(
    computeTabRects(widget),
    (rects) => findIndex(rects, (rect) => isInside(rect, row, column)),
    (index) => widget.tabs[index],
  );

const patchHudPage = (
  hud: Hud,
  window: string,
  widget: HudTabs,
  row: number,
  column: number,
): HudChange =>
  match(findTab(widget, row, column))
    .with(nonNullable, (tab): HudChange => ({
      hud: {
        ...patchHudWindow(hud, window, { page: tab.id }),
        grab: undefined,
        focus: undefined,
      },
      actions: [{ kind: 'TAB', window, widget: widget.id, value: tab.id }],
    }))
    .otherwise((): HudChange => ({ hud, actions: [] }));

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
