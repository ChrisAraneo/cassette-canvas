import type { Crt } from '../../types/crt';

export interface CrtTriangle {
  readonly context: WebGLRenderingContext;
  readonly crt: Crt;
}
