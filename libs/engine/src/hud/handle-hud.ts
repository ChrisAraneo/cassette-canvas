import { match } from 'ts-pattern';
import { handleHudKey } from './internal/handle-hud-key';
import { handleHudMove } from './internal/handle-hud-move';
import { handleHudPress } from './internal/handle-hud-press';
import { handleHudRelease } from './internal/handle-hud-release';
import type { Hud } from './types/hud';
import type { HudChange } from './types/hud-change';
import type { HudEvent } from './types/hud-event';

/**
 * Handles one event and returns the HUD as it now is, together with the
 * actions it caused.
 *
 * - `PRESS` finds the window under the pointer, brings it to the top, and
 *   grabs a title bar, a button, a close box, or the thumb on a list's
 *   scroll bar, sets the focus on a field, opens a tab, or scrolls a list or
 *   selects an item in one.
 * - `MOVE` drags a window that is held by its title bar, and stops it at the
 *   edges of the HUD's screen, or scrolls a list whose thumb is held.
 * - `RELEASE` drops the grab, and returns a `CLICK` or a `CLOSE` when the
 *   pointer is still over what it grabbed.
 * - `KEY` types into the focused field.
 *
 * Nothing about the HUD changes unless the event asks for it, and the HUD
 * you pass in is never changed.
 */
export const handleHud = (hud: Hud, event: HudEvent): HudChange =>
  match(event)
    .with({ kind: 'PRESS' }, ({ row, column }) =>
      handleHudPress(hud, row, column),
    )
    .with({ kind: 'MOVE' }, ({ row, column }) =>
      handleHudMove(hud, row, column),
    )
    .with({ kind: 'RELEASE' }, ({ row, column }) =>
      handleHudRelease(hud, row, column),
    )
    .with({ kind: 'KEY' }, ({ key }) => handleHudKey(hud, key))
    .exhaustive();
