import { describe, expect, it } from 'vitest';

import { toPointerEvent } from './to-pointer-event';

const PIXEL_SIZE = 4;

const createCanvas = (pageWidth: number): HTMLCanvasElement =>
  ({
    width: 1280,
    height: 720,
    getBoundingClientRect: () => ({
      top: 100,
      left: 50,
      width: pageWidth,
      height: (pageWidth * 720) / 1280,
    }),
  }) as unknown as HTMLCanvasElement;

const createEvent = (clientX: number, clientY: number): PointerEvent =>
  ({ clientX, clientY }) as unknown as PointerEvent;

describe('toPointerEvent', () => {
  it('should return the kind it is given when it reads a pointer event', () => {
    expect(
      toPointerEvent('release', createEvent(50, 100), createCanvas(1280), 1)
        .kind,
    ).toBe('release');
  });

  it('should return no offset when the pointer is at the top-left corner of the canvas', () => {
    expect(
      toPointerEvent(
        'press',
        createEvent(50, 100),
        createCanvas(1280),
        PIXEL_SIZE,
      ),
    ).toEqual({ kind: 'press', row: 0, column: 0 });
  });

  it('should return the offset divided by the size of a logical pixel when the pointer is inside the canvas', () => {
    expect(
      toPointerEvent(
        'press',
        createEvent(50 + 128, 100 + 64),
        createCanvas(1280),
        PIXEL_SIZE,
      ),
    ).toEqual({ kind: 'press', row: 16, column: 32 });
  });

  it('should return the offset scaled when the page draws the canvas smaller', () => {
    expect(
      toPointerEvent(
        'press',
        createEvent(50 + 64, 100 + 32),
        createCanvas(640),
        PIXEL_SIZE,
      ),
    ).toEqual({ kind: 'press', row: 16, column: 32 });
  });

  it('should return the offset unscaled when the canvas has no size yet', () => {
    expect(
      toPointerEvent(
        'press',
        createEvent(50 + 32, 100 + 16),
        createCanvas(0),
        PIXEL_SIZE,
      ),
    ).toEqual({ kind: 'press', row: 4, column: 8 });
  });
});
