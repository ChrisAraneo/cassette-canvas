import { describe, expect, it } from 'vitest';

import { TRANSPARENT } from '../../palette/consts';
import { computeCaretPixel } from './compute-caret-pixel';

const TEXT_PIXEL = 0xf1;

describe('computeCaretPixel', () => {
  it('should draw the caret in the color of the text when the field has the focus', () => {
    expect(computeCaretPixel(TEXT_PIXEL, true)).toBe(TEXT_PIXEL);
  });

  it('should draw no caret at all when the field does not have the focus', () => {
    expect(computeCaretPixel(TEXT_PIXEL, false)).toBe(TRANSPARENT);
  });
});
