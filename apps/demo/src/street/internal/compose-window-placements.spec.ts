import type { SpritePlacement } from '@cassette-canvas/engine';
import { map } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { composeWindowPlacements } from './compose-window-placements';

const glow = (id: string): SpritePlacement => ({
  id,
  sprite: [0x36],
  row: 0,
  column: 0,
  castsShadow: false,
});

const WINDOWS = Object.freeze([
  { placements: [glow('early')], dusk: 0.4, bedtime: 10 },
  { placements: [glow('late')], dusk: 0.9, bedtime: 14 },
]);

/** 20:00 and 1:00, as phases of the day. */
const EVENING = 20 / 24;

const NIGHT = 1 / 24;

describe('composeWindowPlacements', () => {
  it('should light no window when it is daylight', () => {
    expect(
      composeWindowPlacements(WINDOWS, { phase: 0.5, darkness: 0 }),
    ).toEqual([]);
  });

  it('should light only the windows whose dusk has come when night is falling', () => {
    expect(
      map(
        composeWindowPlacements(WINDOWS, { phase: EVENING, darkness: 0.5 }),
        'id',
      ),
    ).toEqual(['early']);
  });

  it('should light every window when it is dark before bedtime', () => {
    expect(
      map(
        composeWindowPlacements(WINDOWS, { phase: EVENING, darkness: 1 }),
        'id',
      ),
    ).toEqual(['early', 'late']);
  });

  it('should put a window out when its bedtime has passed', () => {
    expect(
      map(
        composeWindowPlacements(WINDOWS, { phase: NIGHT, darkness: 1 }),
        'id',
      ),
    ).toEqual(['late']);
  });
});
