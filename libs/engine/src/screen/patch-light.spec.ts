import { describe, expect, it } from 'vitest';

import { patchLight } from './patch-light';
import type { Light } from './types/light';
import type { Screen } from './types/screen';

const TORCH: Light = Object.freeze({
  id: 'torch',
  row: 4,
  column: 4,
  radius: 10,
  intensity: 3,
});

const LANTERN: Light = Object.freeze({
  id: 'lantern',
  row: 9,
  column: 2,
  radius: 20,
  intensity: 4,
});

const createLitScreen = (): Screen => ({
  background: 0x91,
  ambient: -3,
  sprites: [],
  lights: [TORCH, LANTERN],
  overlays: [],
});

describe('patchLight', () => {
  it('should return the light moved when it gets a new row and column', () => {
    expect(
      patchLight(createLitScreen(), 'torch', { row: 7, column: 8 }).lights[0],
    ).toEqual({ ...TORCH, row: 7, column: 8 });
  });

  it('should return the new intensity and radius when it gets new values', () => {
    expect(
      patchLight(createLitScreen(), 'torch', { radius: 5, intensity: 1 })
        .lights[0],
    ).toEqual({ ...TORCH, radius: 5, intensity: 1 });
  });

  it('should return the very same other lights when it changes one', () => {
    expect(patchLight(createLitScreen(), 'torch', { row: 7 }).lights[1]).toBe(
      LANTERN,
    );
  });

  it('should return the same lights when no light carries the id', () => {
    expect(patchLight(createLitScreen(), 'sun', { row: 7 }).lights).toEqual([
      TORCH,
      LANTERN,
    ]);
  });

  it('should not change the old screen when it changes a light', () => {
    const screen = createLitScreen();

    patchLight(screen, 'torch', { row: 7 });

    expect(screen).toEqual(createLitScreen());
  });
});
