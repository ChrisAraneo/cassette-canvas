import { describe, expect, it } from 'vitest';

import { createInputMailbox } from './create-input-mailbox';

describe('createInputMailbox', () => {
  it('should hold nothing when the mailbox is new', () => {
    expect(createInputMailbox().events).toEqual([]);
  });

  it('should give a mailbox of its own when it is called again', () => {
    const mailbox = createInputMailbox();

    mailbox.events = [{ kind: 'KEY', key: 'A' }];

    expect(createInputMailbox().events).toEqual([]);
  });
});
