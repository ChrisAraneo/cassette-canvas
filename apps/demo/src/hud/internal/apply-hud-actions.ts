import type { HudAction } from '@cassette-canvas/engine';
import { reduce } from 'lodash-es';
import type { HudState } from '../types/hud-state';
import { applyHudAction } from './apply-hud-action';

/** Handles every action one event caused, in the order it happened. */
export const applyHudActions = (
  state: HudState,
  actions: readonly HudAction[],
  time: number,
): HudState =>
  reduce(
    actions,
    (current, action) => applyHudAction(current, action, time),
    state,
  );
