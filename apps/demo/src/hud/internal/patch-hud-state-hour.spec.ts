import { createHud } from '@cassette-canvas/engine';
import { describe, expect, it } from 'vitest';

import { HOUR_LENGTH, START_CLOCK } from '../consts';
import type { HudState } from '../types/hud-state';
import { patchHudStateHour } from './patch-hud-state-hour';

const createState = (clock: number): HudState => ({ hud: createHud(), clock });

describe('patchHudStateHour', () => {
  it('should return the clock an hour on when the street follows the animation', () => {
    expect(patchHudStateHour(createState(START_CLOCK)).clock).toBe(HOUR_LENGTH);
  });

  it('should return the clock an hour on from where it stood when the buttons already moved it', () => {
    expect(patchHudStateHour(createState(HOUR_LENGTH)).clock).toBe(
      2 * HOUR_LENGTH,
    );
  });

  it('should return the very same HUD when it moves the clock', () => {
    const state = createState(START_CLOCK);

    expect(patchHudStateHour(state).hud).toBe(state.hud);
  });

  it('should not change the old state when it moves the clock', () => {
    const state = createState(START_CLOCK);

    patchHudStateHour(state);

    expect(state).toEqual(createState(START_CLOCK));
  });
});
