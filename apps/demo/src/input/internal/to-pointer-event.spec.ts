import { describe, expect, it } from 'vitest';

import { toPointerEvent } from './to-pointer-event';

const PIXEL_SIZE = 4;

const CANVAS_WIDTH = 1280;

const CANVAS_HEIGHT = 720;

const createCanvas = (pageWidth: number): HTMLCanvasElement =>
  ({
    width: CANVAS_WIDTH,
    height: CANVAS_HEIGHT,
    getBoundingClientRect: () => ({
      top: 100,
      left: 50,
      width: pageWidth,
      height: (pageWidth * CANVAS_HEIGHT) / CANVAS_WIDTH,
    }),
  }) as unknown as HTMLCanvasElement;

const createEvent = (clientX: number, clientY: number): PointerEvent =>
  ({ clientX, clientY }) as unknown as PointerEvent;

describe('toPointerEvent', () => {
  it('should return the kind it is given when it reads a pointer event', () => {
    expect(
      toPointerEvent(
        'RELEASE',
        createEvent(50, 100),
        createCanvas(CANVAS_WIDTH),
        1,
      ).kind,
    ).toBe('RELEASE');
  });

  it('should return no offset when the pointer is at the top-left corner of the canvas', () => {
    expect(
      toPointerEvent(
        'PRESS',
        createEvent(50, 100),
        createCanvas(CANVAS_WIDTH),
        PIXEL_SIZE,
      ),
    ).toEqual({ kind: 'PRESS', row: 0, column: 0 });
  });

  it('should return the offset divided by the size of a logical pixel when the pointer is inside the canvas', () => {
    expect(
      toPointerEvent(
        'PRESS',
        createEvent(50 + 128, 100 + 64),
        createCanvas(CANVAS_WIDTH),
        PIXEL_SIZE,
      ),
    ).toEqual({ kind: 'PRESS', row: 16, column: 32 });
  });

  it('should return the offset scaled when the page draws the canvas smaller', () => {
    expect(
      toPointerEvent(
        'PRESS',
        createEvent(50 + 64, 100 + 32),
        createCanvas(640),
        PIXEL_SIZE,
      ),
    ).toEqual({ kind: 'PRESS', row: 16, column: 32 });
  });

  it('should return the offset unscaled when the canvas has no size yet', () => {
    expect(
      toPointerEvent(
        'PRESS',
        createEvent(50 + 32, 100 + 16),
        createCanvas(0),
        PIXEL_SIZE,
      ),
    ).toEqual({ kind: 'PRESS', row: 4, column: 8 });
  });
});
