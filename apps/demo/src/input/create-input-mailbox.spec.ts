import { describe, expect, it } from 'vitest';

import { createInputMailbox } from './create-input-mailbox';

describe('createInputMailbox', () => {
  it('should return no events when the mailbox is new', () => {
    expect(createInputMailbox().drain()).toEqual([]);
  });

  it('should return the events in the order they came in when it is drained', () => {
    const mailbox = createInputMailbox();

    mailbox.post({ kind: 'press', row: 10, column: 20 });
    mailbox.post({ kind: 'key', key: 'A' });

    expect(mailbox.drain()).toEqual([
      { kind: 'press', row: 10, column: 20 },
      { kind: 'key', key: 'A' },
    ]);
  });

  it('should return no events when it is drained again', () => {
    const mailbox = createInputMailbox();

    mailbox.post({ kind: 'key', key: 'A' });
    mailbox.drain();

    expect(mailbox.drain()).toEqual([]);
  });

  it('should return only the events that came in after the last drain when it drains again', () => {
    const mailbox = createInputMailbox();

    mailbox.post({ kind: 'key', key: 'A' });
    mailbox.drain();
    mailbox.post({ kind: 'key', key: 'B' });

    expect(mailbox.drain()).toEqual([{ kind: 'key', key: 'B' }]);
  });
});
