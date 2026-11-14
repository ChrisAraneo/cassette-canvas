# Demo

Run `npm run dev` and open the page Vite prints. The demo draws two canvases,
each with its own display:

- **The street.** A city street with houses, trees, street lamps, people,
  cars, clouds, and a distant skyline. A day and night pass every 48 seconds.
  The ambient light darkens at dusk, and the sun and then the moon cross the
  sky behind the buildings. At night the stars come out, the lamps and
  headlights light up, and people and cars cast shadows. Windows light up one
  by one and go dark again later in the night.

  Three HUD windows sit over it. **STREET** shows the frame rate and the clock
  on one tab and the sky on the other, with buttons that move the clock
  forward one hour, back to the animation, or straight to noon or dusk.
  **NOTE** has a field: type a title, press Enter, and it shows in the
  window's title bar. **TAPE** has a readout on a panel, a divider under it,
  and a list of seven tracks under a heading that shows four rows at a time.
  Each track takes two lines, its title and how long it runs, and carries a
  `PLAY` button of its own: press the track or its button and it shows in the
  readout with a heart in front of it. The heading is not one of the tracks,
  so pressing it does nothing. The arrows beside the list scroll it one row at
  a time, and the thumb between them drags to scroll it as far as you like.
  Two tracks carry a glyph of their own, the heart and the lightning bolt the
  font adds to ASCII.

  Drag any window by its title bar, and none of them goes off the screen.
  Close the note or the tape window with its X, and the `NOTE...` button
  brings the note window back. Whatever the light on the street does, the
  windows keep their own colors and never cast a shadow.

- **The chart.** A swatch for each of the 128 sprite colors (16 colors × 8
  shades), the frame rate, and the time of day on the street. It has no
  ambient light, so the swatches always show their exact colors, even when it
  is night on the street.

The street does not keep sprites from one frame to the next. Every frame,
`composeStreetScreen` builds a new screen for that moment from the scenery
that never moves (built once) and from everything that does.
