import {
  findHudWidget,
  findHudWindow,
  type Hud,
} from '@cassette-canvas/engine';
import { constant } from 'lodash-es';
import { match } from 'ts-pattern';
import { describe, expect, it } from 'vitest';

import { NOTE_FIELD, NOTE_TITLE, NOTE_WINDOW } from '../consts';
import { createDemoHud } from '../create-demo-hud';
import { patchNoteTitle } from './patch-note-title';

const findFieldText = (hud: Hud): string | undefined =>
  match(findHudWidget(hud, NOTE_WINDOW, NOTE_FIELD))
    .with({ kind: 'INPUT' }, ({ text }) => text)
    .otherwise(constant(undefined));

describe('patchNoteTitle', () => {
  it('should return the line in the title bar when it renames the window', () => {
    expect(
      findHudWindow(patchNoteTitle(createDemoHud(), 'Cassette'), NOTE_WINDOW)
        ?.title,
    ).toBe('Cassette');
  });

  it('should return an empty field when it renames the window, so the next line starts empty', () => {
    expect(findFieldText(patchNoteTitle(createDemoHud(), 'Cassette'))).toBe('');
  });

  it('should return the name of the window itself when the line is empty', () => {
    expect(
      findHudWindow(patchNoteTitle(createDemoHud(), '   '), NOTE_WINDOW)?.title,
    ).toBe(NOTE_TITLE);
  });

  it('should return the window where it is when it renames it', () => {
    expect(
      findHudWindow(patchNoteTitle(createDemoHud(), 'Cassette'), NOTE_WINDOW),
    ).toMatchObject({
      row: findHudWindow(createDemoHud(), NOTE_WINDOW)?.row ?? 0,
      column: findHudWindow(createDemoHud(), NOTE_WINDOW)?.column ?? 0,
    });
  });

  it('should return the street window unchanged when it renames the note window', () => {
    expect(patchNoteTitle(createDemoHud(), 'Cassette').windows[0]).toEqual(
      createDemoHud().windows[0],
    );
  });
});
