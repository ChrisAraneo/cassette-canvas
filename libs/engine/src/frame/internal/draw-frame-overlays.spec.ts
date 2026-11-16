import { describe, expect, it } from 'vitest';

import { createOverlay } from '../../overlay/create-overlay';
import { toOverlay } from '../../overlay/to-overlay';
import { TRANSPARENT } from '../../palette/consts';
import { toLitPixel } from '../../palette/to-lit-pixel';
import { drawFrameOverlays } from './draw-frame-overlays';

const DARK = toLitPixel(0x91, -8);

const PANEL = toLitPixel(0x35, 0);

const BADGE = toLitPixel(0x17, 0);

const createNightFrame = (): number[] => [DARK, DARK, DARK, DARK];

describe('drawFrameOverlays', () => {
  it('should return an overlay in the colors it was authored in when the frame is dark', () => {
    expect(
      drawFrameOverlays(
        createNightFrame(),
        [
          {
            id: 'panel',
            overlay: createOverlay(2, 1, 0x35),
            row: 0,
            column: 0,
          },
        ],
        2,
        2,
      ),
    ).toEqual([PANEL, PANEL, DARK, DARK]);
  });

  it('should return the frame as it is when there are no overlays', () => {
    expect(drawFrameOverlays(createNightFrame(), [], 2, 2)).toEqual(
      createNightFrame(),
    );
  });

  it('should return the lit frame when an overlay is transparent there', () => {
    expect(
      drawFrameOverlays(
        createNightFrame(),
        [
          {
            id: 'panel',
            overlay: toOverlay(['.o'], { o: 0x35 }),
            row: 0,
            column: 0,
          },
        ],
        2,
        2,
      ),
    ).toEqual([DARK, PANEL, DARK, DARK]);
  });

  it('should return a later overlay over an earlier one when they overlap', () => {
    expect(
      drawFrameOverlays(
        createNightFrame(),
        [
          {
            id: 'panel',
            overlay: createOverlay(2, 2, 0x35),
            row: 0,
            column: 0,
          },
          {
            id: 'badge',
            overlay: createOverlay(1, 1, 0x17),
            row: 1,
            column: 1,
          },
        ],
        2,
        2,
      ),
    ).toEqual([PANEL, PANEL, PANEL, BADGE]);
  });

  it('should return no parts of an overlay when they fall outside the frame', () => {
    expect(
      drawFrameOverlays(
        createNightFrame(),
        [
          {
            id: 'panel',
            overlay: createOverlay(4, 4, 0x35),
            row: -1,
            column: 1,
          },
        ],
        2,
        2,
      ),
    ).toEqual([DARK, PANEL, DARK, PANEL]);
  });

  it('should return a place unchanged when a pixel value cannot reach it', () => {
    expect(
      drawFrameOverlays(
        createNightFrame(),
        [
          {
            id: 'panel',
            overlay: { width: 1, height: 1, pixels: [TRANSPARENT] },
            row: 0,
            column: 0,
          },
        ],
        2,
        2,
      ),
    ).toEqual(createNightFrame());
  });

  it('should not change the frame it is given when it draws the overlays', () => {
    const frame = createNightFrame();

    drawFrameOverlays(
      frame,
      [{ id: 'panel', overlay: createOverlay(2, 2, 0x35), row: 0, column: 0 }],
      2,
      2,
    );

    expect(frame).toEqual(createNightFrame());
  });
});
