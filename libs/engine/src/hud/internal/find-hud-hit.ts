import { findLast } from 'lodash-es';
import { match, P } from 'ts-pattern';
import type { Hud } from '../types/hud';
import type { HudWindow } from '../types/hud-window';
import { computeCloseRect } from './compute-close-rect';
import { computeTitleRect } from './compute-title-rect';
import { computeWidgetRect } from './compute-widget-rect';
import { computeWindowRect } from './compute-window-rect';
import { isInside } from './is-inside';
import { toWindowWidgets } from './to-window-widgets';
import type { HudHit } from './types/hud-hit';
import type { HudPlacedWidget } from './types/hud-placed-widget';

const { nonNullable } = P;

/**
 * A widget that sits on an item of a list takes the pointer only when it is
 * a button. Anything else on an item lets the press through to the item
 * under it, so a label or a panel never costs an item its selection.
 */
const isPressable = ({ widget, item }: HudPlacedWidget): boolean =>
  item === '' || widget.kind === 'button';

const findShownWidget = (
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

const toWindowHit = (window: HudWindow, row: number, column: number): HudHit =>
  match({
    close: window.closable && isInside(computeCloseRect(window), row, column),
    title: isInside(computeTitleRect(window), row, column),
    widget: findShownWidget(window, row, column),
  })
    .with({ close: true }, (): HudHit => ({
      window: window.id,
      part: 'close',
      widget: '',
    }))
    .with({ widget: nonNullable }, ({ widget }): HudHit => ({
      window: window.id,
      part: 'widget',
      widget: widget.widget.id,
    }))
    .with({ title: true }, (): HudHit => ({
      window: window.id,
      part: 'title',
      widget: '',
    }))
    .otherwise((): HudHit => ({ window: window.id, part: 'body', widget: '' }));

/**
 * Returns what the logical pixel at `row` and `column` is over, or
 * `undefined` when it is over no window at all. Windows on top are tried
 * first, and within a window the close box comes before the widgets, the
 * widgets before the title bar, and a button on an item of a list before the
 * list it sits on.
 */
export const findHudHit = (
  hud: Hud,
  row: number,
  column: number,
): HudHit | undefined =>
  match(
    findLast(hud.windows, (window) =>
      isInside(computeWindowRect(window), row, column),
    ),
  )
    .with(nonNullable, (window) =>
      toWindowHit(window, row - window.row, column - window.column),
    )
    .otherwise(() => undefined);
