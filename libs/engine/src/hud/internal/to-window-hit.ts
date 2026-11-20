import { match, P } from 'ts-pattern';
import type { HudWindow } from '../types/hud-window';
import { computeCloseRect } from './compute-close-rect';
import { computeTitleRect } from './compute-title-rect';
import { containsPixel } from './contains-pixel';
import { findPressedWidget } from './find-pressed-widget';
import type { HudHit } from './types/hud-hit';

const { nonNullable } = P;

export const toWindowHit = (
  window: HudWindow,
  row: number,
  column: number,
): HudHit =>
  match({
    close:
      window.closable && containsPixel(computeCloseRect(window), row, column),
    title: containsPixel(computeTitleRect(window), row, column),
    widget: findPressedWidget(window, row, column),
  })
    .with({ close: true }, (): HudHit => ({
      window: window.id,
      part: 'CLOSE',
      widget: '',
    }))
    .with({ widget: nonNullable }, ({ widget }): HudHit => ({
      window: window.id,
      part: 'WIDGET',
      widget: widget.widget.id,
    }))
    .with({ title: true }, (): HudHit => ({
      window: window.id,
      part: 'TITLE',
      widget: '',
    }))
    .otherwise((): HudHit => ({ window: window.id, part: 'BODY', widget: '' }));
