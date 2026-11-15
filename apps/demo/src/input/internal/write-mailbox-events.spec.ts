import type { HudEvent } from '@cassette-canvas/engine';
import { describe, expect, it } from 'vitest';

import type { InputMailbox } from '../types/input-mailbox';
import { writeMailboxEvents } from './write-mailbox-events';

const KEY_EVENT: HudEvent = { kind: 'KEY', key: 'A' };

const PRESS_EVENT: HudEvent = { kind: 'PRESS', row: 10, column: 20 };

const createMailbox = (): InputMailbox => ({ events: [] });

describe('writeMailboxEvents', () => {
  it('should hold the events it is given when the mailbox is empty', () => {
    const mailbox = createMailbox();

    writeMailboxEvents([KEY_EVENT], mailbox);

    expect(mailbox.events).toEqual([KEY_EVENT]);
  });

  it('should hold nothing when it is given nothing', () => {
    const mailbox = createMailbox();

    writeMailboxEvents([KEY_EVENT], mailbox);
    writeMailboxEvents([], mailbox);

    expect(mailbox.events).toEqual([]);
  });

  it('should leave the old events behind when it writes again', () => {
    const mailbox = createMailbox();

    writeMailboxEvents([KEY_EVENT], mailbox);
    writeMailboxEvents([PRESS_EVENT], mailbox);

    expect(mailbox.events).toEqual([PRESS_EVENT]);
  });

  it('should give back the mailbox it was given when it writes', () => {
    const mailbox = createMailbox();

    expect(writeMailboxEvents([KEY_EVENT], mailbox)).toBe(mailbox);
  });
});
