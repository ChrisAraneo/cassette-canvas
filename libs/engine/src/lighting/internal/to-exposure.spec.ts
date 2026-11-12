import { describe, expect, it } from 'vitest';

import { EXTENDED_SHADES_PER_STOP, REFERENCE_EXPOSURE } from '../consts';
import { toExposure } from './to-exposure';

describe('toExposure', () => {
  it('should give the reference exposure for the authored color', () => {
    expect(toExposure(0)).toBe(REFERENCE_EXPOSURE);
  });

  it('should double the light every stop up', () => {
    expect(toExposure(EXTENDED_SHADES_PER_STOP)).toBe(2 * REFERENCE_EXPOSURE);
  });

  it('should halve the light every stop down', () => {
    expect(toExposure(-EXTENDED_SHADES_PER_STOP)).toBe(REFERENCE_EXPOSURE / 2);
  });

  it('should double the light again every further stop up', () => {
    expect(toExposure(4 * EXTENDED_SHADES_PER_STOP)).toBe(16);
  });

  it('should rise with every shade in between', () => {
    expect(toExposure(1)).toBeGreaterThan(toExposure(0));
    expect(toExposure(2)).toBeGreaterThan(toExposure(1));
  });

  it('should always give some light, however dark the scene is', () => {
    expect(toExposure(-1000)).toBeGreaterThanOrEqual(0);
  });
});
