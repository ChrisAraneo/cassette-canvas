import { describe, expect, it } from 'vitest';

import { EXTENDED_SHADES_PER_STOP, REFERENCE_EXPOSURE } from '../consts';
import { toExposure } from './to-exposure';

describe('toExposure', () => {
  it('should return the reference exposure when the shade is the authored color', () => {
    expect(toExposure(0)).toBe(REFERENCE_EXPOSURE);
  });

  it('should return double the light when the shade is one stop up', () => {
    expect(toExposure(EXTENDED_SHADES_PER_STOP)).toBe(2 * REFERENCE_EXPOSURE);
  });

  it('should return half the light when the shade is one stop down', () => {
    expect(toExposure(-EXTENDED_SHADES_PER_STOP)).toBe(REFERENCE_EXPOSURE / 2);
  });

  it('should return double the light again when the shade is a further stop up', () => {
    expect(toExposure(4 * EXTENDED_SHADES_PER_STOP)).toBe(16);
  });

  it('should return more light when the shade is one in between', () => {
    expect(toExposure(1)).toBeGreaterThan(toExposure(0));
    expect(toExposure(2)).toBeGreaterThan(toExposure(1));
  });

  it('should return some light when the shade is far below the darkest', () => {
    expect(toExposure(-1000)).toBeGreaterThanOrEqual(0);
  });
});
