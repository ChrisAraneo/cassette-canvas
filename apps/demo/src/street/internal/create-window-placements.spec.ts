import type { SpritePlacement } from '@cassette-canvas/engine';
import { map } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { createWindowPlacements } from './create-window-placements';

const createGlow = (id: string): SpritePlacement => ({
  id,
  sprite: [0x36],
  row: 0,
  column: 0,
  castsShadow: false,
});

const WINDOWS = Object.freeze([
  { placements: [createGlow('early')], dusk: 0.4, bedtime: 10 },
  { placements: [createGlow('late')], dusk: 0.9, bedtime: 14 },
]);

const EVENING = 20 / 24;

const NIGHT = 1 / 24;

describe('createWindowPlacements', () => {
  it('should return no window when it is daylight', () => {
    expect(
      createWindowPlacements(WINDOWS, { phase: 0.5, darkness: 0 }),
    ).toEqual([]);
  });

  it('should return only the windows whose dusk has come when night is falling', () => {
    expect(
      map(
        createWindowPlacements(WINDOWS, { phase: EVENING, darkness: 0.5 }),
        'id',
      ),
    ).toEqual(['early']);
  });

  it('should return every window when it is dark before bedtime', () => {
    expect(
      map(
        createWindowPlacements(WINDOWS, { phase: EVENING, darkness: 1 }),
        'id',
      ),
    ).toEqual(['early', 'late']);
  });

  it('should return no window when its bedtime has passed', () => {
    expect(
      map(createWindowPlacements(WINDOWS, { phase: NIGHT, darkness: 1 }), 'id'),
    ).toEqual(['late']);
  });
});
