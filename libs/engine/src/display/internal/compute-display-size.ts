import { floor } from 'lodash-es';
import type { DisplaySize } from './types/display-size';

export const computeDisplaySize = (
  canvas: Pick<HTMLCanvasElement, 'width' | 'height'>,
  pixelSize: number,
): DisplaySize => ({
  width: floor(canvas.width / pixelSize),
  height: floor(canvas.height / pixelSize),
});
