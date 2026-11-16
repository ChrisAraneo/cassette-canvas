import { match } from 'ts-pattern';
import type { Hud } from '../types/hud';
import type { HudChange } from '../types/hud-change';
import type { HudGrab } from '../types/hud-grab';
import { findHudHit } from './find-hud-hit';
import { removeHudGrab } from './remove-hud-grab';

export const handleButtonRelease = (
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
