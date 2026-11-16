import { match, P } from 'ts-pattern';
import { findHudWidget } from '../find-hud-widget';
import { findHudWindow } from '../find-hud-window';
import type { Hud } from '../types/hud';
import type { HudChange } from '../types/hud-change';
import type { HudGrab } from '../types/hud-grab';
import { toThumbScrolled } from './to-thumb-scrolled';

const { nonNullable } = P;

/**
 * Scrolls the list whose thumb the pointer is holding, so the spot the
 * pointer grabbed stays under it: `row` is where the pointer is on the
 * screen, and the grab carries where inside the thumb it took hold. The
 * scroll stops at the first item and at the last page, so the thumb never
 * leaves its track.
 */
export const patchListScroll = (
  hud: Hud,
  grab: HudGrab,
  row: number,
): HudChange =>
  match({
    window: findHudWindow(hud, grab.window),
    widget: findHudWidget(hud, grab.window, grab.widget),
  })
    .with(
      { window: nonNullable, widget: { kind: 'LIST' } },
      ({ window, widget }) =>
        toThumbScrolled(hud, grab, widget, row - window.row - grab.row),
    )
    .otherwise((): HudChange => ({ hud, actions: [] }));
