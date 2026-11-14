import { describe, expect, it } from 'vitest';

import type { Light } from '../types/light';
import { filterOtherLights } from './filter-other-lights';

const TORCH: Light = {
  id: 'torch',
  row: 4,
  column: 4,
  radius: 10,
  intensity: 3,
};

const LANTERN: Light = {
  id: 'lantern',
  row: 9,
  column: 2,
  radius: 20,
  intensity: 4,
};

describe('filterOtherLights', () => {
  it('should return the other lights when one carries the id', () => {
    expect(filterOtherLights([TORCH, LANTERN], 'torch')).toEqual([LANTERN]);
  });

  it('should return every light in order when none carries the id', () => {
    expect(filterOtherLights([TORCH, LANTERN], 'sun')).toEqual([
      TORCH,
      LANTERN,
    ]);
  });

  it('should return no lights when there are none', () => {
    expect(filterOtherLights([], 'torch')).toEqual([]);
  });
});
