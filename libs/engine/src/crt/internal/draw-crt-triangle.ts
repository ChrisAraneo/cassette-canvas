import { pipe } from 'remeda';
import { drawCrtCorners } from './draw-crt-corners';
import { patchCrtPositionAttribute } from './patch-crt-position-attribute';
import { patchCrtPositionPointer } from './patch-crt-position-pointer';
import { patchCrtVertexBuffer } from './patch-crt-vertex-buffer';
import { patchCrtViewport } from './patch-crt-viewport';
import type { CrtTriangle } from './types/crt-triangle';

export const drawCrtTriangle = ({
  context,
  crt,
}: CrtTriangle): WebGLRenderingContext =>
  pipe(
    context,
    patchCrtViewport,
    (ready) => patchCrtVertexBuffer(ready, crt),
    patchCrtPositionAttribute,
    patchCrtPositionPointer,
    drawCrtCorners,
  );
