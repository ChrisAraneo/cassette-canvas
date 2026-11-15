import { describe, expect, it } from 'vitest';

import { toKeyEvent } from './to-key-event';

const createEvent = (
  key: string,
  modifiers: Partial<KeyboardEvent> = {},
): KeyboardEvent =>
  ({
    key,
    ctrlKey: false,
    altKey: false,
    metaKey: false,
    ...modifiers,
  }) as unknown as KeyboardEvent;

describe('toKeyEvent', () => {
  it('should return a key event when the key is a character', () => {
    expect(toKeyEvent(createEvent('a'))).toEqual({ kind: 'KEY', key: 'a' });
  });

  it('should return a key event when the key is a space', () => {
    expect(toKeyEvent(createEvent(' '))).toEqual({ kind: 'KEY', key: ' ' });
  });

  it('should return a key event when the key is Backspace', () => {
    expect(toKeyEvent(createEvent('Backspace'))).toEqual({
      kind: 'KEY',
      key: 'Backspace',
    });
  });

  it('should return a key event when the key is Enter', () => {
    expect(toKeyEvent(createEvent('Enter'))).toEqual({
      kind: 'KEY',
      key: 'Enter',
    });
  });

  it('should return a key event when the key is Escape', () => {
    expect(toKeyEvent(createEvent('Escape'))).toEqual({
      kind: 'KEY',
      key: 'Escape',
    });
  });

  it('should give no event when the HUD does not read the key', () => {
    expect(toKeyEvent(createEvent('ArrowLeft'))).toBe(undefined);
  });

  it('should give no event when the control key is held', () => {
    expect(toKeyEvent(createEvent('r', { ctrlKey: true }))).toBe(undefined);
  });

  it('should give no event when the command key is held', () => {
    expect(toKeyEvent(createEvent('r', { metaKey: true }))).toBe(undefined);
  });
});
