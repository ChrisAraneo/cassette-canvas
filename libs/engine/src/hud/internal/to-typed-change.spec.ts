import { describe, expect, it } from 'vitest';

import { addHudWindow } from '../add-hud-window';
import { createHud } from '../create-hud';
import { findHudWidget } from '../find-hud-widget';
import type { Hud } from '../types/hud';
import { toTypedChange } from './to-typed-change';

const FOCUS = Object.freeze({ window: 'notes', widget: 'note' });

const createNotesHud = (): Hud =>
  addHudWindow(createHud(), {
    id: 'notes',
    title: 'NOTES',
    row: 0,
    column: 0,
    width: 90,
    height: 40,
    widgets: [
      {
        kind: 'INPUT',
        id: 'note',
        page: '',
        row: 0,
        column: 0,
        width: 60,
        text: 'HI',
      },
    ],
  });

describe('toTypedChange', () => {
  it('should put the new text in the field when it types into one', () => {
    expect(
      findHudWidget(
        toTypedChange(createNotesHud(), FOCUS, 'HIT').hud,
        'notes',
        'note',
      ),
    ).toMatchObject({ text: 'HIT' });
  });

  it('should empty the field when the new text is empty', () => {
    expect(
      findHudWidget(
        toTypedChange(createNotesHud(), FOCUS, '').hud,
        'notes',
        'note',
      ),
    ).toMatchObject({ text: '' });
  });

  it('should return a TYPE action carrying the new text when it types into a field', () => {
    expect(toTypedChange(createNotesHud(), FOCUS, 'HIT').actions).toEqual([
      { kind: 'TYPE', window: 'notes', widget: 'note', value: 'HIT' },
    ]);
  });

  it('should not change the old HUD when it types into a field', () => {
    const hud = createNotesHud();

    toTypedChange(hud, FOCUS, 'HIT');

    expect(hud).toEqual(createNotesHud());
  });
});
