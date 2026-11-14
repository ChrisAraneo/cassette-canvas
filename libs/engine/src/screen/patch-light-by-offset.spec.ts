import { describe, expect, it } from 'vitest';

import { patchLightByOffset } from './patch-light-by-offset';
import type { Screen } from './types/screen';

const createTorchScreen = (): Screen => ({
  background: 0x91,
  ambient: -3,
  sprites: [],
  lights: [{ id: 'torch', row: 4, column: 4, radius: 10, intensity: 3 }],
  overlays: [],
});

describe('patchLightByOffset', () => {
  it('should return the light moved down and right when the offsets are positive', () => {
    expect(
      patchLightByOffset(createTorchScreen(), 'torch', 2, 5).lights,
    ).toEqual([{ id: 'torch', row: 6, column: 9, radius: 10, intensity: 3 }]);
  });

  it('should return the light moved up and left when the offsets are negative', () => {
    expect(
      patchLightByOffset(createTorchScreen(), 'torch', -6, -5).lights,
    ).toEqual([{ id: 'torch', row: -2, column: -1, radius: 10, intensity: 3 }]);
  });

  it('should return the very same screen when no light carries the id', () => {
    const screen = createTorchScreen();

    expect(patchLightByOffset(screen, 'sun', 2, 5)).toBe(screen);
  });

  it('should not change the old screen when it moves a light', () => {
    const screen = createTorchScreen();

    patchLightByOffset(screen, 'torch', 2, 5);

    expect(screen).toEqual(createTorchScreen());
  });
});
