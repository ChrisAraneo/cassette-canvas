import {
  type HudChange,
  type HudEvent,
  handleHud,
} from '@cassette-canvas/engine';
import type { HudState } from '../types/hud-state';
import { patchHudStateActions } from './patch-hud-state-actions';

const patchHudStateChange = (
  state: HudState,
  change: HudChange,
  time: number,
): HudState =>
  patchHudStateActions({ ...state, hud: change.hud }, change.actions, time);

/**
 * Passes one event to the HUD, then handles the actions it returned.
 * Returns a new state.
 */
export const patchHudStateEvent = (
  state: HudState,
  event: HudEvent,
  time: number,
): HudState => patchHudStateChange(state, handleHud(state.hud, event), time);
