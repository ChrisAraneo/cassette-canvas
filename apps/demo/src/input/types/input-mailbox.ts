import type { HudEvent } from '@cassette-canvas/engine';

/**
 * The one place in the demo that holds on to something that changes: the
 * bridge between the browser's events, which arrive at any time, and the
 * frame loop, which is pure. `events` holds everything that came in since the
 * last read.
 */
export interface InputMailbox {
  events: readonly HudEvent[];
}
