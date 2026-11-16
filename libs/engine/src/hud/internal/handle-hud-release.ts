import { match } from 'ts-pattern';
import type { Hud } from '../types/hud';
import type { HudChange } from '../types/hud-change';
import { handleButtonRelease } from './handle-button-release';
import { handleCloseRelease } from './handle-close-release';
import { removeHudGrab } from './remove-hud-grab';

/**
 * Handles a pointer release at a logical pixel. A button that is still under
 * the pointer returns a `CLICK`, and a close box that is still under it
 * closes its window and returns a `CLOSE`. A thumb that was dragged is
 * simply let go. Either way the HUD drops the grab.
 */
export const handleHudRelease = (
  hud: Hud,
  row: number,
  column: number,
): HudChange =>
  match(hud.grab)
    .with({ kind: 'PRESS' }, (grab) =>
      handleButtonRelease(hud, grab, row, column),
    )
    .with({ kind: 'CLOSE' }, (grab) =>
      handleCloseRelease(hud, grab, row, column),
    )
    .otherwise((): HudChange => ({ hud: removeHudGrab(hud), actions: [] }));
