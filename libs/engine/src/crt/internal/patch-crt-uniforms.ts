import { pipe } from 'remeda';
import { patchCrtCanvasSizeUniform } from './patch-crt-canvas-size-uniform';
import { patchCrtFrameSizeUniform } from './patch-crt-frame-size-uniform';
import { patchCrtFrameUniform } from './patch-crt-frame-uniform';
import { patchCrtPixelSizeUniform } from './patch-crt-pixel-size-uniform';
import { patchCrtProgram } from './patch-crt-program';
import { patchCrtTimeUniform } from './patch-crt-time-uniform';
import type { CrtFrame } from './types/crt-frame';
import type { CrtTriangle } from './types/crt-triangle';

export const patchCrtUniforms = ({
  context,
  crt,
  picture,
  time,
}: CrtFrame): CrtTriangle =>
  pipe(
    context,
    (ready) => patchCrtProgram(ready, crt),
    (used) => patchCrtFrameUniform(used, crt),
    (framed) => patchCrtFrameSizeUniform(framed, crt, picture),
    (sized) => patchCrtCanvasSizeUniform(sized, crt),
    (measured) => patchCrtPixelSizeUniform(measured, crt, picture),
    (scaled) => patchCrtTimeUniform(scaled, crt, time),
    (timed) => ({ context: timed, crt }),
  );
