import { describe, expect, it } from 'vitest';

import type { Lighting } from '../../lighting/types/lighting';
import { patchFrame } from './patch-frame';

const LIGHTING: Lighting = Object.freeze({
  ambient: 0,
  lights: [],
  width: 2,
  height: 2,
  occluders: {},
});

describe('patchFrame', () => {
  it('should draw each edit over the background when it patches the frame', () => {
    expect(
      patchFrame({
        background: 0x91,
        size: 4,
        edits: { 1: 0x14, 3: 0x34 },
        lighting: LIGHTING,
      }).pixels,
    ).toEqual([0x91, 0x14, 0x91, 0x34]);
  });

  it('should fill the frame with the background when there are no edits', () => {
    expect(
      patchFrame({ background: 0x91, size: 3, edits: {}, lighting: LIGHTING })
        .pixels,
    ).toEqual([0x91, 0x91, 0x91]);
  });

  it('should give an empty frame when the frame has no places', () => {
    expect(
      patchFrame({ background: 0x91, size: 0, edits: {}, lighting: LIGHTING })
        .pixels,
    ).toEqual([]);
  });

  it('should pass on the very same lighting', () => {
    expect(
      patchFrame({ background: 0x91, size: 0, edits: {}, lighting: LIGHTING })
        .lighting,
    ).toBe(LIGHTING);
  });

  it('should not change the edits when it patches the frame', () => {
    const edits = { 1: 0x14 };

    patchFrame({ background: 0x91, size: 2, edits, lighting: LIGHTING });

    expect(edits).toEqual({ 1: 0x14 });
  });
});
