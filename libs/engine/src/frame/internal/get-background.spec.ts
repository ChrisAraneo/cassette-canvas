import { describe, expect, it } from 'vitest';

import { TRANSPARENT } from '../../palette/consts';
import type { Screen } from '../../screen/types/screen';
import { getBackground } from './get-background';

const NOT_A_PIXEL = 0x0a;

const createScreen = (background: number): Screen => ({
  background,
  ambient: 0,
  sprites: [],
  lights: [],
  overlays: [],
});

describe('getBackground', () => {
  it('should return the background when the screen names a color it can draw', () => {
    expect(getBackground(createScreen(0x91))).toBe(0x91);
  });

  it('should return a clear background when the screen names no color at all', () => {
    expect(getBackground(createScreen(TRANSPARENT))).toBe(TRANSPARENT);
  });

  it('should return a clear background when the screen names a color it cannot draw', () => {
    expect(getBackground(createScreen(NOT_A_PIXEL))).toBe(TRANSPARENT);
  });
});
