import { match } from 'ts-pattern';
import { describe, expect, it } from 'vitest';

import { addHudWindow } from '../add-hud-window';
import { createHud } from '../create-hud';
import { findHudWidget } from '../find-hud-widget';
import { patchHudWidget } from '../patch-hud-widget';
import type { Hud } from '../types/hud';
import type { HudWidget } from '../types/hud-widget';
import { typeHud } from './type-hud';

const WIDGETS: readonly HudWidget[] = Object.freeze([
  {
    kind: 'input',
    id: 'note',
    page: '',
    row: 0,
    column: 0,
    width: 60,
    text: 'HI',
  },
  { kind: 'label', id: 'fps', page: '', row: 16, column: 0, text: 'FPS' },
]);

const createNotesHud = (): Hud =>
  addHudWindow(createHud(), {
    id: 'notes',
    title: 'NOTES',
    row: 0,
    column: 0,
    width: 90,
    height: 40,
    widgets: WIDGETS,
  });

const createTypingHud = (): Hud => ({
  ...createNotesHud(),
  focus: { window: 'notes', widget: 'note' },
});

const textOf = (hud: Hud): string =>
  match(findHudWidget(hud, 'notes', 'note'))
    .with({ kind: 'input' }, (input) => input.text)
    .otherwise(() => '');

describe('typeHud', () => {
  it('should add the character to the field that takes the keys', () => {
    expect(textOf(typeHud(createTypingHud(), '!').hud)).toBe('HI!');
  });

  it('should report the text the field now holds', () => {
    expect(typeHud(createTypingHud(), '!').actions).toEqual([
      { kind: 'type', window: 'notes', widget: 'note', value: 'HI!' },
    ]);
  });

  it('should take the last character off on Backspace', () => {
    expect(textOf(typeHud(createTypingHud(), 'Backspace').hud)).toBe('H');
  });

  it('should leave an empty field empty on Backspace', () => {
    expect(
      textOf(
        typeHud(
          patchHudWidget(createTypingHud(), 'notes', 'note', { text: '' }),
          'Backspace',
        ).hud,
      ),
    ).toBe('');
  });

  it('should report a submit on Enter, and leave the text as it is', () => {
    const change = typeHud(createTypingHud(), 'Enter');

    expect([textOf(change.hud), change.actions]).toEqual([
      'HI',
      [{ kind: 'submit', window: 'notes', widget: 'note', value: 'HI' }],
    ]);
  });

  it('should give up the keys on Escape', () => {
    expect(typeHud(createTypingHud(), 'Escape').hud.focus).toBeUndefined();
  });

  it('should leave a key it does not read alone', () => {
    expect(typeHud(createTypingHud(), 'ArrowLeft').actions).toEqual([]);
  });

  it('should take a space as a character', () => {
    expect(textOf(typeHud(createTypingHud(), ' ').hud)).toBe('HI ');
  });

  it('should read nothing when no field takes the keys', () => {
    const hud = createNotesHud();

    expect(typeHud(hud, '!').hud).toBe(hud);
  });

  it('should read nothing when the keys went to something that is not a field', () => {
    const hud: Hud = {
      ...createNotesHud(),
      focus: { window: 'notes', widget: 'fps' },
    };

    expect(typeHud(hud, '!').hud).toBe(hud);
  });
});
