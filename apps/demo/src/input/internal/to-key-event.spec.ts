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
  it('should pass a character on to be typed', () => {
    expect(toKeyEvent(createEvent('a'))).toEqual({ kind: 'key', key: 'a' });
  });

  it('should pass a space on to be typed', () => {
    expect(toKeyEvent(createEvent(' '))).toEqual({ kind: 'key', key: ' ' });
  });

  it('should pass the backspace on', () => {
    expect(toKeyEvent(createEvent('Backspace'))).toEqual({
      kind: 'key',
      key: 'Backspace',
    });
  });

  it('should pass the enter key on', () => {
    expect(toKeyEvent(createEvent('Enter'))).toEqual({
      kind: 'key',
      key: 'Enter',
    });
  });

  it('should pass the escape key on', () => {
    expect(toKeyEvent(createEvent('Escape'))).toEqual({
      kind: 'key',
      key: 'Escape',
    });
  });

  it('should leave a key the HUD does not read to the browser', () => {
    expect(toKeyEvent(createEvent('ArrowLeft'))).toBeUndefined();
  });

  it('should leave a shortcut to the browser', () => {
    expect(toKeyEvent(createEvent('r', { ctrlKey: true }))).toBeUndefined();
  });

  it('should leave a shortcut with the command key to the browser', () => {
    expect(toKeyEvent(createEvent('r', { metaKey: true }))).toBeUndefined();
  });
});
