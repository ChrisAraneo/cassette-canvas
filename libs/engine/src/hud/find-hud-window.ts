import { find } from 'lodash-es';
import type { Hud } from './types/hud';
import type { HudWindow } from './types/hud-window';

/** Returns the window with the id, or `undefined` if there is none. */
export const findHudWindow = (hud: Hud, id: string): HudWindow | undefined =>
  find(hud.windows, (window) => window.id === id);
