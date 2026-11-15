import { match } from 'ts-pattern';
import { removeHudWindow } from '../remove-hud-window';
import type { Hud } from '../types/hud';
import type { HudChange } from '../types/hud-change';
import type { HudGrab } from '../types/hud-grab';
import { findHudHit } from './find-hud-hit';

const removeHudGrab = (hud: Hud): Hud => ({ ...hud, grab: undefined });

const handleButtonRelease = (
  hud: Hud,
  grab: HudGrab,
  row: number,
  column: number,
): HudChange =>
  match(findHudHit(hud, row, column))
    .with(
      { window: grab.window, part: 'WIDGET', widget: grab.widget },
      (): HudChange => ({
        hud: removeHudGrab(hud),
        actions: [
          {
            kind: 'CLICK',
            window: grab.window,
            widget: grab.widget,
            value: '',
          },
        ],
      }),
    )
    .otherwise((): HudChange => ({ hud: removeHudGrab(hud), actions: [] }));

const handleCloseRelease = (
  hud: Hud,
  grab: HudGrab,
  row: number,
  column: number,
): HudChange =>
  match(findHudHit(hud, row, column))
    .with({ window: grab.window, part: 'CLOSE' }, (): HudChange => ({
      hud: removeHudWindow(removeHudGrab(hud), grab.window),
      actions: [{ kind: 'CLOSE', window: grab.window, widget: '', value: '' }],
    }))
    .otherwise((): HudChange => ({ hud: removeHudGrab(hud), actions: [] }));

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
