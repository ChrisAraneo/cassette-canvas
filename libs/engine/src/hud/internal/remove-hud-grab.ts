import type { Hud } from '../types/hud';

export const removeHudGrab = (hud: Hud): Hud => ({ ...hud, grab: undefined });
