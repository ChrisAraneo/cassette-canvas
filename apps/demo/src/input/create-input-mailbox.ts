import type { HudEvent } from '@cassette-canvas/engine';
import { size } from 'lodash-es';
import type { InputMailbox } from './types/input-mailbox';

/**
 * Creates an empty mailbox for the browser's events. The listeners post into
 * it as the events come in, and the frame loop drains it once per frame, so
 * it handles everything that happened in the order it happened.
 */
export const createInputMailbox = (): InputMailbox => {
  const events: HudEvent[] = [];

  return {
    post: (event) => {
      events.push(event);
    },
    drain: () => events.splice(0, size(events)),
  };
};
