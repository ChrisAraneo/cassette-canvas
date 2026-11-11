import { describe, expect, it } from 'vitest';

import { TRACK_LENGTH, TRACK_MARGIN } from '../consts';
import { computeTrackColumn } from './compute-track-column';

describe('computeTrackColumn', () => {
  it('should start at its offset along the track when no time has passed', () => {
    expect(computeTrackColumn({ speed: 20, offset: 100 }, 0)).toBe(
      100 - TRACK_MARGIN,
    );
  });

  it('should move right by its speed when one second has passed', () => {
    expect(computeTrackColumn({ speed: 20, offset: 100 }, 1000)).toBe(
      120 - TRACK_MARGIN,
    );
  });

  it('should move left when its speed is negative', () => {
    expect(computeTrackColumn({ speed: -20, offset: 100 }, 1000)).toBe(
      80 - TRACK_MARGIN,
    );
  });

  it('should come back from the left when it has run off the right end', () => {
    expect(
      computeTrackColumn({ speed: 10, offset: TRACK_LENGTH - 5 }, 1000),
    ).toBe(5 - TRACK_MARGIN);
  });

  it('should come back from the right when it has run off the left end', () => {
    expect(computeTrackColumn({ speed: -10, offset: 5 }, 1000)).toBe(
      TRACK_LENGTH - 5 - TRACK_MARGIN,
    );
  });

  it('should stay on whole pixels when the time is between pixels', () => {
    expect(computeTrackColumn({ speed: 3, offset: 0 }, 500)).toBe(
      1 - TRACK_MARGIN,
    );
  });
});
