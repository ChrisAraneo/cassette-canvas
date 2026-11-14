import { clamp } from 'lodash-es';
import { match, P } from 'ts-pattern';
import { findHudWindow } from '../find-hud-window';
import type { Hud } from '../types/hud';
import type { HudWindowChanges } from '../types/hud-window-changes';

const { nonNullable } = P;

/**
 * Returns where a window may go: the place asked for, kept inside the HUD's
 * screen so that no edge of the window leaves it. A HUD with no size, and a
 * window that is not there, keep the place they are given, and a window
 * larger than the screen is pinned to its top-left pixel.
 */
export const clampWindowPlace = (
  hud: Hud,
  id: string,
  row: number,
  column: number,
): HudWindowChanges =>
  match({ size: hud.size, window: findHudWindow(hud, id) })
    .with(
      { size: nonNullable, window: nonNullable },
      ({ size, window }): HudWindowChanges => ({
        row: clamp(row, 0, Math.max(0, size.height - window.height)),
        column: clamp(column, 0, Math.max(0, size.width - window.width)),
      }),
    )
    .otherwise((): HudWindowChanges => ({ row, column }));
