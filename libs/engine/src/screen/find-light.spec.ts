import { describe, expect, it } from 'vitest';

import { findLight } from './find-light';
import type { Light } from './types/light';

const TORCH: Light = {
  id: 'torch',
  row: 4,
  column: 4,
  radius: 10,
  intensity: 3,
};

const LANTERN: Light = {
  id: 'lantern',
  row: 9,
  column: 2,
  radius: 20,
  intensity: 4,
};

const createLitScreen = (lights: Light[]) => ({
  background: 0x91,
  ambient: -3,
  sprites: [],
  lights,
  overlays: [],
});

describe('findLight', () => {
  it('should return the light when the screen holds it', () => {
    expect(findLight(createLitScreen([TORCH, LANTERN]), 'lantern')).toBe(
      LANTERN,
    );
  });

  it('should return undefined when no light carries the id', () => {
    expect(findLight(createLitScreen([TORCH, LANTERN]), 'sun')).toBeUndefined();
  });

  it('should return undefined when the screen has no lights', () => {
    expect(findLight(createLitScreen([]), 'torch')).toBeUndefined();
  });
});
