import { describe, expect, it } from 'vitest';

import { patchAmbient } from './patch-ambient';
import type { Screen } from './types/screen';

const createDayScreen = (): Screen => ({
  background: 0x91,
  ambient: 0,
  sprites: [
    { id: 'hero', sprite: [0x14], row: 0, column: 0, castsShadow: false },
  ],
  lights: [],
  overlays: [],
});

describe('patchAmbient', () => {
  it('should set the ambient light when it changes it', () => {
    expect(patchAmbient(createDayScreen(), -3).ambient).toBe(-3);
  });

  it('should keep the very same sprites when it changes the ambient light', () => {
    const screen = createDayScreen();

    expect(patchAmbient(screen, -3).sprites).toBe(screen.sprites);
  });

  it('should not change the old screen when it changes the ambient light', () => {
    const screen = createDayScreen();

    patchAmbient(screen, -3);

    expect(screen).toEqual(createDayScreen());
  });
});
