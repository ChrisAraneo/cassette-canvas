import { addHudWindow, createHud, type Hud } from '@cassette-canvas/engine';
import { NOTE_WINDOW_SETTINGS, STREET_WINDOW_SETTINGS } from './consts';

/**
 * Builds the demo's HUD: the street window, and the note window on top of
 * it. Both are drawn in shades of the sand color, the palette entry closest
 * to beige, and neither of them takes any light from the street below.
 */
export const createDemoHud = (): Hud =>
  addHudWindow(
    addHudWindow(createHud(), STREET_WINDOW_SETTINGS),
    NOTE_WINDOW_SETTINGS,
  );
