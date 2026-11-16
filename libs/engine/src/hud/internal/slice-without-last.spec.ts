import { describe, expect, it } from 'vitest';

import { sliceWithoutLast } from './slice-without-last';

describe('sliceWithoutLast', () => {
  it('should return the text without its last letter when it takes one off', () => {
    expect(sliceWithoutLast('TAPE')).toBe('TAP');
  });

  it('should return nothing when the text holds one letter', () => {
    expect(sliceWithoutLast('A')).toBe('');
  });

  it('should return nothing when the text is empty', () => {
    expect(sliceWithoutLast('')).toBe('');
  });
});
