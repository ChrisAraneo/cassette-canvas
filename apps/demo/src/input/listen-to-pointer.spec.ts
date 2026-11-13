import type { HudEvent } from '@cassette-canvas/engine';
import { noop } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { createInputMailbox } from './create-input-mailbox';
import { listenToPointer } from './listen-to-pointer';

const PIXEL_SIZE = 4;

type Listeners = Record<string, (event: PointerEvent) => void>;

const createCanvas = (listeners: Listeners): HTMLCanvasElement =>
  ({
    width: 1280,
    height: 720,
    getBoundingClientRect: () => ({
      top: 0,
      left: 0,
      width: 1280,
      height: 720,
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
  ({ clientX, clientY, pointerId: 1 }) as unknown as PointerEvent;

const listen = (name: string, clientX: number, clientY: number): HudEvent[] => {
  const listeners: Listeners = {};
  const mailbox = createInputMailbox();

  listenToPointer(createCanvas(listeners), PIXEL_SIZE, mailbox);
  listeners[name]?.(createEvent(clientX, clientY));

  return [...mailbox.drain()];
};

describe('listenToPointer', () => {
  it('should post a press when a button goes down', () => {
    expect(listen('pointerdown', 128, 64)).toEqual([
      { kind: 'press', row: 16, column: 32 },
    ]);
  });

  it('should post a move when the pointer moves', () => {
    expect(listen('pointermove', 128, 64)).toEqual([
      { kind: 'move', row: 16, column: 32 },
    ]);
  });

  it('should post a release when a button comes up', () => {
    expect(listen('pointerup', 128, 64)).toEqual([
      { kind: 'release', row: 16, column: 32 },
    ]);
  });

  it('should take hold of the pointer while a button is down', () => {
    const listeners: Listeners = {};
    const held: number[] = [];
    const canvas = createCanvas(listeners);

    listenToPointer(
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

    expect(held).toEqual([1]);
  });
});
