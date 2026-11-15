import { describe, expect, it } from 'vitest';

import { computeTextAdvance } from './compute-text-advance';
import { TEXT_BOLT, TEXT_HEART } from './consts';

describe('computeTextAdvance', () => {
  it('should return zero when the text is empty', () => {
    expect(computeTextAdvance('')).toBe(0);
  });

  it('should return the width of every character added up when it adds up its characters', () => {
    expect(computeTextAdvance('HI')).toBe(10);
  });

  it('should return less room when the character is narrow than when it is wide', () => {
    expect(computeTextAdvance('i')).toBeLessThan(computeTextAdvance('m'));
  });

  it('should return the width of a space when it does not know the character', () => {
    expect(computeTextAdvance('é')).toBe(computeTextAdvance(' '));
  });

  it('should return room for the heart and the bolt when the text holds them', () => {
    expect(computeTextAdvance(`${TEXT_HEART}${TEXT_BOLT}`)).toBe(12);
  });
});
