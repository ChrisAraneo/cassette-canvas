import { describe, expect, it } from 'vitest';

import { flipArt } from './flip-art';

describe('flipArt', () => {
  it('should return every row mirrored when it flips the art', () => {
    expect(flipArt(['ab.', '.cd'])).toEqual(['.ba', 'dc.']);
  });

  it('should return short rows padded before mirroring when the rows differ in width', () => {
    expect(flipArt(['abc', 'd'])).toEqual(['cba', '..d']);
  });

  it('should return no rows when there is no art', () => {
    expect(flipArt([])).toEqual([]);
  });
});
