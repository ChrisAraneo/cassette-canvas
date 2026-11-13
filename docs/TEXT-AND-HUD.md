# Text, windows, and a HUD

The built-in font's shapes are based on PixeloidSans, drawn for a 7-pixel
capital, which is the size it looks best at.

A HUD is windows over the scene. It is monochrome: every window is drawn in
shades of one palette color, so it looks like one surface whatever happens
below it. The default color is `DEFAULT_HUD_COLOR` (15), the sand color in
the demo palette and the closest one to beige. Text is the darkest shade,
buttons and tabs are lighter than the window they sit on, and every edge is a
one-pixel bevel: light on the top and left, shadow on the bottom and right,
swapped while a button is held.

```ts
import {
  addHud,
  addHudWindow,
  createHud,
  handleHud,
  patchHudWidget,
} from '@chris.araneo/cassette-canvas';

const hud = addHudWindow(createHud(), {
  id: 'mixer',
  title: 'MIXER',
  row: 8,
  column: 8,
  width: 120,
  height: 88,
  widgets: [
    {
      kind: 'tabs',
      id: 'pages',
      page: '',
      row: 0,
      column: 0,
      tabs: [
        { id: 'deck', text: 'DECK' },
        { id: 'tape', text: 'TAPE' },
      ],
    },
    { kind: 'label', id: 'level', page: 'deck', row: 17, column: 0, text: '' },
    {
      kind: 'button',
      id: 'play',
      page: 'deck',
      row: 30,
      column: 0,
      width: 40,
      text: 'PLAY',
    },
    {
      kind: 'input',
      id: 'name',
      page: 'tape',
      row: 17,
      column: 0,
      width: 100,
      text: '',
    },
  ],
});
```

A widget's `row` and `column` are measured from the top-left pixel of the
window's content (`HUD_CONTENT_TOP`, `HUD_CONTENT_LEFT` from the window's own
top-left pixel). A label's `row` is the top of its capitals; a button, a
field, and a tab are `HUD_CONTROL_HEIGHT` tall. A widget's `page` is the tab it
belongs to, and an empty `page` shows it on every page.

Pass the pointer and key events to the HUD. Positions are logical pixels: the
offset inside the canvas divided by the display's `pixelSize`. Keys are the
browser's `KeyboardEvent.key`.

```ts
const pressed = handleHud(hud, { kind: 'press', row: 12, column: 30 });
const dragged = handleHud(pressed.hud, { kind: 'move', row: 20, column: 60 });
const typed = handleHud(dragged.hud, { kind: 'key', key: 'A' });
```

`handleHud` returns the HUD as it now is and the actions the person caused:

- `click` a button was pressed and released,
- `close` a window was closed with its close box, and is gone,
- `tab` a tab was opened; `value` is the page it opened,
- `type` a field's text changed; `value` is the text it now holds,
- `submit` Enter was pressed in a field.

Dragging a title bar moves a window, pressing a window brings it to the top,
and the close box shows unless the window is built with `closable: false`.
Fields scroll their text so the end and the caret stay visible. Everything
else is yours to handle: `patchHudWidget(hud, 'mixer', 'level', { text: 'LEVEL 7' })`
writes a readout without rebuilding the window.

Put the windows on the screen last, and draw as usual:

```ts
drawScreen(display, addHud(screen, typed.hud), time);
```

Text and overlays work on their own too, without a HUD:

```ts
import {
  addOverlay,
  composeOverlay,
  measureText,
  toPixel,
  toTextPaint,
} from '@chris.araneo/cassette-canvas';

const banner = composeOverlay(measureText('GAME OVER') + 8, 15, [
  {
    pixel: toPixel(0, 1),
    row: 0,
    column: 0,
    width: measureText('GAME OVER') + 8,
    height: 15,
  },
  toTextPaint('GAME OVER', toPixel(1, 6), 4, 4),
]);

const withBanner = addOverlay(screen, 'banner', banner, 80, 120);
```
