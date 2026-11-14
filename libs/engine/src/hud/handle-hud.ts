import { match } from 'ts-pattern';
import { moveHud } from './internal/move-hud';
import { pressHud } from './internal/press-hud';
import { releaseHud } from './internal/release-hud';
import { typeHud } from './internal/type-hud';
import type { Hud } from './types/hud';
import type { HudChange } from './types/hud-change';
import type { HudEvent } from './types/hud-event';

/**
 * Handles one event and returns the HUD as it now is, together with the
 * actions it caused.
 *
 * - `press` finds the window under the pointer, brings it to the top, and
 *   grabs a title bar, a button, a close box, or the thumb on a list's
 *   scroll bar, sets the focus on a field, opens a tab, or scrolls a list or
 *   selects an item in one.
 * - `move` drags a window that is held by its title bar, and stops it at the
 *   edges of the HUD's screen, or scrolls a list whose thumb is held.
 * - `release` drops the grab, and returns a `click` or a `close` when the
 *   pointer is still over what it grabbed.
 * - `key` types into the focused field.
 *
 * Nothing about the HUD changes unless the event asks for it, and the HUD
 * you pass in is never changed.
 */
export const handleHud = (hud: Hud, event: HudEvent): HudChange =>
  match(event)
    .with({ kind: 'press' }, ({ row, column }) => pressHud(hud, row, column))
    .with({ kind: 'move' }, ({ row, column }) => moveHud(hud, row, column))
    .with({ kind: 'release' }, ({ row, column }) =>
      releaseHud(hud, row, column),
    )
    .with({ kind: 'key' }, ({ key }) => typeHud(hud, key))
    .exhaustive();
