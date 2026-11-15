import type { HudEvent } from '@cassette-canvas/engine';
import { match } from 'ts-pattern';
import type { InputMailbox } from '../types/input-mailbox';

/*
 * Appendix B exception 2: the mailbox is the demo's one mutable state cell,
 * and the state is the semantics. The browser adds to it between frames, so
 * nothing can thread it through a pipeline. The write lives here alone, and
 * every body around it stays a single expression.
 */
export const writeMailboxEvents = (
  events: readonly HudEvent[],
  mailbox: InputMailbox,
): InputMailbox =>
  // eslint-disable-next-line no-restricted-syntax, no-param-reassign
  match((mailbox.events = events)).otherwise(() => mailbox);
