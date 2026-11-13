import type { Hud } from '../types/hud';
import type { HudChange } from '../types/hud-change';

/** Returns the HUD with no grab and no focus, and no actions. */
export const toIdleChange = (hud: Hud): HudChange => ({
  hud: { ...hud, grab: undefined, focus: undefined },
  actions: [],
});
