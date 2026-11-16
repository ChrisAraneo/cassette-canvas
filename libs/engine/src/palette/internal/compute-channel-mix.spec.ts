import { describe, expect, it } from 'vitest';

import { computeChannelMix } from './compute-channel-mix';

const DARK = 20;

const BRIGHT = 220;

describe('computeChannelMix', () => {
  it('should return the channel when it mixes in none of the target', () => {
    expect(computeChannelMix(DARK, BRIGHT, 0)).toBe(DARK);
  });

  it('should return the target when it mixes in all of it', () => {
    expect(computeChannelMix(DARK, BRIGHT, 1)).toBe(BRIGHT);
  });

  it('should return the channel halfway when it mixes in half of the target', () => {
    expect(computeChannelMix(DARK, BRIGHT, 0.5)).toBe(120);
  });

  it('should return a whole number when the mix falls between two', () => {
    expect(computeChannelMix(1, 2, 0.5)).toBe(2);
  });

  it('should return the channel when the target is the same', () => {
    expect(computeChannelMix(DARK, DARK, 0.5)).toBe(DARK);
  });
});
