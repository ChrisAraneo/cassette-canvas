import { describe, expect, it } from 'vitest';

import type { Light } from '../types/light';
import { patchMatchingLight } from './patch-matching-light';

const TORCH: Light = Object.freeze({
  id: 'torch',
  row: 4,
  column: 4,
  radius: 10,
  intensity: 3,
});

describe('patchMatchingLight', () => {
  it('should apply every change when the light carries the id', () => {
    expect(
      patchMatchingLight(TORCH, 'torch', {
        row: 8,
        column: 9,
        radius: 16,
        intensity: 2,
      }),
    ).toEqual({ id: 'torch', row: 8, column: 9, radius: 16, intensity: 2 });
  });

  it('should keep the parts that are not changed when only some change', () => {
    expect(patchMatchingLight(TORCH, 'torch', { intensity: 1 })).toEqual({
      ...TORCH,
      intensity: 1,
    });
  });

  it('should give back the very same light when it carries another id', () => {
    expect(patchMatchingLight(TORCH, 'lantern', { row: 8 })).toBe(TORCH);
  });
});
