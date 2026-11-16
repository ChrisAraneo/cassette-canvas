import { describe, expect, it } from 'vitest';

import { toOverlayWidth } from './to-overlay-width';

describe('toOverlayWidth', () => {
  it('should return the length of the row when the art holds one row', () => {
    expect(toOverlayWidth(['ox'])).toBe(2);
  });

  it('should return the length of the longest row when the rows differ', () => {
    expect(toOverlayWidth(['o', 'ooo', 'oo'])).toBe(3);
  });

  it('should return no width when there is no art', () => {
    expect(toOverlayWidth([])).toBe(0);
  });

  it('should return no width when every row is empty', () => {
    expect(toOverlayWidth(['', ''])).toBe(0);
  });
});
