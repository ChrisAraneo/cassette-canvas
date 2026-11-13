import type { HudEvent } from '@cassette-canvas/engine';

/**
 * The one place in the demo that holds on to something that changes: the
 * bridge between the browser's events, which arrive at any time, and the
 * frame loop, which is pure. `post` takes an event in, and `drain` returns
 * everything that came in since the last frame and empties the mailbox.
 */
export interface InputMailbox {
  readonly post: (event: HudEvent) => void;
  readonly drain: () => readonly HudEvent[];
}
