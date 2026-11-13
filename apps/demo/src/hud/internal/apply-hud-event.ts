import {
  type HudChange,
  type HudEvent,
  handleHud,
} from '@cassette-canvas/engine';
import type { HudState } from '../types/hud-state';
import { applyHudActions } from './apply-hud-actions';

const applyChange = (
  state: HudState,
  change: HudChange,
  time: number,
): HudState =>
  applyHudActions({ ...state, hud: change.hud }, change.actions, time);

/**
 * Hands one event to the HUD, then answers whatever came of it. Returns a
 * new state.
 */
export const applyHudEvent = (
  state: HudState,
  event: HudEvent,
  time: number,
): HudState => applyChange(state, handleHud(state.hud, event), time);
