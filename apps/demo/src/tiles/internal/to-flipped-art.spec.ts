import { describe, expect, it } from 'vitest';

import { toFlippedArt } from './to-flipped-art';

const ART: readonly string[] = Object.freeze(['ab.', '.cd']);

describe('toFlippedArt', () => {
  it('should give every row mirrored when it flips the art', () => {
    expect(toFlippedArt(['ab.', '.cd'])).toEqual(['.ba', 'dc.']);
  });

  it('should pad the short rows before mirroring when the rows differ in width', () => {
    expect(toFlippedArt(['abc', 'd'])).toEqual(['cba', '..d']);
  });

  it('should give no rows when there is no art', () => {
    expect(toFlippedArt([])).toEqual([]);
  });

  it('should not change the old art when it flips the art', () => {
    toFlippedArt(ART);

    expect(ART).toEqual(['ab.', '.cd']);
  });
});
