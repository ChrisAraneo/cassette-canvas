import { match, P } from 'ts-pattern';
import { findHudWindow } from '../find-hud-window';
import type { Hud } from '../types/hud';
import type { HudChange } from '../types/hud-change';
import type { HudWindow } from '../types/hud-window';
import { findHudHit } from './find-hud-hit';
import { handleWidgetPress } from './handle-widget-press';
import { patchTopWindow } from './patch-top-window';
import { toIdleChange } from './to-idle-change';
import type { HudHit } from './types/hud-hit';

const { nonNullable } = P;

const handleWindowPart = (
  hud: Hud,
  window: HudWindow,
  hit: HudHit,
  row: number,
  column: number,
): HudChange =>
  match(hit.part)
    .with('CLOSE', (): HudChange => ({
      hud: {
        ...hud,
        focus: undefined,
        grab: {
          kind: 'CLOSE',
          window: window.id,
          widget: '',
          row,
          column,
        },
      },
      actions: [],
    }))
    .with('TITLE', (): HudChange => ({
      hud: {
        ...hud,
        focus: undefined,
        grab: {
          kind: 'DRAG',
          window: window.id,
          widget: '',
          row,
          column,
        },
      },
      actions: [],
    }))
    .with('WIDGET', () => handleWidgetPress(hud, hit, row, column))
    .otherwise(() => toIdleChange(hud));

/**
 * Handles a pointer press at a logical pixel. The window it finds comes to
 * the top, and then the part under the pointer handles the press. A press
 * over no window at all drops the grab and the focus.
 */
export const handleHudPress = (
  hud: Hud,
  row: number,
  column: number,
): HudChange =>
  match(findHudHit(hud, row, column))
    .with(nonNullable, (hit) =>
      match(findHudWindow(hud, hit.window))
        .with(nonNullable, (window) =>
          handleWindowPart(
            patchTopWindow(hud, hit.window),
            window,
            hit,
            row - window.row,
            column - window.column,
          ),
        )
        .otherwise(() => toIdleChange(hud)),
    )
    .otherwise(() => toIdleChange(hud));
