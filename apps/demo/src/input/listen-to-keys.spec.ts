import type { HudEvent } from '@cassette-canvas/engine';
import { describe, expect, it } from 'vitest';

import { createInputMailbox } from './create-input-mailbox';
import { listenToKeys } from './listen-to-keys';

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

const listen = (key: string): HudEvent[] => {
  const listeners: Listeners = {};
  const mailbox = createInputMailbox();

  listenToKeys(createTarget(listeners), mailbox);
  listeners['keydown']?.(createEvent(key));

  return [...mailbox.drain()];
};

describe('listenToKeys', () => {
  it('should post a character that goes down', () => {
    expect(listen('A')).toEqual([{ kind: 'key', key: 'A' }]);
  });

  it('should post the keys a field answers by name', () => {
    expect(listen('Enter')).toEqual([{ kind: 'key', key: 'Enter' }]);
  });

  it('should post nothing for a key the HUD does not read', () => {
    expect(listen('ArrowUp')).toEqual([]);
  });
});
