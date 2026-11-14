import { match } from 'ts-pattern';
import { patchHudWindow } from '../patch-hud-window';
import type { Hud } from '../types/hud';
import type { HudChange } from '../types/hud-change';
import { clampWindowPlace } from './clamp-window-place';
import { dragHudList } from './drag-hud-list';

/**
 * Handles a pointer move to a logical pixel. A window held by its title bar
 * follows, keeping the spot the pointer grabbed under the pointer, and stops
 * at the edges of the HUD's screen. A list whose thumb is held scrolls with
 * the thumb. Nothing else handles a move.
 */
export const moveHud = (hud: Hud, row: number, column: number): HudChange =>
  match(hud.grab)
    .with({ kind: 'drag' }, (grab): HudChange => ({
      hud: patchHudWindow(
        hud,
        grab.window,
        clampWindowPlace(
          hud,
          grab.window,
          row - grab.row,
          column - grab.column,
        ),
      ),
      actions: [],
    }))
    .with({ kind: 'scroll' }, (grab) => dragHudList(hud, grab, row))
    .otherwise((): HudChange => ({ hud, actions: [] }));
