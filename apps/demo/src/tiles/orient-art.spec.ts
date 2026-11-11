import { describe, expect, it } from 'vitest';

import { orientArt } from './orient-art';

const ART = Object.freeze(['ab.', 'c..']);

describe('orientArt', () => {
  it('should keep the art as it is when it faces right', () => {
    expect(orientArt(ART, 'right')).toBe(ART);
  });

  it('should mirror the art when it faces left', () => {
    expect(orientArt(ART, 'left')).toEqual(['.ba', '..c']);
  });
});
