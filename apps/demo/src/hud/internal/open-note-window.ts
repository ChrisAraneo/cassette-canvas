import { addHudWindow, type Hud } from '@cassette-canvas/engine';
import { NOTE_WINDOW_SETTINGS } from '../consts';

/**
 * Puts the note window back on the screen, on top of the street window. If
 * it is already there, it goes back to where it started with an empty field.
 */
export const openNoteWindow = (hud: Hud): Hud =>
  addHudWindow(hud, NOTE_WINDOW_SETTINGS);
