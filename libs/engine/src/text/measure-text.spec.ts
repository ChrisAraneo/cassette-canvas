import { describe, expect, it } from 'vitest';

import { measureText } from './measure-text';

describe('measureText', () => {
  it('should return zero when the text is empty', () => {
    expect(measureText('')).toBe(0);
  });

  it('should return the width of every character added up when it measures a text', () => {
    expect(measureText('HI')).toBe(10);
  });

  it('should return less room when the character is narrow than when it is wide', () => {
    expect(measureText('i')).toBeLessThan(measureText('m'));
  });

  it('should return the width of a space when it does not know the character', () => {
    expect(measureText('é')).toBe(measureText(' '));
  });
});
