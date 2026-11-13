import { describe, expect, it } from 'vitest';

import { TEXT_GAP } from '../../text/consts';
import { measureText } from '../../text/measure-text';
import { computeTextWidth } from './compute-text-width';

describe('computeTextWidth', () => {
  it('should leave the gap after the last character out', () => {
    expect(computeTextWidth('HI')).toBe(measureText('HI') - TEXT_GAP);
  });

  it('should give nothing for an empty text', () => {
    expect(computeTextWidth('')).toBe(0);
  });
});
