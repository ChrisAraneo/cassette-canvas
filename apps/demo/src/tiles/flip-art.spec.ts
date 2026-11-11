import { describe, expect, it } from 'vitest';

import { flipArt } from './flip-art';

describe('flipArt', () => {
  it('should mirror every row when it flips the art', () => {
    expect(flipArt(['ab.', '.cd'])).toEqual(['.ba', 'dc.']);
  });

  it('should pad short rows before it mirrors them when the rows differ in width', () => {
    expect(flipArt(['abc', 'd'])).toEqual(['cba', '..d']);
  });

  it('should give no rows when there is no art', () => {
    expect(flipArt([])).toEqual([]);
  });
});
