import { runEffect } from '@cassette-canvas/common';
import type { HudEvent } from '@cassette-canvas/engine';
import { pipe } from 'remeda';
import { describe, expect, it } from 'vitest';

import { createInputMailbox } from './create-input-mailbox';
import { readInputEvents } from './read-input-events';
import { watchKeys } from './watch-keys';

type Listeners = Record<string, (event: KeyboardEvent) => void>;

const createTarget = (listeners: Listeners): Document =>
  ({
    addEventListener: (
      name: string,
      listener: (event: KeyboardEvent) => void,
    ) => {
      listeners[name] = listener;
    },
  }) as unknown as Document;

const createEvent = (key: string): KeyboardEvent =>
  ({
    key,
    ctrlKey: false,
    altKey: false,
    metaKey: false,
  }) as unknown as KeyboardEvent;

const readKeyEvents = (key: string): readonly HudEvent[] => {
  const listeners: Listeners = {};
  const mailbox = createInputMailbox();

  return pipe(
    createTarget(listeners),
    (target) => watchKeys(target, mailbox),
    (watched) =>
      runEffect(watched, () => listeners['keydown']?.(createEvent(key))),
    () => readInputEvents(mailbox),
  );
};

describe('watchKeys', () => {
  it('should add a key event when a character goes down', () => {
    expect(readKeyEvents('A')).toEqual([{ kind: 'KEY', key: 'A' }]);
  });

  it('should add a key event when a named key goes down', () => {
    expect(readKeyEvents('Enter')).toEqual([{ kind: 'KEY', key: 'Enter' }]);
  });

  it('should add nothing when the HUD does not read the key', () => {
    expect(readKeyEvents('ArrowUp')).toEqual([]);
  });

  it('should give back the page it watches when it starts watching', () => {
    const listeners: Listeners = {};
    const target = createTarget(listeners);

    expect(watchKeys(target, createInputMailbox())).toBe(target);
  });
});
