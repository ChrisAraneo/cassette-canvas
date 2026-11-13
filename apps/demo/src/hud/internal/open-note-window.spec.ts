import {
  findHudWidget,
  findHudWindow,
  type Hud,
  patchHudWidget,
} from '@cassette-canvas/engine';
import { filter, last, map } from 'lodash-es';
import { match } from 'ts-pattern';
import { describe, expect, it } from 'vitest';

import { NOTE_FIELD, NOTE_WINDOW, STREET_WINDOW } from '../consts';
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
  it('should put the note window back on the screen', () => {
    expect(
      findHudWindow(openNoteWindow(removeNote(createDemoHud())), NOTE_WINDOW),
    ).toBeDefined();
  });

  it('should put the note window on top', () => {
    expect(
      last(map(openNoteWindow(createDemoHud()).windows, (window) => window.id)),
    ).toBe(NOTE_WINDOW);
  });

  it('should keep the street window below it', () => {
    expect(
      map(openNoteWindow(createDemoHud()).windows, (window) => window.id),
    ).toEqual([STREET_WINDOW, NOTE_WINDOW]);
  });

  it('should empty the field of a window that is already open', () => {
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
