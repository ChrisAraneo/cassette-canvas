import type { HudAction } from '@cassette-canvas/engine';
import { reduce } from 'lodash-es';
import type { HudState } from '../types/hud-state';
import { patchHudStateAction } from './patch-hud-state-action';

/** Handles every action one event caused, in the order it happened. */
export const patchHudStateActions = (
  state: HudState,
  actions: readonly HudAction[],
  time: number,
): HudState =>
  reduce(
    actions,
    (current, action) => patchHudStateAction(current, action, time),
    state,
  );
