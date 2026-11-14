import { describe, expect, it } from 'vitest';

import { formatGlslFloat } from './format-glsl-float';

describe('formatGlslFloat', () => {
  it('should return a decimal point when the number is whole', () => {
    expect(formatGlslFloat(24)).toBe('24.0000');
  });

  it('should return four decimal places when the number is a fraction', () => {
    expect(formatGlslFloat(0.25)).toBe('0.2500');
  });

  it('should return the sign when the number is negative', () => {
    expect(formatGlslFloat(-1.5)).toBe('-1.5000');
  });
});
