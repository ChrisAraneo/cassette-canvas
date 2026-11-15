import type { HudEvent } from '@cassette-canvas/engine';
import { describe, expect, it } from 'vitest';

import { addInputEvent } from './add-input-event';
import { createInputMailbox } from './create-input-mailbox';

const KEY_EVENT: HudEvent = { kind: 'KEY', key: 'A' };

const PRESS_EVENT: HudEvent = { kind: 'PRESS', row: 10, column: 20 };

describe('addInputEvent', () => {
  it('should hold the event when the mailbox is empty', () => {
    const mailbox = createInputMailbox();

    addInputEvent(KEY_EVENT, mailbox);

    expect(mailbox.events).toEqual([KEY_EVENT]);
  });

  it('should keep the events in the order they came in when several arrive', () => {
    const mailbox = createInputMailbox();

    addInputEvent(PRESS_EVENT, mailbox);
    addInputEvent(KEY_EVENT, mailbox);

    expect(mailbox.events).toEqual([PRESS_EVENT, KEY_EVENT]);
  });

  it('should give back the mailbox it was given when it adds', () => {
    const mailbox = createInputMailbox();

    expect(addInputEvent(KEY_EVENT, mailbox)).toBe(mailbox);
  });
});
