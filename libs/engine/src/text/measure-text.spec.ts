import { describe, expect, it } from 'vitest';

import { measureText } from './measure-text';

describe('measureText', () => {
  it('should give nothing for an empty text', () => {
    expect(measureText('')).toBe(0);
  });

  it('should add up the width of every character', () => {
    expect(measureText('HI')).toBe(10);
  });

  it('should give a narrow character less room than a wide one', () => {
    expect(measureText('i')).toBeLessThan(measureText('m'));
  });

  it('should move the pen like a space for a character it does not know', () => {
    expect(measureText('é')).toBe(measureText(' '));
  });
});
