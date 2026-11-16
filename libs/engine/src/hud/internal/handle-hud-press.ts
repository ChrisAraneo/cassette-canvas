import { match, P } from 'ts-pattern';
import { findHudWindow } from '../find-hud-window';
import type { Hud } from '../types/hud';
import type { HudChange } from '../types/hud-change';
import { findHudHit } from './find-hud-hit';
import { handleWindowPart } from './handle-window-part';
import { patchTopWindow } from './patch-top-window';
import { toIdleChange } from './to-idle-change';

const { nonNullable } = P;

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
