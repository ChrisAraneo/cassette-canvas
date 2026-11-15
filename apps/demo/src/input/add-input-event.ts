import type { HudEvent } from '@cassette-canvas/engine';
import { concat } from 'lodash-es';
import { writeMailboxEvents } from './internal/write-mailbox-events';
import type { InputMailbox } from './types/input-mailbox';

/**
 * Adds one event to the end of the mailbox, where the frame loop reads it on
 * the next frame.
 */
export const addInputEvent = (
  event: HudEvent,
  mailbox: InputMailbox,
): InputMailbox => writeMailboxEvents(concat(mailbox.events, event), mailbox);
