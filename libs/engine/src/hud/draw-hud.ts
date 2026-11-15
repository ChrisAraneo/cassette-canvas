import { map } from 'lodash-es';
import type { OverlayPlacement } from '../screen/types/overlay-placement';
import { drawHudWindow } from './internal/draw-hud-window';
import type { Hud } from './types/hud';

/**
 * Draws the HUD as one overlay per window, from the bottom window up, ready
 * to put on a screen. `addHud` does that for you.
 */
export const drawHud = (hud: Hud): readonly OverlayPlacement[] =>
  map(hud.windows, (window) => drawHudWindow(hud, window));
