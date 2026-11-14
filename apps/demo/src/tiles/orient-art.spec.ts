import { describe, expect, it } from 'vitest';

import { orientArt } from './orient-art';

const ART = Object.freeze(['ab.', 'c..']);

describe('orientArt', () => {
  it('should return the art unchanged when it faces right', () => {
    expect(orientArt(ART, 'right')).toBe(ART);
  });

  it('should return the art mirrored when it faces left', () => {
    expect(orientArt(ART, 'left')).toEqual(['.ba', '..c']);
  });
});
