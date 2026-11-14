import { addHudWindow, createHud, type Hud } from '@cassette-canvas/engine';
import { pipe } from 'remeda';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '../street/consts';
import {
  NOTE_WINDOW_SETTINGS,
  STREET_WINDOW_SETTINGS,
  TAPE_WINDOW_SETTINGS,
} from './consts';

/**
 * Builds the demo's HUD: the street window, the note window, and the tape
 * window on top. All three are drawn in shades of the sand color, the
 * palette entry closest to beige, and none of them takes any light from the
 * street below. The HUD knows the street screen, so no window can be dragged
 * off it.
 */
export const createDemoHud = (): Hud =>
  pipe(
    createHud(undefined, { width: SCREEN_WIDTH, height: SCREEN_HEIGHT }),
    (hud) => addHudWindow(hud, STREET_WINDOW_SETTINGS),
    (hud) => addHudWindow(hud, NOTE_WINDOW_SETTINGS),
    (hud) => addHudWindow(hud, TAPE_WINDOW_SETTINGS),
  );
