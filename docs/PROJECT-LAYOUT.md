# Project layout

```
libs/
├── common/src/        helpers for any lib (runEffect)
└── engine/src/
    ├── index.ts       the public API
    ├── palette/       colors, shades, and pixel values
    ├── screen/        sprites, lights, ambient light, and overlays
    ├── lighting/      light amounts, the shade scale, and shadows
    ├── overlay/       images painted over the lit frame
    ├── text/          the built-in pixel font
    ├── hud/           windows, and the widgets they hold
    ├── frame/         turns a screen into lit pixels
    ├── crt/           the WebGL monitor shader
    └── display/       draws to the canvas
apps/
└── demo/src/
    ├── main.ts        the animation loop for both canvases
    ├── art/           text art: sky, buildings, street, people, cars, font
    ├── tiles/         cuts large art into sprites and places it
    ├── day/           the time of day and how dark it is
    ├── street/        the city street, composed from scratch every frame
    ├── hud/           the windows over the street, and what their buttons do
    ├── input/         carries the browser's events into the frame loop
    ├── chart/         the palette swatches, the frame rate and the clock
    ├── format/        frame rates, clock times, percents, and heights as text
    └── fps/           measures the frame rate
```
