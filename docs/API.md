# API

| Function                                                            | What it does                                                          |
| ------------------------------------------------------------------- | --------------------------------------------------------------------- |
| `tryCreateDisplay(canvas, { colors, pixelSize, spriteSize })`       | Creates a display, or returns `undefined`                             |
| `drawScreen(display, screen, time)`                                 | Draws the screen with the monitor effect and returns the display      |
| `createScreen(background?, ambient?)`                               | Creates an empty screen (transparent, ambient `0` by default)         |
| `addSprite(screen, id, sprite, row, column)`                        | Adds a sprite on top, replacing any sprite with the same id           |
| `patchSprite(screen, id, { sprite?, row?, column?, castsShadow? })` | Changes a sprite's image (animation), position, or shadow             |
| `patchSpriteByOffset(screen, id, rowOffset, columnOffset)`          | Moves a sprite by an offset                                           |
| `removeSprite(screen, id)`                                          | Removes a sprite                                                      |
| `findSprite(screen, id)`                                            | Returns a sprite, or `undefined`                                      |
| `addLight(screen, id, { row, column, radius, intensity })`          | Adds a light, replacing any light with the same id                    |
| `patchLight(screen, id, { row?, column?, radius?, intensity? })`    | Changes a light                                                       |
| `patchLightByOffset(screen, id, rowOffset, columnOffset)`           | Moves a light by an offset                                            |
| `removeLight(screen, id)`                                           | Removes a light                                                       |
| `findLight(screen, id)`                                             | Returns a light, or `undefined`                                       |
| `patchAmbient(screen, ambient)`                                     | Sets the ambient light                                                |
| `toSprite(rows, legend)`                                            | Builds a sprite from text art                                         |
| `toPixel(color, shade)`                                             | Returns a pixel value                                                 |
| `isPixel(value)`                                                    | Returns `true` when a value is a pixel                                |
| `toExtendedPixel(color, extendedShade)`                             | Returns an extended pixel                                             |
| `toLitPixel(pixel, shadeOffset)`                                    | Returns the extended pixel a pixel shows under light                  |
| `createPalette(colors)`                                             | Returns the 512 palette colors, keyed by extended pixel               |
| `computeFrame(screen, spriteSize, width, height)`                   | Returns the lit frame as extended pixels, without drawing (for tests) |

Screen functions never change the screen you pass in. They return a new one.

Text, overlays and the HUD:

| Function                                       | What it does                                                                |
| ---------------------------------------------- | --------------------------------------------------------------------------- |
| `measureText(text)`                            | Returns how far a line of text moves the pen, in logical pixels             |
| `toTextOverlay(text, pixel)`                   | Draws a line of text in one pixel value, as an overlay                      |
| `toTextPaint(text, pixel, row, column)`        | Returns a text step for `composeOverlay`, placed by the top of its capitals |
| `createOverlay(width, height, pixel?)`         | Creates an overlay filled with one pixel value (transparent by default)     |
| `toOverlay(rows, legend)`                      | Builds an overlay from text art, as wide as its longest row                 |
| `composeOverlay(width, height, paints)`        | Paints fills, images, and text into a new overlay, in order                 |
| `addOverlay(screen, id, overlay, row, column)` | Adds an overlay over everything light touches                               |
| `patchOverlay(screen, id, changes)`            | Changes an overlay's image or place                                         |
| `removeOverlay(screen, id)`                    | Removes an overlay                                                          |
| `findOverlay(screen, id)`                      | Returns an overlay placement, or `undefined`                                |
| `createHud(color?)`                            | Creates a HUD with no windows, in shades of one palette color               |
| `createHudTheme(color?)`                       | Returns the shades a HUD is drawn in, to replace single ones                |
| `addHudWindow(hud, settings)`                  | Adds a window on top, replacing any window with the same id                 |
| `patchHudWindow(hud, id, changes)`             | Changes a window's title, place, size, color, close box, page, or widgets   |
| `removeHudWindow(hud, id)`                     | Removes a window                                                            |
| `findHudWindow(hud, id)`                       | Returns a window, or `undefined`                                            |
| `patchHudWidget(hud, window, widget, changes)` | Changes a widget's text, width, or tabs                                     |
| `findHudWidget(hud, window, widget)`           | Returns a widget, or `undefined`                                            |
| `handleHud(hud, event)`                        | Handles a pointer or key event: returns the new HUD and the actions         |
| `addHud(screen, hud)`                          | Puts the HUD's windows on a screen as overlays                              |
| `composeHud(hud)`                              | Draws the HUD as one overlay placement per window, from the bottom up       |

HUD and overlay functions never change what you pass in either.
