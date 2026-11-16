import { constant } from 'lodash-es';
import { match } from 'ts-pattern';
import { describe, expect, it } from 'vitest';

import { addHudWindow } from '../add-hud-window';
import { HUD_BACKSPACE_KEY, HUD_ENTER_KEY, HUD_ESCAPE_KEY } from '../consts';
import { createHud } from '../create-hud';
import { findHudWidget } from '../find-hud-widget';
import type { Hud } from '../types/hud';
import type { HudInput } from '../types/hud-input';
import { handleFieldKey } from './handle-field-key';

const FOCUS = Object.freeze({ window: 'notes', widget: 'note' });

const INPUT: HudInput = Object.freeze({
  kind: 'INPUT',
  id: 'note',
  page: '',
  row: 0,
  column: 0,
  width: 60,
  text: 'HI',
});

const createNotesHud = (): Hud => ({
  ...addHudWindow(createHud(), {
    id: 'notes',
    title: 'NOTES',
    row: 0,
    column: 0,
    width: 90,
    height: 40,
    widgets: [INPUT],
  }),
  focus: FOCUS,
});

const toText = (hud: Hud): string | undefined =>
  match(findHudWidget(hud, 'notes', 'note'))
    .with({ kind: 'INPUT' }, (input) => input.text)
    .otherwise(constant(undefined));

describe('handleFieldKey', () => {
  it('should add the letter to the field when the key types one', () => {
    expect(
      toText(handleFieldKey(createNotesHud(), FOCUS, INPUT, 'T').hud),
    ).toBe('HIT');
  });

  it('should take the last letter off the field when the key is Backspace', () => {
    expect(
      toText(
        handleFieldKey(createNotesHud(), FOCUS, INPUT, HUD_BACKSPACE_KEY).hud,
      ),
    ).toBe('H');
  });

  it('should leave the field empty when Backspace is pressed on one letter', () => {
    expect(
      toText(
        handleFieldKey(
          createNotesHud(),
          FOCUS,
          { ...INPUT, text: 'H' },
          HUD_BACKSPACE_KEY,
        ).hud,
      ),
    ).toBe('');
  });

  it('should return a SUBMIT action carrying the text when the key is Enter', () => {
    expect(
      handleFieldKey(createNotesHud(), FOCUS, INPUT, HUD_ENTER_KEY).actions,
    ).toEqual([
      { kind: 'SUBMIT', window: 'notes', widget: 'note', value: 'HI' },
    ]);
  });

  it('should leave the text alone when the key is Enter', () => {
    expect(
      toText(handleFieldKey(createNotesHud(), FOCUS, INPUT, HUD_ENTER_KEY).hud),
    ).toBe('HI');
  });

  it('should clear the focus when the key is Escape', () => {
    expect(
      handleFieldKey(createNotesHud(), FOCUS, INPUT, HUD_ESCAPE_KEY).hud.focus,
    ).toBeUndefined();
  });

  it('should return no actions when the key is Escape', () => {
    expect(
      handleFieldKey(createNotesHud(), FOCUS, INPUT, HUD_ESCAPE_KEY).actions,
    ).toEqual([]);
  });

  it('should do nothing at all when the key is named rather than typed', () => {
    const hud = createNotesHud();

    expect(handleFieldKey(hud, FOCUS, INPUT, 'ArrowLeft')).toEqual({
      hud,
      actions: [],
    });
  });

  it('should not change the old HUD when it reads a key', () => {
    const hud = createNotesHud();

    handleFieldKey(hud, FOCUS, INPUT, 'T');

    expect(hud).toEqual(createNotesHud());
  });
});
