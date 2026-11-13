import type { Hud } from '../types/hud';
import type { HudChange } from '../types/hud-change';

/** The HUD with nothing held and nothing taking the keys, and no actions. */
export const toIdleChange = (hud: Hud): HudChange => ({
  hud: { ...hud, grab: undefined, focus: undefined },
  actions: [],
});
