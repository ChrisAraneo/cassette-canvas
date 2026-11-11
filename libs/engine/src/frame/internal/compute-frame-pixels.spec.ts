import { describe, expect, it } from 'vitest';

import type { Screen } from '../../screen/types/screen';
import { computeFramePixels } from './compute-frame-pixels';

const SCREEN: Screen = Object.freeze({
  background: 0x91,
  ambient: -2,
  sprites: [
    { id: 'hero', sprite: [0x14], row: 1, column: 2, castsShadow: false },
    { id: 'wall', sprite: [0x34], row: 3, column: 0, castsShadow: true },
  ],
  lights: [{ id: 'torch', row: 0, column: 0, radius: 6, intensity: 3 }],
});

const computeScreenPixels = (screen: Screen) =>
  computeFramePixels({ screen, spriteSize: 1, width: 4, height: 5 });

describe('computeFramePixels', () => {
  it('should gather the pixels of every sprite in drawing order when the screen holds sprites', () => {
    expect(computeScreenPixels(SCREEN).pixels).toEqual([
      { row: 1, column: 2, pixel: 0x14, castsShadow: false },
      { row: 3, column: 0, pixel: 0x34, castsShadow: true },
    ]);
  });

  it('should give no pixels when the screen holds no sprites', () => {
    expect(computeScreenPixels({ ...SCREEN, sprites: [] }).pixels).toEqual([]);
  });

  it('should pass on the background of the screen', () => {
    expect(computeScreenPixels(SCREEN).background).toBe(0x91);
  });

  it('should pass on the ambient light of the screen', () => {
    expect(computeScreenPixels(SCREEN).ambient).toBe(-2);
  });

  it('should pass on the very same lights of the screen', () => {
    expect(computeScreenPixels(SCREEN).lights).toBe(SCREEN.lights);
  });

  it('should pass on the width', () => {
    expect(computeScreenPixels(SCREEN).width).toBe(4);
  });

  it('should pass on the height', () => {
    expect(computeScreenPixels(SCREEN).height).toBe(5);
  });
});
