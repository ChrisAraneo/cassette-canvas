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
```
