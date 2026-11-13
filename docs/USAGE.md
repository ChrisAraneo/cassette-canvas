# Usage

```ts
import {
  addLight,
  addSprite,
  createScreen,
  drawScreen,
  patchAmbient,
  patchLight,
  patchLightByOffset,
  patchSprite,
  patchSpriteByOffset,
  toPixel,
  toSprite,
  tryCreateDisplay,
} from '@chris.araneo/cassette-canvas';
import { constant, noop, times } from 'lodash-es';
import { pipe } from 'remeda';
import { match, P } from 'ts-pattern';

const display = tryCreateDisplay(canvas, {
  colors: [
    '#7f7f7f',
    '#d23c3c',
    '#e07a2e',
    '#e6c23a',
    '#98c93c',
    '#3d9e4a',
    '#2e9c8f',
    '#3bb4d6',
    '#4a8fe0',
    '#3c56c8',
    '#5b42c2',
    '#8a45c8',
    '#c045b4',
    '#e0608f',
    '#8c5a36',
    '#d4a373',
  ],
  pixelSize: 4,
  spriteSize: 8,
});

const HEART = toSprite(
  [
    '........',
    '.rr..rr.',
    'rRRrrrrr',
    'rRrrrrrr',
    '.rrrrrr.',
    '..rrrr..',
    '...rr...',
    '........',
  ],
  { r: toPixel(1, 4), R: toPixel(1, 6) },
);

const screen = addSprite(createScreen(toPixel(10, 0)), 'heart', HEART, 20, 30);
const moved = patchSpriteByOffset(screen, 'heart', 0, 5); // 5 pixels right
const placed = patchSprite(moved, 'heart', { row: 40, column: 60 });
```

Draw the screen once per animation frame. Pass the time in milliseconds; it
animates the film grain. `display` can be `undefined`, so check it first:

```ts
const { nonNullable } = P;

requestAnimationFrame((time) =>
  match(display)
    .with(nonNullable, (ready) => drawScreen(ready, placed, time))
    .otherwise(noop),
);
```

`tryCreateDisplay` returns `undefined` if:

- the canvas has no WebGL context,
- the monitor shader cannot be set up,
- `pixelSize` or `spriteSize` is not a positive whole number,
- the canvas is smaller than one logical pixel.

See [`apps/demo/src/main.ts`](https://github.com/ChrisAraneo/cassette-canvas/blob/master/apps/demo/src/main.ts)
for a full animation loop.

For lights, shadows, and the shade scale, see
[Lights and shadows](LIGHTS-AND-SHADOWS.md). For text, windows, and widgets,
see [Text, windows, and a HUD](TEXT-AND-HUD.md). Every exported function is
listed in the [API](API.md).
