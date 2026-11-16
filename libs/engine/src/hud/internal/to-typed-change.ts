import { patchHudWidget } from '../patch-hud-widget';
import type { Hud } from '../types/hud';
import type { HudChange } from '../types/hud-change';
import type { HudFocus } from '../types/hud-focus';

export const toTypedChange = (
  hud: Hud,
  focus: HudFocus,
  text: string,
): HudChange => ({
  hud: patchHudWidget(hud, focus.window, focus.widget, { text }),
  actions: [
    { kind: 'TYPE', window: focus.window, widget: focus.widget, value: text },
  ],
});
