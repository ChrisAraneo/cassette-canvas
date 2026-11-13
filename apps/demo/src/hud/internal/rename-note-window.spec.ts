import {
  findHudWidget,
  findHudWindow,
  type Hud,
} from '@cassette-canvas/engine';
import { match } from 'ts-pattern';
import { describe, expect, it } from 'vitest';

import { NOTE_FIELD, NOTE_TITLE, NOTE_WINDOW } from '../consts';
import { createDemoHud } from '../create-demo-hud';
import { renameNoteWindow } from './rename-note-window';

const toFieldText = (hud: Hud): string | undefined =>
  match(findHudWidget(hud, NOTE_WINDOW, NOTE_FIELD))
    .with({ kind: 'input' }, ({ text }) => text)
    .otherwise(() => undefined);

describe('renameNoteWindow', () => {
  it('should write the line in the title bar', () => {
    expect(
      findHudWindow(renameNoteWindow(createDemoHud(), 'Cassette'), NOTE_WINDOW)
        ?.title,
    ).toBe('Cassette');
  });

  it('should empty the field, so the next line starts clean', () => {
    expect(toFieldText(renameNoteWindow(createDemoHud(), 'Cassette'))).toBe('');
  });

  it('should give the window its own name back when the line is empty', () => {
    expect(
      findHudWindow(renameNoteWindow(createDemoHud(), '   '), NOTE_WINDOW)
        ?.title,
    ).toBe(NOTE_TITLE);
  });

  it('should keep the window where it is', () => {
    expect(
      findHudWindow(renameNoteWindow(createDemoHud(), 'Cassette'), NOTE_WINDOW),
    ).toMatchObject({
      row: findHudWindow(createDemoHud(), NOTE_WINDOW)?.row ?? 0,
      column: findHudWindow(createDemoHud(), NOTE_WINDOW)?.column ?? 0,
    });
  });

  it('should leave the street window alone', () => {
    expect(renameNoteWindow(createDemoHud(), 'Cassette').windows[0]).toEqual(
      createDemoHud().windows[0],
    );
  });
});
