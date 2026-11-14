import { describe, expect, it } from 'vitest';

import { isIndex } from './is-index';

describe('isIndex', () => {
  it('should return true when the position falls inside the collection', () => {
    expect(isIndex(0, 8)).toBe(true);
    expect(isIndex(7, 8)).toBe(true);
  });

  it('should return false when the position falls past the end', () => {
    expect(isIndex(8, 8)).toBe(false);
  });

  it('should return false when the position is negative', () => {
    expect(isIndex(-1, 8)).toBe(false);
  });

  it('should return false when the position is a fraction', () => {
    expect(isIndex(1.5, 8)).toBe(false);
  });

  it('should return false for every position when the collection is empty', () => {
    expect(isIndex(0, 0)).toBe(false);
  });
});
