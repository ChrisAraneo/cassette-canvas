import { every, map, range, uniq, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { computeHash } from './compute-hash';

describe('computeHash', () => {
  it('should give a number from 0 up to 1 when it hashes a seed', () => {
    expect(
      every(map(range(100), computeHash), (hash) => hash >= 0 && hash < 1),
    ).toBe(true);
  });

  it('should give the same number when it hashes the same seed again', () => {
    expect(computeHash(42)).toBe(computeHash(42));
  });

  it('should give different numbers when the seeds are neighbors', () => {
    expect(size(uniq(map(range(20), computeHash)))).toBe(20);
  });
});
