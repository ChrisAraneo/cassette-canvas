import { match } from 'ts-pattern';
import { removeHudWindow } from '../remove-hud-window';
import type { Hud } from '../types/hud';
import type { HudChange } from '../types/hud-change';
import type { HudGrab } from '../types/hud-grab';
import { findHudHit } from './find-hud-hit';
import { removeHudGrab } from './remove-hud-grab';

export const handleCloseRelease = (
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
