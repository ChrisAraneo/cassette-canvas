import { describe, expect, it } from 'vitest';

import { TEXT_GAP } from '../../text/consts';
import { measureText } from '../../text/measure-text';
import { computeTextWidth } from './compute-text-width';

describe('computeTextWidth', () => {
  it('should return the width without the gap after the last character when it measures a text', () => {
    expect(computeTextWidth('HI')).toBe(measureText('HI') - TEXT_GAP);
  });

  it('should return 0 when the text is empty', () => {
    expect(computeTextWidth('')).toBe(0);
  });
});
