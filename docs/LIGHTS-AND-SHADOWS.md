# Lights and shadows

Sprites use 8 shades per color. Lighting uses 32 extended shades per color
(`EXTENDED_SHADE_COUNT`). Shade `s` is extended shade `4 × s + 1`. Extended
shade 0 is darker than shade 0, and extended shades 30 and 31 are lighter than
shade 7. Only light can reach them.

```
extended  0  1  2  3  4  5 … 17 … 29 30 31
shade        0           1    4    7
             ↑ darkest            ↑ lightest a sprite can use
```

Light never changes a pixel's color, only its shade. Ambient light and light
intensities are written in extended shades
(`EXTENDED_SHADES_PER_SHADE` = 4 per shade), because that is what you see on
screen. With ambient 0 and no lights, every pixel shows its authored color.

**Lights add up as light, not as shade numbers.** Shade numbers are a
brightness scale, and brightness scales do not add: a room with two lamps is
not twice as bright to look at as a room with one. So the engine turns the
ambient light and each light back into the amount of light behind it, adds
those amounts, and reads the shade off the total. Every doubling of light is
worth the same step on the scale, `EXTENDED_SHADES_PER_STOP` = 4 extended
shades, which is how the eye reads brightness.

What that means:

- One light on an unlit scene moves a pixel by exactly its `intensity`.
- A second light of the same intensity on the same spot adds one step, not
  another full intensity. Ten lamps add a little over three steps.
- A lamp in daylight barely shows, and the same lamp at night lights the
  whole scene. Nothing adds up to flat white, so sprites and tiles keep their
  shading however many lights reach them.

An `intensity` is therefore best read as _how many extended shades this light
lifts a pixel that daylight already lights_. A lamp that is only there to
light the night needs a small number, around 4 to 6; a flash or an explosion
needs a large one. Ambient and intensity can be fractions; the total is
rounded for each pixel and kept between extended shade 0 and 31.

A light also thins out with distance the way light does in the world, so it
leaves a bright core and a long dim halo rather than a flat disc, and the rim
at `radius` fades out smoothly instead of ending in a visible circle.

Shadow edges are soft. Every shadow carries a penumbra: its edge ramps from
full light to full shadow over two pixels, the way an edge looks under a
light that is not a single point. Only the edge softens, so the middle of a
shadow stays as dark as before and a shadow never fades out as it lengthens.
`SHADOW_SOFTNESS` in `libs/engine/src/lighting/consts.ts` sets how far the
ramp goes, and `0` brings back the hard edges of a point source.

```ts
const WALL = toSprite(times(8, constant('..oooo..')), { o: toPixel(0, 3) });

const night = pipe(
  createScreen(toPixel(8, 5), -16), // light-blue sky, 4 shades darker
  (screen) => addSprite(screen, 'wall', WALL, 40, 60),
  (screen) => patchSprite(screen, 'wall', { castsShadow: true }),
  (screen) =>
    addLight(screen, 'torch', {
      row: 44,
      column: 30,
      radius: 40,
      intensity: 5,
    }),
);

const torchMoved = patchLightByOffset(night, 'torch', 0, 2);
const flickered = patchLight(torchMoved, 'torch', { intensity: 4 });
const dawn = patchAmbient(flickered, -3);
```

With ambient `-16` (night), that torch of intensity `5` lifts its core about
18 extended shades above the night around it, a little past the authored
colors, and fades back to night through many small steps. The same torch at
noon lifts a pixel by 5. Flickering it down to `4` costs about 2 shades at
the core, not 1, because near the center the light is strong and the eye
notices less of it. A big number such as `16` is a flash or an explosion: it
lifts the core to the lightest shade.

A lit frame holds extended pixels:
`toExtendedPixel(color, extendedShade)` = `color × 32 + extendedShade`. The
palette is keyed by extended pixels. `toLitPixel(pixel, shadeOffset)` returns
the extended pixel that a sprite pixel shows under that much light.
`toLitPixel(pixel, 0)` returns its authored color.
