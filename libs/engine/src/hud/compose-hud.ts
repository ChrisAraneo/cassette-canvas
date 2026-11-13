import { map } from 'lodash-es';
import type { OverlayPlacement } from '../overlay/types/overlay-placement';
import { composeHudWindow } from './internal/compose-hud-window';
import type { Hud } from './types/hud';

/**
 * Draws the HUD as one overlay per window, from the bottom window up, ready
 * to put on a screen. `addHud` does that for you.
 */
export const composeHud = (hud: Hud): readonly OverlayPlacement[] =>
  map(hud.windows, (window) => composeHudWindow(hud, window));
