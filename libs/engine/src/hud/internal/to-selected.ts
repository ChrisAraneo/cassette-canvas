import { patchHudWidget } from '../patch-hud-widget';
import type { Hud } from '../types/hud';
import type { HudChange } from '../types/hud-change';
import type { HudList } from '../types/hud-list';
import type { HudListItem } from '../types/hud-list-item';

export const toSelected = (
  hud: Hud,
  window: string,
  widget: HudList,
  item: HudListItem,
): HudChange => ({
  hud: {
    ...patchHudWidget(hud, window, widget.id, { selected: item.id }),
    grab: undefined,
    focus: undefined,
  },
  actions: [{ kind: 'SELECT', window, widget: widget.id, value: item.id }],
});
