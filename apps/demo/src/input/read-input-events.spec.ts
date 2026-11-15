import type { HudEvent } from '@cassette-canvas/engine';
import { describe, expect, it } from 'vitest';

import { addInputEvent } from './add-input-event';
import { createInputMailbox } from './create-input-mailbox';
import { readInputEvents } from './read-input-events';

const KEY_EVENT: HudEvent = { kind: 'KEY', key: 'A' };

const OTHER_KEY_EVENT: HudEvent = { kind: 'KEY', key: 'B' };

const PRESS_EVENT: HudEvent = { kind: 'PRESS', row: 10, column: 20 };

describe('readInputEvents', () => {
  it('should give no events when the mailbox is new', () => {
    expect(readInputEvents(createInputMailbox())).toEqual([]);
  });

  it('should give the events in the order they came in when the mailbox holds some', () => {
    const mailbox = createInputMailbox();

    addInputEvent(PRESS_EVENT, mailbox);
    addInputEvent(KEY_EVENT, mailbox);

    expect(readInputEvents(mailbox)).toEqual([PRESS_EVENT, KEY_EVENT]);
  });

  it('should empty the mailbox when it reads', () => {
    const mailbox = createInputMailbox();

    addInputEvent(KEY_EVENT, mailbox);
    readInputEvents(mailbox);

    expect(mailbox.events).toEqual([]);
  });

  it('should give only what came in since the last read when it reads again', () => {
    const mailbox = createInputMailbox();

    addInputEvent(KEY_EVENT, mailbox);
    readInputEvents(mailbox);
    addInputEvent(OTHER_KEY_EVENT, mailbox);

    expect(readInputEvents(mailbox)).toEqual([OTHER_KEY_EVENT]);
  });
});
