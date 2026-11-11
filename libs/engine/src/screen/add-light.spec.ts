import { map } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { addLight } from './add-light';
import type { Screen } from './types/screen';

const TORCH = Object.freeze({ row: 4, column: 4, radius: 10, intensity: 3 });

const createTorchScreen = (): Screen => ({
  background: 0x91,
  ambient: -3,
  sprites: [],
  lights: [{ id: 'torch', ...TORCH }],
});

describe('addLight', () => {
  it('should put the light where its settings say when it adds it', () => {
    expect(
      addLight(createTorchScreen(), 'lantern', {
        row: 9,
        column: 2,
        radius: 20,
        intensity: 4,
      }).lights[1],
    ).toEqual({ id: 'lantern', row: 9, column: 2, radius: 20, intensity: 4 });
  });

  it('should keep the lights that were there when it adds one', () => {
    expect(
      map(
        addLight(createTorchScreen(), 'lantern', TORCH).lights,
        (light) => light.id,
      ),
    ).toEqual(['torch', 'lantern']);
  });

  it('should take the old light off when one with the same id is added again', () => {
    expect(
      addLight(createTorchScreen(), 'torch', { ...TORCH, intensity: 1 }).lights,
    ).toEqual([{ id: 'torch', ...TORCH, intensity: 1 }]);
  });

  it('should keep the very same sprites when it adds a light', () => {
    const screen = createTorchScreen();

    expect(addLight(screen, 'lantern', TORCH).sprites).toBe(screen.sprites);
  });

  it('should not change the old screen when it adds a light', () => {
    const screen = createTorchScreen();

    addLight(screen, 'lantern', TORCH);

    expect(screen).toEqual(createTorchScreen());
  });
});
