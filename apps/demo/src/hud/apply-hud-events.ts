import type { HudEvent } from '@cassette-canvas/engine';
import { reduce } from 'lodash-es';
import { applyHudEvent } from './internal/apply-hud-event';
import type { HudState } from './types/hud-state';

/**
 * Answers everything the person did since the last frame, in the order it
 * happened. `time` is the time of the frame, which the street clock is
 * measured from. Returns a new state.
 */
export const applyHudEvents = (
  state: HudState,
  events: readonly HudEvent[],
  time: number,
): HudState =>
  reduce(
    events,
    (current, event) => applyHudEvent(current, event, time),
    state,
  );
