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
  it('should keep the kind it is told', () => {
    expect(
      toPointerEvent('release', createEvent(50, 100), createCanvas(1280), 1)
        .kind,
    ).toBe('release');
  });

  it('should count from the top-left corner of the canvas', () => {
    expect(
      toPointerEvent(
        'press',
        createEvent(50, 100),
        createCanvas(1280),
        PIXEL_SIZE,
      ),
    ).toEqual({ kind: 'press', row: 0, column: 0 });
  });

  it('should divide the offset by the size of a logical pixel', () => {
    expect(
      toPointerEvent(
        'press',
        createEvent(50 + 128, 100 + 64),
        createCanvas(1280),
        PIXEL_SIZE,
      ),
    ).toEqual({ kind: 'press', row: 16, column: 32 });
  });

  it('should scale the offset when the page draws the canvas smaller', () => {
    expect(
      toPointerEvent(
        'press',
        createEvent(50 + 64, 100 + 32),
        createCanvas(640),
        PIXEL_SIZE,
      ),
    ).toEqual({ kind: 'press', row: 16, column: 32 });
  });

  it('should take the pointer as it is when the canvas has no size yet', () => {
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
