import { findLast } from 'lodash-es';
import { match, P } from 'ts-pattern';
import type { Hud } from '../types/hud';
import type { HudWidget } from '../types/hud-widget';
import type { HudWindow } from '../types/hud-window';
import { computeCloseRect } from './compute-close-rect';
import { computeTitleRect } from './compute-title-rect';
import { computeWidgetRect } from './compute-widget-rect';
import { computeWindowRect } from './compute-window-rect';
import { filterPageWidgets } from './filter-page-widgets';
import { isInside } from './is-inside';
import type { HudHit } from './types/hud-hit';

const { nonNullable } = P;

const findPageWidget = (
  window: HudWindow,
  row: number,
  column: number,
): HudWidget | undefined =>
  findLast(filterPageWidgets(window), (widget) =>
    isInside(computeWidgetRect(widget), row, column),
  );

const toWindowHit = (window: HudWindow, row: number, column: number): HudHit =>
  match({
    close: window.closable && isInside(computeCloseRect(window), row, column),
    title: isInside(computeTitleRect(window), row, column),
    widget: findPageWidget(window, row, column),
  })
    .with({ close: true }, (): HudHit => ({
      window: window.id,
      part: 'close',
      widget: '',
    }))
    .with({ widget: nonNullable }, ({ widget }): HudHit => ({
      window: window.id,
      part: 'widget',
      widget: widget.id,
    }))
    .with({ title: true }, (): HudHit => ({
      window: window.id,
      part: 'title',
      widget: '',
    }))
    .otherwise((): HudHit => ({ window: window.id, part: 'body', widget: '' }));

/**
 * What the logical pixel at `row` and `column` is over, or `undefined` when
 * it is over no window at all. Windows on top are tried first, and within a
 * window the close box comes before the widgets and the widgets before the
 * title bar.
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
