import { match, P } from 'ts-pattern';
import { findHudWidget } from '../find-hud-widget';
import { findHudWindow } from '../find-hud-window';
import { patchHudWidget } from '../patch-hud-widget';
import type { Hud } from '../types/hud';
import type { HudChange } from '../types/hud-change';
import type { HudGrab } from '../types/hud-grab';
import type { HudList } from '../types/hud-list';
import { computeListThumbScroll } from './compute-list-thumb-scroll';

const { nonNullable } = P;

const toScrolled = (
  hud: Hud,
  grab: HudGrab,
  widget: HudList,
  top: number,
): HudChange => ({
  hud: patchHudWidget(hud, grab.window, grab.widget, {
    scroll: computeListThumbScroll(widget, top),
  }),
  actions: [],
});

/**
 * Scrolls the list whose thumb the pointer is holding, so the spot the
 * pointer grabbed stays under it: `row` is where the pointer is on the
 * screen, and the grab carries where inside the thumb it took hold. The
 * scroll stops at the first item and at the last page, so the thumb never
 * leaves its track.
 */
export const dragHudList = (hud: Hud, grab: HudGrab, row: number): HudChange =>
  match({
    window: findHudWindow(hud, grab.window),
    widget: findHudWidget(hud, grab.window, grab.widget),
  })
    .with(
      { window: nonNullable, widget: { kind: 'list' } },
      ({ window, widget }) =>
        toScrolled(hud, grab, widget, row - window.row - grab.row),
    )
    .otherwise((): HudChange => ({ hud, actions: [] }));
