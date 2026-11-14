import {
  findHudWidget,
  findHudWindow,
  type Hud,
  patchHudWidget,
} from '@cassette-canvas/engine';
import { filter, last, map } from 'lodash-es';
import { match } from 'ts-pattern';
import { describe, expect, it } from 'vitest';

import { NOTE_FIELD, NOTE_WINDOW, STREET_WINDOW, TAPE_WINDOW } from '../consts';
import { createDemoHud } from '../create-demo-hud';
import { openNoteWindow } from './open-note-window';

const removeNote = (hud: Hud): Hud => ({
  ...hud,
  windows: filter(hud.windows, (window) => window.id !== NOTE_WINDOW),
});

const toFieldText = (hud: Hud): string | undefined =>
  match(findHudWidget(hud, NOTE_WINDOW, NOTE_FIELD))
    .with({ kind: 'input' }, ({ text }) => text)
    .otherwise(() => undefined);

describe('openNoteWindow', () => {
  it('should return the note window back on the screen when it was closed', () => {
    expect(
      findHudWindow(openNoteWindow(removeNote(createDemoHud())), NOTE_WINDOW),
    ).toBeDefined();
  });

  it('should return the note window on top when it is already open', () => {
    expect(
      last(map(openNoteWindow(createDemoHud()).windows, (window) => window.id)),
    ).toBe(NOTE_WINDOW);
  });

  it('should return the other windows below the note window when it opens one', () => {
    expect(
      map(openNoteWindow(createDemoHud()).windows, (window) => window.id),
    ).toEqual([STREET_WINDOW, TAPE_WINDOW, NOTE_WINDOW]);
  });

  it('should return an empty field when the window is already open', () => {
    expect(
      toFieldText(
        openNoteWindow(
          patchHudWidget(createDemoHud(), NOTE_WINDOW, NOTE_FIELD, {
            text: 'left over',
          }),
        ),
      ),
    ).toBe('');
  });
});
