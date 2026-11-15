import type { Crt } from '../../types/crt';
import type { CrtPicture } from '../../types/crt-picture';

export interface CrtFrame {
  readonly context: WebGLRenderingContext;
  readonly crt: Crt;
  readonly picture: CrtPicture;
  readonly time: number;
}
