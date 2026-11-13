import { match } from 'ts-pattern';
import { patchHudWindow } from '../patch-hud-window';
import type { Hud } from '../types/hud';
import type { HudChange } from '../types/hud-change';

/**
 * Handles a pointer move to a logical pixel. A window held by its title bar
 * follows, keeping the spot the pointer grabbed under the pointer. Nothing
 * else handles a move.
 */
export const moveHud = (hud: Hud, row: number, column: number): HudChange =>
  match(hud.grab)
    .with({ kind: 'drag' }, (grab): HudChange => ({
      hud: patchHudWindow(hud, grab.window, {
        row: row - grab.row,
        column: column - grab.column,
      }),
      actions: [],
    }))
    .otherwise((): HudChange => ({ hud, actions: [] }));
