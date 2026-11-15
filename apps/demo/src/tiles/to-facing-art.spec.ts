import { describe, expect, it } from 'vitest';

import { toFacingArt } from './to-facing-art';

const ART: readonly string[] = Object.freeze(['ab.', 'c..']);

describe('toFacingArt', () => {
  it('should give the art as it is when it faces right', () => {
    expect(toFacingArt(ART, 'RIGHT')).toBe(ART);
  });

  it('should give the art mirrored when it faces left', () => {
    expect(toFacingArt(ART, 'LEFT')).toEqual(['.ba', '..c']);
  });

  it('should give no rows when there is no art', () => {
    expect(toFacingArt([], 'LEFT')).toEqual([]);
  });

  it('should not change the old art when it turns the art around', () => {
    toFacingArt(ART, 'LEFT');

    expect(ART).toEqual(['ab.', 'c..']);
  });
});
