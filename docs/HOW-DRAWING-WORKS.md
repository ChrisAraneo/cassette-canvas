# How drawing works

`drawScreen` runs three steps:

```
screen
  → computeFrame   draw the sprites, then apply light and shadows
  → toFrameBytes   turn extended pixels into RGBA bytes
  → drawCrt        upload the bytes as a texture and draw it with the shader
```

**`computeFrame`** fills the frame with the background and draws each sprite
in order. It also records which pixels belong to sprites that cast shadows.
Then it computes how much light reaches every pixel and moves the pixel to
the matching extended shade. Last, it paints the screen's overlays over the
lit frame, each one in its authored colors, so no light and no shadow reaches
them.

**Light.** The engine turns each light into the amount of light it adds to
every pixel it reaches. It adds those amounts to the ambient light, pixel by
pixel, and reads the shade off the total at 4 extended shades per doubling.
Pixels no light reaches skip that step and keep the ambient light exactly.

**Shadows.** For each light, the engine visits pixels in rings, moving
outward from the light. A pixel gets light if the next pixel toward the light
gets light and does not cast a shadow. This costs one lookup per pixel
instead of tracing a full line back to the light. For the penumbra, a pixel
takes a quarter of its light from each side of that pixel, along the ring it
sits on, which softens the edge of a shadow without touching what the shadow
covers.

**The shader** runs once for every canvas pixel. It:

1. reads the logical pixel under it;
2. adds glow where a pixel within 2 canvas pixels is brighter (flat areas do
   not change);
3. darkens the bottom of each pixel row (scanline);
4. adds film grain, which changes 24 times per second, and a fixed surface
   texture.

The strength of each effect is a constant in `libs/engine/src/crt/consts.ts`.

Everything before the WebGL calls is pure and unit-tested. The WebGL calls are
the only side effects. Each one runs through `runEffect` in `drawCrt`.
