import { runEffect } from '@cassette-canvas/common';
import { pipe } from 'remeda';
import { drawCrt } from '../../crt/draw-crt';
import { computeFrame } from '../../frame/compute-frame';
import type { Screen } from '../../screen/types/screen';
import type { Display } from '../types/display';
import { toFrameBytes } from './to-frame-bytes';

export const drawScreenFrame = (
  display: Display,
  screen: Screen,
  time: number,
): Display =>
  pipe(
    computeFrame(screen, display.spriteSize, display.width, display.height),
    (frame) => toFrameBytes(frame, display.palette),
    (bytes) =>
      runEffect(
        { ...display, drawnAt: time },
        ({ context, crt, width, height, pixelSize }) =>
          drawCrt(context, crt, { bytes, width, height, pixelSize }, time),
      ),
  );
