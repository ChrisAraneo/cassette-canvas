import { patchHudWidget } from '../patch-hud-widget';
import type { Hud } from '../types/hud';
import type { HudChange } from '../types/hud-change';
import type { HudGrab } from '../types/hud-grab';
import type { HudList } from '../types/hud-list';
import { computeListThumbScroll } from './compute-list-thumb-scroll';

export const toThumbScrolled = (
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
