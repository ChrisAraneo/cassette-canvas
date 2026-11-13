import { match } from 'ts-pattern';
import { removeHudWindow } from '../remove-hud-window';
import type { Hud } from '../types/hud';
import type { HudChange } from '../types/hud-change';
import type { HudGrab } from '../types/hud-grab';
import { findHudHit } from './find-hud-hit';

const letGo = (hud: Hud): Hud => ({ ...hud, grab: undefined });

const releasePress = (
  hud: Hud,
  grab: HudGrab,
  row: number,
  column: number,
): HudChange =>
  match(findHudHit(hud, row, column))
    .with(
      { window: grab.window, part: 'widget', widget: grab.widget },
      (): HudChange => ({
        hud: letGo(hud),
        actions: [
          {
            kind: 'click',
            window: grab.window,
            widget: grab.widget,
            value: '',
          },
        ],
      }),
    )
    .otherwise((): HudChange => ({ hud: letGo(hud), actions: [] }));

const releaseClose = (
  hud: Hud,
  grab: HudGrab,
  row: number,
  column: number,
): HudChange =>
  match(findHudHit(hud, row, column))
    .with({ window: grab.window, part: 'close' }, (): HudChange => ({
      hud: removeHudWindow(letGo(hud), grab.window),
      actions: [{ kind: 'close', window: grab.window, widget: '', value: '' }],
    }))
    .otherwise((): HudChange => ({ hud: letGo(hud), actions: [] }));

/**
 * Handles a pointer release at a logical pixel. A button that is still under
 * the pointer returns a `click`, and a close box that is still under it
 * closes its window and returns a `close`. Either way the HUD drops the grab.
 */
export const releaseHud = (hud: Hud, row: number, column: number): HudChange =>
  match(hud.grab)
    .with({ kind: 'press' }, (grab) => releasePress(hud, grab, row, column))
    .with({ kind: 'close' }, (grab) => releaseClose(hud, grab, row, column))
    .otherwise((): HudChange => ({ hud: letGo(hud), actions: [] }));
