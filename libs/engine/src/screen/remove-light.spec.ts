import { describe, expect, it } from 'vitest';

import { removeLight } from './remove-light';
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

const createLitScreen = (): Screen => ({
  background: 0x91,
  ambient: -3,
  sprites: [],
  lights: [TORCH, LANTERN],
});

describe('removeLight', () => {
  it('should take the light off when the screen holds it', () => {
    expect(removeLight(createLitScreen(), 'torch').lights).toEqual([LANTERN]);
  });

  it('should keep every light when none carries the id', () => {
    expect(removeLight(createLitScreen(), 'sun').lights).toEqual([
      TORCH,
      LANTERN,
    ]);
  });

  it('should give no lights when the screen has none', () => {
    expect(
      removeLight({ ...createLitScreen(), lights: [] }, 'torch').lights,
    ).toEqual([]);
  });

  it('should not change the old screen when it takes a light off', () => {
    const screen = createLitScreen();

    removeLight(screen, 'torch');

    expect(screen).toEqual(createLitScreen());
  });
});
