import { runEffect } from '@cassette-canvas/common';
import { constant } from 'lodash-es';
import { match, P } from 'ts-pattern';
import { isPixel } from '../../palette/is-pixel';
import type { OverlayPaint } from '../types/overlay-paint';
import { drawFill } from './draw-fill';
import { drawImage } from './draw-image';

const { nonNullable, when } = P;

export const drawPaint = (
  pixels: number[],
  width: number,
  height: number,
  paint: OverlayPaint,
): number[] =>
  runEffect(pixels, () =>
    match(paint)
      .with({ image: nonNullable }, (image) =>
        drawImage(pixels, width, height, image),
      )
      .with({ pixel: when(isPixel) }, (fill) =>
        drawFill(pixels, width, height, fill),
      )
      .otherwise(constant(undefined)),
  );
