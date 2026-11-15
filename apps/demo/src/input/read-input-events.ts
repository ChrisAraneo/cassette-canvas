import { runEffect } from '@cassette-canvas/common';
import type { HudEvent } from '@cassette-canvas/engine';
import { writeMailboxEvents } from './internal/write-mailbox-events';
import type { InputMailbox } from './types/input-mailbox';

/**
 * Returns everything the browser added since the last read and empties the
 * mailbox, so the frame loop handles every event exactly once.
 */
export const readInputEvents = (mailbox: InputMailbox): readonly HudEvent[] =>
  runEffect(mailbox.events, () => writeMailboxEvents([], mailbox));
