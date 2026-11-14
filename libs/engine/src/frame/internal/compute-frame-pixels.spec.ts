import { chunk, invert, join, map, toArray } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { TRANSPARENT } from '../../palette/consts';
import type { Light } from '../../screen/types/light';
import type { Screen } from '../../screen/types/screen';
import type { SpritePlacement } from '../../screen/types/sprite-placement';
import { computeFramePixels } from './compute-frame-pixels';

const BACKGROUND = 0x91;

const NOT_A_PIXEL = 0x0a;

const PIXELS: Readonly<Record<string, number>> = Object.freeze({
  '.': TRANSPARENT,
  b: BACKGROUND,
  r: 0x14,
  g: 0x54,
});

const SYMBOLS = invert(PIXELS);

const LIGHTS: readonly Light[] = Object.freeze([
  { id: 'torch', row: 0, column: 0, radius: 6, intensity: 3 },
]);

const placeSprite = (
  sprite: readonly number[],
  row: number,
  column: number,
): SpritePlacement => ({
  id: 'sprite',
  sprite,
  row,
  column,
  castsShadow: false,
});

const placeShadowCaster = (
  sprite: readonly number[],
  row: number,
  column: number,
): SpritePlacement => ({
  ...placeSprite(sprite, row, column),
  castsShadow: true,
});

const createSpriteScreen = (sprites: readonly SpritePlacement[]): Screen => ({
  background: BACKGROUND,
  ambient: -2,
  sprites,
  lights: LIGHTS,
  overlays: [],
});

const computePixels = (
  screen: Screen,
  spriteSize: number,
  width: number,
  height: number,
): string[] =>
  map(
    chunk(
      toArray(computeFramePixels({ screen, spriteSize, width, height }).pixels),
      width,
    ),
    (row) =>
      join(
        map(row, (pixel) => SYMBOLS[pixel] ?? '?'),
        '',
      ),
  );

const computeOccluders = (
  screen: Screen,
  spriteSize: number,
  width: number,
): number[] =>
  toArray(
    computeFramePixels({ screen, spriteSize, width, height: 1 }).lighting
      .occluders,
  );

describe('computeFramePixels', () => {
  it('should return each sprite row by row from its corner over the background when it composes the pixels', () => {
    const screen = createSpriteScreen([
      placeSprite([0x14, 0x54, 0x54, 0x14], 1, 1),
    ]);

    expect(computePixels(screen, 2, 4, 3)).toEqual(['bbbb', 'brgb', 'bgrb']);
  });

  it('should return the later sprite over the earlier one when they overlap', () => {
    const screen = createSpriteScreen([
      placeSprite([0x14, 0x14], 0, 0),
      placeSprite([0x54, 0x54], 0, 1),
    ]);

    expect(computePixels(screen, 2, 3, 1)).toEqual(['rgg']);
  });

  it('should return the sprite below when a pixel is transparent', () => {
    const screen = createSpriteScreen([
      placeSprite([0x14, 0x14], 0, 0),
      placeSprite([0x54, TRANSPARENT], 0, 0),
    ]);

    expect(computePixels(screen, 2, 2, 1)).toEqual(['gr']);
  });

  it('should return the place unchanged when a sprite pixel is not a pixel', () => {
    const screen = createSpriteScreen([placeSprite([NOT_A_PIXEL], 0, 0)]);

    expect(computePixels(screen, 1, 1, 1)).toEqual(['b']);
  });

  it('should return the sprites clipped when they hang over the edges', () => {
    const screen = createSpriteScreen([
      placeSprite([0x54, 0x54, 0x54, 0x54], -1, -1),
      placeSprite([0x14, 0x14, 0x14, TRANSPARENT], 2, 3),
    ]);

    expect(computePixels(screen, 2, 4, 3)).toEqual(['gbbb', 'bbbb', 'bbbr']);
  });

  it('should return the sprite snapped to the pixel grid when it sits between pixels', () => {
    const screen = createSpriteScreen([placeSprite([0x14], 0.75, 1.5)]);

    expect(computePixels(screen, 1, 3, 1)).toEqual(['brb']);
  });

  it('should return no extra pixels when the sprite holds more than its size', () => {
    const screen = createSpriteScreen([placeSprite([0x14, 0x54], 0, 0)]);

    expect(computePixels(screen, 1, 2, 1)).toEqual(['rb']);
  });

  it('should return the frame filled with the background when the screen holds no sprites', () => {
    expect(computePixels(createSpriteScreen([]), 2, 3, 2)).toEqual([
      'bbb',
      'bbb',
    ]);
  });

  it('should return every place transparent when the background is not a pixel', () => {
    const screen = { ...createSpriteScreen([]), background: NOT_A_PIXEL };

    expect(computePixels(screen, 1, 2, 1)).toEqual(['..']);
  });

  it('should return an empty frame when the frame has no places', () => {
    const screen = createSpriteScreen([placeSprite([0x14], 0, 0)]);

    expect(
      computeFramePixels({ screen, spriteSize: 1, width: 0, height: 0 }).pixels,
    ).toHaveLength(0);
  });

  it('should return the places of a sprite marked when the sprite casts shadows', () => {
    const screen = createSpriteScreen([
      placeSprite([0x14], 0, 0),
      placeShadowCaster([0x54], 0, 2),
    ]);

    expect(computeOccluders(screen, 1, 3)).toEqual([0, 0, 1]);
  });

  it('should return a shadow caster marked when a sprite that casts none covers it', () => {
    const screen = createSpriteScreen([
      placeShadowCaster([0x54], 0, 1),
      placeSprite([0x14], 0, 1),
    ]);

    expect(computeOccluders(screen, 1, 2)).toEqual([0, 1]);
  });

  it('should not mark the transparent pixels when a sprite casts a shadow', () => {
    const screen = createSpriteScreen([
      placeShadowCaster([0x54, TRANSPARENT], 0, 0),
    ]);

    expect(computeOccluders(screen, 2, 2)).toEqual([1, 0]);
  });

  it('should return no places marked when no sprite casts shadows', () => {
    const screen = createSpriteScreen([placeSprite([0x14, 0x54], 0, 0)]);

    expect(computeOccluders(screen, 2, 2)).toEqual([0, 0]);
  });

  it('should return the ambient light of the screen for the lighting when it composes the pixels', () => {
    const { lighting } = computeFramePixels({
      screen: createSpriteScreen([]),
      spriteSize: 1,
      width: 1,
      height: 1,
    });

    expect(lighting.ambient).toBe(-2);
  });

  it('should return the very same lights for the lighting when it composes the pixels', () => {
    const { lighting } = computeFramePixels({
      screen: createSpriteScreen([]),
      spriteSize: 1,
      width: 1,
      height: 1,
    });

    expect(lighting.lights).toBe(LIGHTS);
  });

  it('should return the width and the height for the lighting when it composes the pixels', () => {
    const { lighting } = computeFramePixels({
      screen: createSpriteScreen([]),
      spriteSize: 1,
      width: 4,
      height: 3,
    });

    expect([lighting.width, lighting.height]).toEqual([4, 3]);
  });

  it('should not change the old screen when it composes the pixels', () => {
    const screen = createSpriteScreen([placeShadowCaster([0x14], 0, 0)]);

    computeFramePixels({ screen, spriteSize: 1, width: 2, height: 1 });

    expect(screen).toEqual(
      createSpriteScreen([placeShadowCaster([0x14], 0, 0)]),
    );
  });
});
