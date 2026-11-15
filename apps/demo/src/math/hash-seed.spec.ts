import { every, map, range, uniq, size } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { hashSeed } from './hash-seed';

describe('hashSeed', () => {
  it('should give a number from 0 up to 1 when it hashes a seed', () => {
    expect(
      every(map(range(100), hashSeed), (hash) => hash >= 0 && hash < 1),
    ).toBe(true);
  });

  it('should give the same number when it hashes the same seed again', () => {
    expect(hashSeed(42)).toBe(hashSeed(42));
  });

  it('should give different numbers when the seeds are neighbors', () => {
    expect(size(uniq(map(range(20), hashSeed)))).toBe(20);
  });
});
