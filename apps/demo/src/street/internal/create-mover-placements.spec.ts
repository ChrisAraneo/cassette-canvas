import { map } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { TRACK_MARGIN } from '../consts';
import { createMoverPlacements } from './create-mover-placements';

const MOVER = Object.freeze({
  id: 'walker',
  frames: [
    [{ sprite: [0x14], row: 0, column: 0 }],
    [{ sprite: [0x54], row: 0, column: 0 }],
  ],
  row: 120,
  speed: 10,
  offset: 50,
  frameDuration: 200,
  castsShadow: true,
});

describe('createMoverPlacements', () => {
  it('should return the first frame where the mover starts when no time has passed', () => {
    expect(createMoverPlacements(MOVER, 0)).toEqual([
      {
        id: 'walker-0-0',
        sprite: [0x14],
        row: 120,
        column: 50 - TRACK_MARGIN,
        castsShadow: true,
      },
    ]);
  });

  it('should return the next frame when one frame has passed', () => {
    expect(map(createMoverPlacements(MOVER, 200), 'sprite')).toEqual([[0x54]]);
  });

  it('should return the first frame again when the last one has passed', () => {
    expect(map(createMoverPlacements(MOVER, 400), 'sprite')).toEqual([[0x14]]);
  });

  it('should return no placement when the mover has no frames', () => {
    expect(createMoverPlacements({ ...MOVER, frames: [] }, 0)).toEqual([]);
  });

  it('should return the mover moved along the track when time passes', () => {
    expect(createMoverPlacements(MOVER, 1000)[0]?.column).toBe(
      60 - TRACK_MARGIN,
    );
  });
});
