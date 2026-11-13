import { match } from 'ts-pattern';
import { moveHud } from './internal/move-hud';
import { pressHud } from './internal/press-hud';
import { releaseHud } from './internal/release-hud';
import { typeHud } from './internal/type-hud';
import type { Hud } from './types/hud';
import type { HudChange } from './types/hud-change';
import type { HudEvent } from './types/hud-event';

/**
 * Answers one thing the person did, and returns the HUD as it now is
 * together with what came of it.
 *
 * - `press` finds the window under the pointer, brings it to the top, and
 *   takes hold of a title bar, a button or a close box, gives the keys to a
 *   field, or opens a tab.
 * - `move` drags a window that is held by its title bar.
 * - `release` lets go, and gives a `click` or a `close` when the pointer is
 *   still over what it took hold of.
 * - `key` types into the field that has the keys.
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
