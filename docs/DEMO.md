# Demo

Run `npm run dev` and open the page Vite prints. The demo draws two canvases,
each with its own display:

- **The street.** A city street with houses, trees, street lamps, people,
  cars, clouds, and a distant skyline. A day and night pass every 48 seconds.
  The ambient light darkens at dusk, and the sun and then the moon cross the
  sky behind the buildings. At night the stars come out, the lamps and
  headlights light up, and people and cars cast shadows. Windows light up one
  by one and go dark again later in the night.

  Two HUD windows sit over it. **STREET** shows the frame rate and the clock
  on one tab and the sky on the other, with buttons that move the clock
  forward one hour, back to the animation, or straight to noon or dusk.
  **NOTE** has a field: type a title, press Enter, and it shows in the
  window's title bar. Drag either window by its title bar, close the note
  window with its X, and the `NOTE...` button brings it back. Whatever the
  light on the street does, the windows keep their own colors and never cast
  a shadow.

- **The chart.** A swatch for each of the 128 sprite colors (16 colors × 8
  shades), the frame rate, and the time of day on the street. It has no
  ambient light, so the swatches always show their exact colors, even when it
  is night on the street.

The street does not keep sprites from one frame to the next. Every frame,
`composeStreetScreen` builds a new screen for that moment from the scenery
that never moves (built once) and from everything that does.
