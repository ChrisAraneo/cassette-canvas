import { runEffect } from '@cassette-canvas/common';
import type { HudEvent } from '@cassette-canvas/engine';
import { noop } from 'lodash-es';
import { pipe } from 'remeda';
import { describe, expect, it } from 'vitest';

import { createInputMailbox } from './create-input-mailbox';
import { readInputEvents } from './read-input-events';
import { watchPointer } from './watch-pointer';

const PIXEL_SIZE = 4;

const CANVAS_WIDTH = 1280;

const CANVAS_HEIGHT = 720;

const POINTER_ID = 1;

type Listeners = Record<string, (event: PointerEvent) => void>;

const createCanvas = (listeners: Listeners): HTMLCanvasElement =>
  ({
    width: CANVAS_WIDTH,
    height: CANVAS_HEIGHT,
    getBoundingClientRect: () => ({
      top: 0,
      left: 0,
      width: CANVAS_WIDTH,
      height: CANVAS_HEIGHT,
    }),
    setPointerCapture: noop,
    addEventListener: (
      name: string,
      listener: (event: PointerEvent) => void,
    ) => {
      listeners[name] = listener;
    },
  }) as unknown as HTMLCanvasElement;

const createEvent = (clientX: number, clientY: number): PointerEvent =>
  ({ clientX, clientY, pointerId: POINTER_ID }) as unknown as PointerEvent;

const readPointerEvents = (
  name: string,
  clientX: number,
  clientY: number,
): readonly HudEvent[] => {
  const listeners: Listeners = {};
  const mailbox = createInputMailbox();

  return pipe(
    createCanvas(listeners),
    (canvas) => watchPointer(canvas, PIXEL_SIZE, mailbox),
    (watched) =>
      runEffect(watched, () =>
        listeners[name]?.(createEvent(clientX, clientY)),
      ),
    () => readInputEvents(mailbox),
  );
};

describe('watchPointer', () => {
  it('should add a press when a button goes down', () => {
    expect(readPointerEvents('pointerdown', 128, 64)).toEqual([
      { kind: 'PRESS', row: 16, column: 32 },
    ]);
  });

  it('should add a move when the pointer moves', () => {
    expect(readPointerEvents('pointermove', 128, 64)).toEqual([
      { kind: 'MOVE', row: 16, column: 32 },
    ]);
  });

  it('should add a release when a button comes up', () => {
    expect(readPointerEvents('pointerup', 128, 64)).toEqual([
      { kind: 'RELEASE', row: 16, column: 32 },
    ]);
  });

  it('should add a press in the corner when the pointer is at the top-left of the canvas', () => {
    expect(readPointerEvents('pointerdown', 0, 0)).toEqual([
      { kind: 'PRESS', row: 0, column: 0 },
    ]);
  });

  it('should keep the pointer on the canvas when a button goes down', () => {
    const listeners: Listeners = {};
    const held: number[] = [];
    const canvas = createCanvas(listeners);

    watchPointer(
      {
        ...canvas,
        setPointerCapture: (pointerId: number) => {
          held.push(pointerId);
        },
        addEventListener: canvas.addEventListener,
      } as unknown as HTMLCanvasElement,
      PIXEL_SIZE,
      createInputMailbox(),
    );
    listeners['pointerdown']?.(createEvent(0, 0));

    expect(held).toEqual([POINTER_ID]);
  });

  it('should give back the canvas it watches when it starts watching', () => {
    const listeners: Listeners = {};
    const canvas = createCanvas(listeners);

    expect(watchPointer(canvas, PIXEL_SIZE, createInputMailbox())).toBe(canvas);
  });
});
