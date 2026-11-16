import { describe, expect, it } from 'vitest';

import { findLight } from './find-light';
import type { Light } from './types/light';
import type { Screen } from './types/screen';

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

const createLitScreen = (lights: Light[]): Screen => ({
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

  it('should return no light when no light carries the id', () => {
    expect(findLight(createLitScreen([TORCH, LANTERN]), 'sun')).toBeUndefined();
  });

  it('should not change the screen it is given when it finds a light', () => {
    const screen = createLitScreen([TORCH, LANTERN]);

    findLight(screen, 'lantern');

    expect(screen).toEqual(createLitScreen([TORCH, LANTERN]));
  });

  it('should return no light when the screen has no lights', () => {
    expect(findLight(createLitScreen([]), 'torch')).toBeUndefined();
  });
});
