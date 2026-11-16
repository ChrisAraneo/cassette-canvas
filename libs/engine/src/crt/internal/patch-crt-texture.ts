import { pipe } from 'remeda';
import { patchCrtTextureBinding } from './patch-crt-texture-binding';
import { patchCrtTextureImage } from './patch-crt-texture-image';
import type { CrtFrame } from './types/crt-frame';

export const patchCrtTexture = ({
  context,
  crt,
  picture,
  time,
}: CrtFrame): CrtFrame =>
  pipe(
    context,
    (ready) => patchCrtTextureBinding(ready, crt),
    (bound) => patchCrtTextureImage(bound, picture),
    (uploaded) => ({ context: uploaded, crt, picture, time }),
  );
