import { describe, expect, it } from 'vitest';

import { isIndex } from './is-index';

describe('isIndex', () => {
  it('should accept the position when it falls inside the collection', () => {
    expect(isIndex(0, 8)).toBe(true);
    expect(isIndex(7, 8)).toBe(true);
  });

  it('should refuse the position when it falls past the end', () => {
    expect(isIndex(8, 8)).toBe(false);
  });

  it('should refuse the position when it is negative', () => {
    expect(isIndex(-1, 8)).toBe(false);
  });

  it('should refuse the position when it is a fraction', () => {
    expect(isIndex(1.5, 8)).toBe(false);
  });

  it('should refuse every position when the collection is empty', () => {
    expect(isIndex(0, 0)).toBe(false);
  });
});
