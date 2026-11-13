# Concepts

| Concept            | Meaning                                                                                                                                                                                      |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Base colors**    | The 16 colors you provide, as `#rrggbb`.                                                                                                                                                     |
| **Shade**          | Sprites can use 8 shades of each color (0 to 7). Shade 4 (`BASE_SHADE`) is the base color. Shades 0 to 3 are darker and 5 to 7 are lighter.                                                  |
| **Extended shade** | Lighting uses 32 shades of each color (0 to 31). 4 extended shades = 1 shade. The palette holds all 16 × 32 = 512 colors.                                                                    |
| **Pixel**          | A number with the color in the high hex digit and the shade in the low hex digit. `0x35` is color 3, shade 5. `TRANSPARENT` (`-1`) draws nothing.                                            |
| **Pixel size**     | The size of one logical pixel in canvas pixels, for example `4`. The screen size in logical pixels is the canvas size divided by the pixel size.                                             |
| **Sprite**         | A flat array of `spriteSize × spriteSize` pixels, row by row from the top left.                                                                                                              |
| **Screen**         | Immutable data: the background, sprites, lights, ambient light, and overlays. Later sprites are drawn over earlier ones.                                                                     |
| **Display**        | The canvas, its WebGL context, the monitor shader, and the palette. You create it once.                                                                                                      |
| **Ambient light**  | Shifts every pixel by a number of extended shades. `0` keeps the authored colors. `-16` (4 shades darker) looks like night.                                                                  |
| **Light**          | A point at `row`, `column`. At its center it lifts a pixel that daylight already lights by `intensity` extended shades, fading to nothing at `radius`.                                       |
| **Stop**           | One doubling of light, worth `EXTENDED_SHADES_PER_STOP` (4) extended shades. Lights are added as light and then read off this scale, the way the eye reads brightness.                       |
| **Shadow**         | A sprite with `castsShadow: true` blocks light. Pixels behind it get no light from that light, and the shadow's edge ramps rather than steps. Its side that faces the light is still lit.    |
| **Overlay**        | A free-size image painted over the lit frame, in its authored colors. No ambient light, no light, and no shadow reaches it, so it is drawn over the scene rather than in it.                 |
| **Text**           | A built-in pixel font, drawn for a 7-pixel capital (`TEXT_HEIGHT`). `measureText` returns a line's width, and `toTextOverlay` draws it.                                                      |
| **HUD**            | Immutable data: windows with a title bar, a close box, and widgets (labels, buttons, fields, tabs). `handleHud` handles pointer and key events, and `addHud` puts the windows on the screen. |
| **Monitor effect** | A shader that adds a 2-pixel glow, scanlines, film grain, and a surface texture. It uses full RGB color, not the palette.                                                                    |
