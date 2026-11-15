import { createHud } from '@cassette-canvas/engine';
import { describe, expect, it } from 'vitest';

import { HOUR_LENGTH, START_CLOCK } from '../consts';
import type { HudState } from '../types/hud-state';
import { patchHudStateNow } from './patch-hud-state-now';

const createState = (clock: number): HudState => ({ hud: createHud(), clock });

describe('patchHudStateNow', () => {
  it('should return the clock back at the start when the buttons moved it on', () => {
    expect(patchHudStateNow(createState(5 * HOUR_LENGTH)).clock).toBe(
      START_CLOCK,
    );
  });

  it('should return the clock at the start when it stands there already', () => {
    expect(patchHudStateNow(createState(START_CLOCK)).clock).toBe(START_CLOCK);
  });

  it('should return the very same HUD when it puts the clock back', () => {
    const state = createState(HOUR_LENGTH);

    expect(patchHudStateNow(state).hud).toBe(state.hud);
  });

  it('should not change the old state when it puts the clock back', () => {
    const state = createState(HOUR_LENGTH);

    patchHudStateNow(state);

    expect(state).toEqual(createState(HOUR_LENGTH));
  });
});
