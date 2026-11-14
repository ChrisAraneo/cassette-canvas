import { createHud } from '@cassette-canvas/engine';
import { describe, expect, it } from 'vitest';

import { computeDayCycle } from '../../day/compute-day-cycle';
import { HOURS_PER_DAY } from '../../day/consts';
import { HOUR_LENGTH, NOON_HOUR } from '../consts';
import type { HudState } from '../types/hud-state';
import { jumpClock } from './jump-clock';

const createState = (clock: number): HudState => ({ hud: createHud(), clock });

describe('jumpClock', () => {
  it('should return the clock moved to the hour when the animation has just started', () => {
    expect(jumpClock(createState(0), 0, NOON_HOUR).clock).toBe(3 * HOUR_LENGTH);
  });

  it('should return the clock counted from where the buttons already moved it when the state carries a clock', () => {
    expect(jumpClock(createState(HOUR_LENGTH), 0, NOON_HOUR).clock).toBeCloseTo(
      3 * HOUR_LENGTH,
    );
  });

  it('should return the clock counted from the time of the frame when the frame comes later', () => {
    expect(jumpClock(createState(0), HOUR_LENGTH, NOON_HOUR).clock).toBeCloseTo(
      2 * HOUR_LENGTH,
    );
  });

  it('should return the street showing the hour when it jumps the clock', () => {
    expect(
      computeDayCycle(jumpClock(createState(0), 0, NOON_HOUR).clock).phase,
    ).toBeCloseTo(NOON_HOUR / HOURS_PER_DAY);
  });

  it('should return the very same HUD when it jumps the clock', () => {
    const state = createState(0);

    expect(jumpClock(state, 0, NOON_HOUR).hud).toBe(state.hud);
  });
});
