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
  it('should return the character added to the field when it takes the keys', () => {
    expect(textOf(typeHud(createTypingHud(), '!').hud)).toBe('HI!');
  });

  it('should return a type action with the text when the field takes a character', () => {
    expect(typeHud(createTypingHud(), '!').actions).toEqual([
      { kind: 'type', window: 'notes', widget: 'note', value: 'HI!' },
    ]);
  });

  it('should return the text without its last character when the key is Backspace', () => {
    expect(textOf(typeHud(createTypingHud(), 'Backspace').hud)).toBe('H');
  });

  it('should return an empty text when the field is empty and the key is Backspace', () => {
    expect(
      textOf(
        typeHud(
          patchHudWidget(createTypingHud(), 'notes', 'note', { text: '' }),
          'Backspace',
        ).hud,
      ),
    ).toBe('');
  });

  it('should return a submit action and the same text when the key is Enter', () => {
    const change = typeHud(createTypingHud(), 'Enter');

    expect([textOf(change.hud), change.actions]).toEqual([
      'HI',
      [{ kind: 'submit', window: 'notes', widget: 'note', value: 'HI' }],
    ]);
  });

  it('should return no focus when the key is Escape', () => {
    expect(typeHud(createTypingHud(), 'Escape').hud.focus).toBeUndefined();
  });

  it('should return no actions when it does not read the key', () => {
    expect(typeHud(createTypingHud(), 'ArrowLeft').actions).toEqual([]);
  });

  it('should return the space added to the text when the key is a space', () => {
    expect(textOf(typeHud(createTypingHud(), ' ').hud)).toBe('HI ');
  });

  it('should return the very same HUD when no field takes the keys', () => {
    const hud = createNotesHud();

    expect(typeHud(hud, '!').hud).toBe(hud);
  });

  it('should return the very same HUD when the focus is not on a field', () => {
    const hud: Hud = {
      ...createNotesHud(),
      focus: { window: 'notes', widget: 'fps' },
    };

    expect(typeHud(hud, '!').hud).toBe(hud);
  });
});
