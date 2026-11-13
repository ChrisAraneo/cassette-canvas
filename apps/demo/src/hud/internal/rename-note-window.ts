import {
  type Hud,
  patchHudWidget,
  patchHudWindow,
} from '@cassette-canvas/engine';
import { trim } from 'lodash-es';
import { match } from 'ts-pattern';
import { NOTE_FIELD, NOTE_TITLE, NOTE_WINDOW } from '../consts';

const toTitle = (text: string): string =>
  match(trim(text))
    .with('', () => NOTE_TITLE)
    .otherwise((written) => written);

/**
 * Writes what was typed in the title bar of the note window, and empties the
 * field so the next line starts clean. An empty line gives the window its
 * own name back.
 */
export const renameNoteWindow = (hud: Hud, text: string): Hud =>
  patchHudWindow(
    patchHudWidget(hud, NOTE_WINDOW, NOTE_FIELD, { text: '' }),
    NOTE_WINDOW,
    { title: toTitle(text) },
  );
