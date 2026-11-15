import type { InputMailbox } from './types/input-mailbox';

/**
 * Creates an empty mailbox for the browser's events. The watchers add to it as
 * the events come in, and the frame loop reads it once per frame, so it
 * handles everything that happened in the order it happened.
 */
export const createInputMailbox = (): InputMailbox => ({ events: [] });
