import { match } from 'ts-pattern';
import { patchHudWindow } from '../patch-hud-window';
import type { Hud } from '../types/hud';
import type { HudChange } from '../types/hud-change';
import { computeWindowPlace } from './compute-window-place';
import { patchListScroll } from './patch-list-scroll';

/**
 * Handles a pointer move to a logical pixel. A window held by its title bar
 * follows, keeping the spot the pointer grabbed under the pointer, and stops
 * at the edges of the HUD's screen. A list whose thumb is held scrolls with
 * the thumb. Nothing else handles a move.
 */
export const handleHudMove = (
  hud: Hud,
  row: number,
  column: number,
): HudChange =>
  match(hud.grab)
    .with({ kind: 'DRAG' }, (grab): HudChange => ({
      hud: patchHudWindow(
        hud,
        grab.window,
        computeWindowPlace(
          hud,
          grab.window,
          row - grab.row,
          column - grab.column,
        ),
      ),
      actions: [],
    }))
    .with({ kind: 'SCROLL' }, (grab) => patchListScroll(hud, grab, row))
    .otherwise((): HudChange => ({ hud, actions: [] }));
