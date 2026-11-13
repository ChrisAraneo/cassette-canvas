# Performance

Measured on the demo street at 1280×720 (320×180 logical pixels), in a
Rolldown bundle run with Node 24. By day the street has 856 sprites and 1
light; at night it has 1,013 sprites and 11 lights:

| Step           | By day  | At night |
| -------------- | ------- | -------- |
| `computeFrame` | ~2.1 ms | ~4.8 ms  |
| `toFrameBytes` | ~0.4 ms | ~0.4 ms  |

Adding up light rather than shade numbers, and softening the shadow edges,
costs nothing by day and about 0.1 ms a frame at night, where 11 lights reach
44% of the screen.

The HUD costs about 1.1 ms a frame on top of that, for the demo's two windows
(71 paint steps, 14,860 overlay pixels): ~0.5 ms to paint the windows into
overlays and ~0.6 ms to paint those overlays over the lit frame. A screen with
no overlays skips the last step.
