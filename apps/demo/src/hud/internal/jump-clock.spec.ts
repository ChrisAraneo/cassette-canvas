import { createHud } from '@cassette-canvas/engine';
import { describe, expect, it } from 'vitest';

import { computeDayCycle } from '../../day/compute-day-cycle';
import { HOURS_PER_DAY } from '../../day/consts';
import { HOUR_LENGTH, NOON_HOUR } from '../consts';
import type { HudState } from '../types/hud-state';
import { jumpClock } from './jump-clock';

const createState = (clock: number): HudState => ({ hud: createHud(), clock });

describe('jumpClock', () => {
  it('should move the clock from the start of the animation to the hour', () => {
    expect(jumpClock(createState(0), 0, NOON_HOUR).clock).toBe(3 * HOUR_LENGTH);
  });

  it('should count from where the buttons already moved the clock', () => {
    expect(jumpClock(createState(HOUR_LENGTH), 0, NOON_HOUR).clock).toBeCloseTo(
      3 * HOUR_LENGTH,
    );
  });

  it('should count from the time of the frame', () => {
    expect(jumpClock(createState(0), HOUR_LENGTH, NOON_HOUR).clock).toBeCloseTo(
      2 * HOUR_LENGTH,
    );
  });

  it('should leave the street showing the hour it jumped to', () => {
    expect(
      computeDayCycle(jumpClock(createState(0), 0, NOON_HOUR).clock).phase,
    ).toBeCloseTo(NOON_HOUR / HOURS_PER_DAY);
  });

  it('should leave the windows alone', () => {
    const state = createState(0);

    expect(jumpClock(state, 0, NOON_HOUR).hud).toBe(state.hud);
  });
});
