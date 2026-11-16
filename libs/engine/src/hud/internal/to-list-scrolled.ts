import { patchHudWidget } from '../patch-hud-widget';
import type { Hud } from '../types/hud';
import type { HudChange } from '../types/hud-change';
import type { HudList } from '../types/hud-list';
import { computeListScroll } from './compute-list-scroll';

export const toListScrolled = (
  hud: Hud,
  window: string,
  widget: HudList,
  scroll: number,
): HudChange => ({
  hud: {
    ...patchHudWidget(hud, window, widget.id, {
      scroll: computeListScroll(widget, scroll),
    }),
    grab: undefined,
    focus: undefined,
  },
  actions: [],
});
