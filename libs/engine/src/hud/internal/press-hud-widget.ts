import { findIndex } from 'lodash-es';
import { pipe } from 'remeda';
import { match, P } from 'ts-pattern';
import { findHudWidget } from '../find-hud-widget';
import { patchHudWindow } from '../patch-hud-window';
import type { Hud } from '../types/hud';
import type { HudChange } from '../types/hud-change';
import type { HudTab } from '../types/hud-tab';
import type { HudTabs } from '../types/hud-tabs';
import { computeTabRects } from './compute-tab-rects';
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

const openHudTab = (
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
      actions: [{ kind: 'tab', window, widget: widget.id, value: tab.id }],
    }))
    .otherwise((): HudChange => ({ hud, actions: [] }));

/**
 * The pointer went down on a widget. A button is taken hold of, a field
 * takes the keys, a tab opens its page, and a label does nothing. `row` and
 * `column` are measured from the window's top-left pixel.
 */
export const pressHudWidget = (
  hud: Hud,
  hit: HudHit,
  row: number,
  column: number,
): HudChange =>
  match(findHudWidget(hud, hit.window, hit.widget))
    .with({ kind: 'button' }, (button): HudChange => ({
      hud: {
        ...hud,
        focus: undefined,
        grab: {
          kind: 'press',
          window: hit.window,
          widget: button.id,
          row,
          column,
        },
      },
      actions: [],
    }))
    .with({ kind: 'input' }, (input): HudChange => ({
      hud: {
        ...hud,
        grab: undefined,
        focus: { window: hit.window, widget: input.id },
      },
      actions: [],
    }))
    .with({ kind: 'tabs' }, (strip) =>
      openHudTab(hud, hit.window, strip, row, column),
    )
    .otherwise(() => toIdleChange(hud));
