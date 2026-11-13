import { describe, expect, it } from 'vitest';

import { createInputMailbox } from './create-input-mailbox';

describe('createInputMailbox', () => {
  it('should start empty', () => {
    expect(createInputMailbox().drain()).toEqual([]);
  });

  it('should hand over the events in the order they came in', () => {
    const mailbox = createInputMailbox();

    mailbox.post({ kind: 'press', row: 10, column: 20 });
    mailbox.post({ kind: 'key', key: 'A' });

    expect(mailbox.drain()).toEqual([
      { kind: 'press', row: 10, column: 20 },
      { kind: 'key', key: 'A' },
    ]);
  });

  it('should empty itself once it hands the events over', () => {
    const mailbox = createInputMailbox();

    mailbox.post({ kind: 'key', key: 'A' });
    mailbox.drain();

    expect(mailbox.drain()).toEqual([]);
  });

  it('should keep the events that came in after it was drained', () => {
    const mailbox = createInputMailbox();

    mailbox.post({ kind: 'key', key: 'A' });
    mailbox.drain();
    mailbox.post({ kind: 'key', key: 'B' });

    expect(mailbox.drain()).toEqual([{ kind: 'key', key: 'B' }]);
  });
});
