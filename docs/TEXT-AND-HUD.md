# Text, windows, and a HUD

The built-in font's shapes are based on PixeloidSans, drawn for a 7-pixel
capital, which is the size it looks best at. Besides printable ASCII it holds
two glyphs of its own, a heart (`TEXT_HEART`) and a lightning bolt
(`TEXT_BOLT`), which measure and place like any other character:
`` `HP ${TEXT_HEART}${TEXT_HEART} ${TEXT_BOLT}` `` is one line of text.

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
    {
      kind: 'panel',
      id: 'meters',
      page: 'deck',
      row: 46,
      column: 0,
      width: 100,
      height: 13,
    },
    {
      kind: 'divider',
      id: 'line',
      page: 'tape',
      row: 32,
      column: 0,
      width: 100,
    },
    {
      kind: 'list',
      id: 'tracks',
      page: 'tape',
      row: 37,
      column: 0,
      width: 100,
      height: 46,
      items: [
        {
          id: 'a',
          lines: ['SIDE A', '3:42'],
          height: 0,
          widgets: [
            {
              kind: 'button',
              id: 'play-a',
              page: '',
              row: 3,
              column: 56,
              width: 30,
              text: 'PLAY',
            },
          ],
          selectable: true,
        },
        {
          id: 'b',
          lines: ['SIDE B'],
          height: 0,
          widgets: [],
          selectable: true,
        },
      ],
      scroll: 0,
      selected: '',
    },
  ],
});
```

A widget's `row` and `column` are measured from the top-left pixel of the
window's content (`HUD_CONTENT_TOP`, `HUD_CONTENT_LEFT` from the window's own
top-left pixel). A label's `row` is the top of its capitals; a button, a
field, and a tab are `HUD_CONTROL_HEIGHT` tall. A widget's `page` is the tab it
belongs to, and an empty `page` shows it on every page.

The three widgets that are surfaces rather than controls:

- A **panel** is the body of a window without its title bar, so nothing can
  drag it. Every window is painted as a panel with a title bar on it, which
  is why a panel inside one looks like a window within the window. Use it to
  group widgets, and list it before the widgets that sit on it: a window
  paints its widgets in the order it holds them.
- A **divider** is a line pressed into the window, `HUD_DIVIDER_HEIGHT` rows
  tall, which separates what is above it from what is below.
- A **list** is a sunken surface holding one item per row, with a divider
  between each two and a scroll bar down its right side, which takes
  `HUD_LIST_BAR_WIDTH` of its width. Its `height` decides how many items it
  shows at once: each one takes the rows it asks for and `HUD_DIVIDER_HEIGHT`
  for the divider under it, and an item that does not fit whole is left for
  the next page.

  `scroll` is the first item it shows, counted from 0. The up and down arrows
  move it one item at a time, the thumb between them drags to scroll as far
  as it goes, and it never scrolls past the last page. An item that is
  pressed is selected, drawn inverted, and named in a `select` action.

An item of a list holds more than one line of text, and widgets of its own:

```ts
{
  id: 'neon',
  lines: ['NEON RAIN', '3:42'],
  height: 0,
  widgets: [
    {
      kind: 'button',
      id: 'play-neon',
      page: '',
      row: 3,
      column: 56,
      width: 30,
      text: 'PLAY',
    },
  ],
  selectable: true,
}
```

- `lines` are the lines it shows, one under the other,
  `HUD_LIST_ITEM_HEIGHT` apart, each cut off where the item ends. An item of
  one line is an ordinary row; one of two lines is twice as tall.
- `widgets` are labels, buttons, dividers, and panels (`HudItemWidget`) that
  sit on the item, placed from its top-left pixel. They are painted after the
  item's own lines, so list a panel before what sits on it, and nothing cuts
  them off at the edge of the item: keep them inside it. An item is as wide
  as the list without its padding, the line down its right side, and the
  scroll bar, which is
  `width - HUD_PADDING - HUD_EDGE - HUD_LIST_BAR_WIDTH`.
- A button on an item works like any other button: it takes the press
  instead of the item under it and returns a `click` action naming it, so
  give it an id that is one of a kind in the window. A label, a divider, or a
  panel takes no press, so pressing one still selects the item it sits on.
- `height` is the rows the item takes, or 0 for as many as its lines and the
  widgets on it need. A one-line item with a `HUD_CONTROL_HEIGHT` button on
  it is as tall as the button.
- `selectable` is whether pressing the item selects it. An item that is not
  selectable, such as a heading between two groups, takes no selection and
  returns no action, and the buttons on it still work.

`patchHudWidget` writes to all of them: `text` for a label, a button, or a
field, `width` and `height` for a panel, a divider, or a list, `tabs` for a
strip, and `items`, `scroll`, or `selected` for a list. A widget that sits on
an item is changed by writing the `items` again.

Pass the pointer and key events to the HUD. Positions are logical pixels: the
offset inside the canvas divided by the display's `pixelSize`. Keys are the
browser's `KeyboardEvent.key`.

```ts
const pressed = handleHud(hud, { kind: 'press', row: 12, column: 30 });
const dragged = handleHud(pressed.hud, { kind: 'move', row: 20, column: 60 });
const typed = handleHud(dragged.hud, { kind: 'key', key: 'A' });
```

`handleHud` returns the HUD as it now is and the actions the person caused:

- `click` a button was pressed and released, in the window or on an item of
  a list,
- `close` a window was closed with its close box, and is gone,
- `tab` a tab was opened; `value` is the page it opened,
- `type` a field's text changed; `value` is the text it now holds,
- `submit` Enter was pressed in a field,
- `select` an item of a list was pressed; `value` is the item's id.

Scrolling a list causes no action: the list keeps its own `scroll`.

Dragging a title bar moves a window, dragging the thumb of a list scrolls it
(pass the `move` events along and the thumb follows the pointer), pressing a
window brings it to the top, and the close box shows unless the window is
built with `closable: false`.
Fields scroll their text so the end and the caret stay visible. Everything
else is yours to handle: `patchHudWidget(hud, 'mixer', 'level', { text: 'LEVEL 7' })`
writes a readout without rebuilding the window.

Tell the HUD the screen it is on, and no window can be dragged off it:

```ts
const bounded = createHud(DEFAULT_HUD_COLOR, {
  width: display.width,
  height: display.height,
});
```

That is the display's size in logical pixels. A dragged window stops with
every edge still on the screen, and a window larger than the screen is pinned
to its top-left pixel. A HUD created without a size lets its windows go
anywhere, and placing a window yourself with `addHudWindow` or
`patchHudWindow` is never clamped.

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

A line of text takes one pixel value for all of it, or one per character,
which is how a single line holds more than one color. A character past the end
of the list takes the last pixel in it, so a short list colors a prefix and
leaves the rest alone:

```ts
// A white G, then O, L, D in gold.
toTextPaint('GOLD', [toPixel(0, 7), toPixel(3, 5)], 4, 4);
```

A HUD stays monochrome whatever the text can do: every window is drawn in
shades of one color, and its letters in the theme's `text` shade.
